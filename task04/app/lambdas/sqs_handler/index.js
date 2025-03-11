exports.handler = async (event) => {
    try {
        // Loop through each received SQS message
        for (const record of event.Records) {
            console.log("Received SQS Message:", JSON.stringify(record.body));
        }

        return {
            statusCode: 200,
            body: JSON.stringify("SQS messages logged successfully"),
        };
    } catch (error) {
        console.error("Error processing SQS messages:", error);
        return {
            statusCode: 500,
            body: JSON.stringify("Error processing SQS messages"),
        };
    }
};