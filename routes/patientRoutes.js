const patientController = require("../app/controller/patientController")
const authMiddleware = require('../app/middleware/authMiddleware')
// const verifyTkoen = require('../app/middleware/authMiddleware')

function initRoutes(app) {
    //*********************************   API routes  **************************** *//


    //  POST  http://localhost:2000/doctors/register
    app.post('/patient/register', patientController().registerPatient)

    //  POST  http://localhost:2000/doctors/login
    app.post('/:id/create_report',authMiddleware, patientController().createPatientReport)

    //  POST  http://localhost:2000/:id/all_reports
    app.get('/:id/all_reports', patientController().getAllReports)
}
module.exports = initRoutes