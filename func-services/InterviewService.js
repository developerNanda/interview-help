const { MongoClient, ObjectId } = require('mongodb');
const client = new MongoClient(process.env.DATABASE);
const fs = require('fs');
const util = require('node:util');
const readFileAsync = util.promisify(fs.readFile);

const GetInterviewDetails = async (id) => {
    await client.connect();
    const db = await client.db("Cluster0");
    const interviewCollection = await db.collection('interviewmodels');

    var o_id = ObjectId(id);
    const interviewDetails = await interviewCollection.findOne(({ '_id': o_id }));
    return interviewDetails;
}

const UpdateInterviewStatus = async (id, statusMessage) => {
    await client.connect();
    const db = await client.db("Cluster0");
    const interviewCollection = await db.collection('interviewmodels');

    var o_id = ObjectId(id);
    const interviewDetails = await interviewCollection.findOneAndUpdate({ '_id': o_id }, { $set: { status: statusMessage } }, { upsert: true });
    return interviewDetails;
}

const uploadQuestionURL = async (url, questionNo, id) =>{
    await client.connect();
    const db = await client.db("Cluster0");
    const interviewCollection = await db.collection('interviewmodels');

    var o_id = ObjectId(id);
    const interviewDetails = await interviewCollection.update({ '_id': o_id, 'interviewQuestions.questionId': questionNo }, { $set: { "interviewQuestions.$.videoURL": url } }, { upsert: true });
    return interviewDetails;
}


module.exports = { GetInterviewDetails, UpdateInterviewStatus, uploadQuestionURL };