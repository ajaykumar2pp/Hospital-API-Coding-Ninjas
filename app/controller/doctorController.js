
require('dotenv').config()
const Doctor = require('../models/doctorModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function doctorController() {
  return {

    // *********  Home page Hospital **************//
    homePage(req, resp) {
      resp.render('hospital')
    },

    // **********  Doctor Register *********//
    async registerDoctor(req, resp) {
      try {
        const { name,password } = req.body
        // Validate input data
        if (!name || !password ) {
          return resp.status(400).json({ message: 'Missing required fields.' });
        }
        // Check if a doctor with the same name already exists
        const existingDoctor = await Doctor.findOne({ name });

        if (existingDoctor) {
          return resp.status(409).json({ message: 'Doctor already exists' });
        } else {

          // Hash the password before storing it in the database
          const hashedPassword = await bcrypt.hash(req.body.password, 10);

          // Create the new doctor
          const newDoctor = await Doctor.create({
            name,
            password: hashedPassword

          });
          const savedDoctor = await newDoctor.save();
          resp.status(200).json({
            message: 'Doctor registered successfully',
            doctorID: newDoctor._id,
            Name: newDoctor.name
          })
          console.log('Doctor saved successfully:', savedDoctor);

        }
      } catch (error) {
        console.error('Error registering doctor:', error);
        return resp.status(500).json({
          message: 'Internal Server Error',
        });

      }
    },

    // ***********  Doctor Login ***********//
    async loginDoctor(req, resp) {
      try {
        const { name, password } = req.body;
        // Validate input data
        if (!name || !password) {
          return resp.status(400).json({ message: 'Missing required fields.' });
        }

        // Check if a Doctor with the provided name exists
        const doctor = await Doctor.findOne({ name });

        if (!doctor) {
          return resp.status(404).json({ message: 'Doctor not found' });
        }

        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, doctor.password);

        if (!passwordMatch) {
          return resp.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({doctorID: doctor._id,Name:doctor.name}, process.env.SECRET_KEY, {
          expiresIn: '1h', // Token expires in 1 hour
        });

        // Return the JWT token to the client
        return resp.status(200).json({
          message: 'Login in successful',
          doctorID: doctor._id,
          Name: doctor.name,
          data: {
            token,
          },
        });
      } catch (error) {
        console.error('Error logging in:', error);
        resp.status(500).json({ message: 'Internal server error' });
      }
    }
  }
}

module.exports = doctorController

