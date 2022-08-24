require("dotenv").config();
const fs = require('fs');
const path = require('path');
const InterviewService = require("../func-services/InterviewService");
require("../src/indexModels");
const util = require('node:util');
const readFileAsync = util.promisify(fs.readFile);

module.exports = async function (context, req) {
    const interviewId = context.bindingData.id;
    context.log('LOGGER ------>' + interviewId);
    const filepath = __dirname + '/../html/startInterview.html';
    const errorPage = __dirname + '/../html/errorInterview.html';

    const interviewDetails = await InterviewService.GetInterviewDetails(interviewId);

    context.log(interviewDetails);
    if (!!interviewDetails && interviewDetails?.status === 'ended') {
        var endedFlePath = __dirname + '/../html/endInterview.html';

        let endedFlePathData = await readFileAsync(endedFlePath);
        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'text/html'
            },
            body: endedFlePathData
        };
    } else if (!!interviewDetails && interviewDetails?.status !== 'ended') {
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