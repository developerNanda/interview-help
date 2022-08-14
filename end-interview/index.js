require("dotenv").config();
const fs = require('fs');
const path = require('path');
const util = require('node:util');
const readFileAsync = util.promisify(fs.readFile);
const InterviewService = require("../func-services/InterviewService");


module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    const interviewId = context.bindingData.id;
   
    var filepath = __dirname + '/../html/endInterview.html';
    let interviewDetails = await InterviewService.GetInterviewDetails(interviewId);
    
    // check and update status to started
    if (interviewDetails && interviewDetails?.status == 'started') {
        interviewDetails = await InterviewService.UpdateInterviewStatus(interviewId, 'ended');
    }

    let htmlContent = await readFileAsync(filepath);
    context.res = {
        status: 200,
        headers: {
            'Content-Type': 'text/html'
        },
        body: htmlContent
    };
}