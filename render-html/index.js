const fs = require('fs');
const path = require('path');
const util = require('node:util');
const readFileAsync = util.promisify(fs.readFile);

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    const route = context.bindingData.route;

    var filepath = __dirname + '/../html/support.html';

    // check and update status to started
    if (route == 'index') {
        let htmlContent = await readFileAsync(filepath);
        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'text/html'
            },
            body: htmlContent
        };
    }
}