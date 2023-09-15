require('dotenv').config()
const Patient = require('../models/patientModel')
const Report = require('../models/reportModel');

function patientController() {
  return {

    // **********  Patient Register *********//
    async registerPatient(req, resp) {
      try {

        const { name, phone, addharNumber, city, } = req.body
        // Validate input data
        if (!name || !phone || !addharNumber || !city) {
          return resp.status(400).json({ message: 'Missing required fields.' });
        }

        // Check if the Aadhar number has exactly 12 digits
        if (addharNumber.toString().length !== 12) {
          return resp.status(400).json({ message: 'Aadhar number must be exactly 12 digits.' });
        }

        // Check if a patient with the provided Aadhar number already exists
        const existingPatient = await Patient.findOne({ addharNumber });

        if (existingPatient) {
          return resp.status(409).json({ message: 'A patient already exists with this Aadhar Register' });
        } else {


          // Create the new doctor
          const newPatient = await Patient.create({
            name,
            phone,
            city,
            addharNumber
          });
          const savedPatient = await newPatient.save();
          resp.status(200).json({
            message: 'Patient registered successfully',
            patientId: newPatient._id,
            name: newPatient.name,
          })
          console.log('Patient registered successfully:', savedPatient);
        }
      } catch (error) {

        console.error('Error registering doctor:', error);
        return resp.status(500).json({
          message: 'Internal Server Error',
        });

      }
    },

    // *************  Create a Report for Patient  *********//
    async createPatientReport(req, resp) {
      try {
        // Extract the patient's ID from the URL parameters
        const patientId = req.params.id;
        console.log('Patient ID', patientId)

        // Check if the patient exists
        const patient = await Patient.findById(patientId);
        if (!patient) {
          return resp.status(404).json({ message: 'Patient not found.' });
        }

          console.log(req.body)
        
        let doctor = req.user;
        console.log('Doctor Data', doctor)
        if (!doctor) {
          return resp.status(401).json({ message: 'Doctor not found or unauthorized' });
        }

        // Extract report details from the request body
        const { status } = req.body;
        if(!status){
          return resp.status(401).json({ message: 'Plz enter a status filed' });
        }

        const reportData = {
          createdByDoctorID: doctor.doctorID,
          doctorName: doctor.Name,
          patientID: patientId,
          patientName: patient.name, 
          patientAadharNumber: patient.addharNumber, 
          status,
          date: new Date()
        };

        const report = await Report.create(reportData);
        console.log(report)
        // Save the report to the database
        await report.save();

        // Update the patient's reports array
        patient.reports.push(report);
        await patient.save();

        resp.status(201).json({ message: 'Patient report created successfully', report });

      }
      catch (error) {
        console.error('Error creating patient report:', error);
        resp.status(500).json({ message: 'Internal Server Error' });
      }

    },

    // *************  Get All Reports of a Patient  ***********//
    async getAllReports(req, resp) {
      const patientId = req.params.id;
      try {
        // Find all reports for the specified patient, ordered by date
        const reports = await Report.find({ patientID: patientId }).sort({ date: 1 });
        if (reports.length === 0) {
          // No reports found for the specified patient
          resp.status(404).json({ message: `No reports found for patient with ID: ${patientId}` });
        } else {
          // Reports found for the specified patient
          resp.json({
            message: `Get All Reports of User with id -  ${patientId}`,
            reports: reports
          });
        }
      } catch (error) {
        console.error(error);
        resp.status(500).json({ message: 'Internal Server error' });
      }
    }
  }
}

module.exports = patientController
