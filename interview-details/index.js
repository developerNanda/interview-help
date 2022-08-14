const InterviewService = require("../func-services/InterviewService");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    var interviewId = context.bindingData.id;
    var interviewDetailsType = context.bindingData.type;
    const interviewDetails = await InterviewService.GetInterviewDetails(interviewId);
    console.log(interviewDetails);
    // const interviewDetails = GetInterviewDetails("62e87cb3af529e38e4fddc87");
    const outObject = {
        "candidateName": interviewDetails?.candidateName || "",
        "candidateEmail": interviewDetails?.candidateEmail || "",
        "languagesTools": interviewDetails?.languagesTools || [],
        "jobRole": interviewDetails?.jobRole || "",
        "companyName": interviewDetails?.companyName || "",
        "interviewTime": interviewDetails?.interviewTime || "",
        "jobDescription": interviewDetails?.interviewDetails || "",
        "questions": [],
    };
    if (interviewDetailsType == "questions") {
        console.log(interviewDetails?.interviewQuestions);
        outObject.questions.push(...interviewDetails?.interviewQuestions || []);
    }
    context.res = {
        body: outObject,
    };
}