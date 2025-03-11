exports.handler = async (event) => {
    console.log("Received SQS Event:", JSON.stringify(event, null, 2));

    for (const record of event.Records) {
        console.log("Message Body:", record.body);
    }

    return { statusCode: 200, body: "Processed SQS Messages" };
};
