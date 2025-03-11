exports.handler = async (event) => {
    console.log("SQS Event Received:", JSON.stringify(event, null, 2));
    return { statusCode: 200, body: "Message logged successfully." };
};
