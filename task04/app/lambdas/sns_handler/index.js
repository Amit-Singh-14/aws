exports.handler = async (event) => {
    console.log("Received SNS Event:", JSON.stringify(event, null, 2));

    for (const record of event.Records) {
        console.log("SNS Message:", record.Sns.Message);
    }

    return { statusCode: 200, body: "Processed SNS Messages" };
};
