(async () => {
    const WeatherClient = require("../weather_sdk/WeatherClient");
    const client = new WeatherClient();
    const data = await client.getWeather(50.4375, 30.5);
    console.log(JSON.stringify(data, null, 2));
})();
