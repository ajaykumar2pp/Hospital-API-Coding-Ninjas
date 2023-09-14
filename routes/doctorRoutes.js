const doctorController = require("../app/controller/doctorController")
function initRoutes(app) {
    //*********************************   API routes  **************************** *//
    app.get('/', doctorController().homePage);

    //  POST  http://localhost:2000/doctors/register
    app.post('/doctors/register', doctorController().registerDoctor)

    //  POST  http://localhost:2000/doctors/login
    app.post('/doctors/login', doctorController().loginDoctor)

}
module.exports = initRoutes