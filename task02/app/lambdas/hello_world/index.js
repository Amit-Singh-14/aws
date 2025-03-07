exports.handler = async (event) => {
    // TODO implement
    const path = event.rawPath;
    const method = event.requestContext.http.method;

    if (path === "/hello" && method === "GET") {
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Hello from Lambda" }),
            headers: { "Content-type": "application/json" }
        }
    } else {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: `Bad request syntax or unsupported method. Request path: ${path}. HTTP method: ${method}`
            }),
            headers: { "Content-Type": "application/json" }
        };
    }
};
