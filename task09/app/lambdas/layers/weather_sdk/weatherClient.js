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
                    hourly: "temperature_2m,relative_humidity_2m,wind_speed_10m",  // Ensure correct parameter format
                    timezone: "auto",
                }
            });

            console.log("Weather API Response:", JSON.stringify(response.data, null, 2));  // Debugging

            return response.data;
        } catch (error) {
            console.error("Error fetching weather data:", error.message);
            throw new Error("Failed to retrieve weather data");
        }
    }
}

module.exports = WeatherClient;
