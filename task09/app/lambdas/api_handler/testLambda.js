(async () => {
    const { handler } = require("../api_handler/index"); // Adjust the path if needed

    // Define a valid event (simulating API Gateway request)
    const event = {
        rawPath: "/weather",
        requestContext: { http: { method: "GET" } },
    };

    console.log("Invoking Lambda function...");
    const response = await handler(event);

    console.log("Lambda Response:");
    console.log(JSON.stringify(response, null, 2));
})();
