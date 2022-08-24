const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1 } = require('uuid');
var multipart = require("parse-multipart");
var azure = require('azure-storage');
const { uploadQuestionURL } = require('../func-services/InterviewService');

module.exports = async function (context, req) {
    var bufferbody = Buffer.from(req.body);
    var boundary = multipart.getBoundary(req.headers['content-type']);
    var questionNo = context.bindingData.questionNo;
    var id = context.bindingData.id;
    // console.log(questionNo + id);
    var parts = multipart.Parse(bufferbody, boundary);
    const blobServiceClient = BlobServiceClient.fromConnectionString(
        "DefaultEndpointsProtocol=https;AccountName=orgilavarresourcegra1c6;AccountKey=YxkGQrkGMWug11Pifcpo+xyz1iXOMhFn40NM8YGYKOCmM5BztXsZ3C4RCYKfYCcFWWX+9wE5hf5a+AStkjnQbw==;EndpointSuffix=core.windows.net"
    );

    const containerName = "interview";
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const blobName = `${id}/${questionNo}-###` + uuidv1() + ".webm";
    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    let { AccountName, AccountKey } = blockBlobClient.credential;
    let resourceUri = blockBlobClient.url;
    const uploadBlobResponse = blockBlobClient.upload(parts[0].data, parts[0].data.length);
    // console.log(uploadBlobResponse);
    let url = createSharedAccessToken(blobName, resourceUri);
    await uploadQuestionURL(url, questionNo, id);
    //   https://orgilavarresourcegra1c6.blob.core.windows.net/interview?sp=racwdli&st=2022-08-06T16:33:50Z&se=2022-08-13T00:33:50Z&skoid=44e36731-6c2e-44c7-ab94-a8c8889aca7d&sktid=0fd1fc08-f43d-4c1b-bd0f-17a9128a60a4&skt=2022-08-06T16:33:50Z&ske=2022-08-13T00:33:50Z&sks=b&skv=2021-06-08&sv=2021-06-08&sr=c&sig=y9AgFZxFsEaeGj5ByZbbLJeV8nKyCsdW48%2Fygg83Erc%3D
    // context.log(context);
    // context.bindings.outputBlob = context.bindings.req;
    context.res = {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: uploadBlobResponse
    };
    // context.done();
}

// DefaultEndpointsProtocol = https;
// AccountName = orgilavarresourcegra1c6;
// AccountKey = YxkGQrkGMWug11Pifcpo + xyz1iXOMhFn40NM8YGYKOCmM5BztXsZ3C4RCYKfYCcFWWX + 9wE5hf5a + AStkjnQbw ==
//     EndpointSuffix=core.windows.net
// orgilavarresourcegra1c6

// var generateSasToken = function (resourceUri, signingKey, policyName, expiresInMins) {
//     resourceUri = encodeURIComponent(resourceUri);

//     // Set expiration in seconds
//     var expires = (Date.now() / 1000) + expiresInMins * 60;
//     expires = Math.ceil(expires);
//     var toSign = resourceUri + '\n' + expires;

//     // Use crypto
//     var hmac = crypto.createHmac('sha256', Buffer.from(signingKey, 'base64'));
//     hmac.update(toSign);
//     var base64UriEncoded = encodeURIComponent(hmac.digest('base64'));

//     // Construct authorization string
//     var token = "SharedAccessSignature sr=" + resourceUri + "&sig="
//         + base64UriEncoded + "&se=" + expires;
//     if (policyName) token += "&skn=" + policyName;
//     return token;
// };

function createSharedAccessToken(blobName, resourceUri) {
    const containerName = "interview";
    let connString = process.env.AzureWebJobsStorage;
    connString = "DefaultEndpointsProtocol=https;AccountName=orgilavarresourcegra1c6;AccountKey=YxkGQrkGMWug11Pifcpo+xyz1iXOMhFn40NM8YGYKOCmM5BztXsZ3C4RCYKfYCcFWWX+9wE5hf5a+AStkjnQbw==;EndpointSuffix=core.windows.net";
    let blobService = azure.createBlobService(connString);
    const permissions = azure.BlobUtilities.SharedAccessPermissions.READ;
    var sharedAccessPolicy = {
        AccessPolicy: {
            Permissions: permissions,
            Start: new Date().setMinutes(new Date().getMinutes() - 5),
            Expiry: new Date().setMinutes(new Date().getMinutes() + (60 * 60 * 24 * 3))
        }
    };
    var sasToken = blobService.generateSharedAccessSignature(containerName, blobName, sharedAccessPolicy);
    var url = blobService.getUrl(containerName, blobName, sasToken, true);
    console.log(resourceUri);
    console.log(sasToken);
    return url;
    // if (!uri || !saName || !saKey) {
    //     throw "Missing required parameter";
    // }
    // var encoded = encodeURIComponent(uri);
    // var now = new Date();
    // var week = 60 * 60 * 24 * 7;
    // var ttl = Math.round(now.getTime() / 1000) + week;
    // var signature = encoded + '\n' + ttl;
    // var signatureUTF8 = utf8.encode(signature);
    // var hash = crypto.createHmac('sha256', saKey).update(signatureUTF8).digest('base64');
    // console.log('SharedAccessSignature sr=' + encoded + '&sig=' +
    //     encodeURIComponent(hash) + '&se=' + ttl + '&skn=' + saName);
    // return 'SharedAccessSignature sr=' + encoded + '&sig=' +
    //     encodeURIComponent(hash) + '&se=' + ttl + '&skn=' + saName;

}