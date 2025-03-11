exports.handler = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            statusCode: 200,
            message: "Hello from Lambda"
        }),
    };
};
