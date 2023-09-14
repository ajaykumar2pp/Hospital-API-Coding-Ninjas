const reportController = require("../app/controller/reportController")
function initRoutes(app) {
    //*********************************   API routes  **************************** *//
    

    //  Get  http://localhost:2000/reports/:status
    app.get('/reports/:status', reportController().getReportsByStatus)


}
module.exports = initRoutes