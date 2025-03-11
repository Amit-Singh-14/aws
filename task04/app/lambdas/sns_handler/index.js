exports.handler = async (event) => {
    try {
        // Loop through each received SNS message
        for (const record of event.Records) {
            console.log("Received SNS Message:", JSON.stringify(record.Sns.Message));
        }

        return {
            statusCode: 200,
            body: JSON.stringify("SNS messages logged successfully"),
        };
    } catch (error) {
        console.error("Error processing SNS messages:", error);
        return {
            statusCode: 500,
            body: JSON.stringify("Error processing SNS messages"),
        };
    }
};