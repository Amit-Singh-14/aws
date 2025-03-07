exports.handler = async (event) => {
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
        headers: { "Content-Type": "application/json" },
    };
    return response;
};
