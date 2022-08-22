require("dotenv").config();
const fs = require('fs');
const path = require('path');
const InterviewService = require("../func-services/InterviewService");
require("../src/indexModels");
const util = require('node:util');
const readFileAsync = util.promisify(fs.readFile);

module.exports = async function (context, req) {
    const questionNo = context.bindingData.questionNo;
    const interviewId = context.bindingData.id;
    const filepath = __dirname + '/../html/videoRecorder.html';
    const errorPage = __dirname + '/../html/errorInterview.html';


    let interviewDetails = await InterviewService.GetInterviewDetails(interviewId);

    // check and update status to started
    if (interviewDetails && interviewDetails?.status == 'Not Yet Started') {
        interviewDetails = await InterviewService.UpdateInterviewStatus(interviewId, 'started');
    }

    // if status is started then return videoRecorder page if not return error page
    if (!!interviewDetails && interviewDetails?.status == 'ended') {
        var endedFlePath = __dirname + '/../html/endInterview.html';
        let endedFlePathData = await readFileAsync(endedFlePath);
        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'text/html'
            },
            body: endedFlePathData
        };
    } 
    interviewDetails = await InterviewService.GetInterviewDetails(interviewId);
    if (!!interviewDetails && interviewDetails?.status == 'started') {
        let startPageData = await readFileAsync(filepath);
        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'text/html'
            },
            body: startPageData
        };
    } else {
        context.log(interviewDetails);
        let errorPageData = await readFileAsync(errorPage);
        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'text/html'
            },
            body: errorPageData
        };
    }
}