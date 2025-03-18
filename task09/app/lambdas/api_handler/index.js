const axios = require("axios");

class WeatherClient {
    constructor() {
        this.baseUrl = "https://api.open-meteo.com/v1/forecast";
    }

    async getWeather(latitude, longitude) {
        try {
            const response = await axios.get(this.baseUrl, {
                params: {
                    latitude,
                    longitude,
                    hourly: "temperature_2m,relative_humidity_2m,wind_speed_10m", // Ensure correct parameter format
                    timezone: "auto",
                }
            });

            console.log("Weather API Response:", JSON.stringify(response.data, null, 2)); // Debugging
            return response.data;
        } catch (error) {
            console.error("Error fetching weather data:", error.message);
            throw new Error("Failed to retrieve weather data");
        }
    }
}

exports.handler = async (event) => {
    const path = event.rawPath;
    const method = event.requestContext.http.method;

    if (path !== "/weather" || method !== "GET") {
        return {
            statusCode: 400,
            body: JSON.stringify({
                statusCode: 400,
                message: `Bad request syntax or unsupported method. Request path: ${path}. HTTP method: ${method}`
            }),
            headers: { "content-type": "application/json" },
            isBase64Encoded: false
        };
    }

    try {
        const weatherClient = new WeatherClient();
        const weatherData = await weatherClient.getWeather(50.4375, 30.5);

        return {
            statusCode: 200,
            body: JSON.stringify(weatherData),
            headers: { "content-type": "application/json" },
            isBase64Encoded: false
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
            headers: { "content-type": "application/json" },
            isBase64Encoded: false
        };
    }
};
