import axios from "axios";

export async function getWeatherData(cityName: string) {
    const url = `https://wttr.in/${cityName.toLowerCase()}?format=%C+%t`;
    const response = await axios.get(url);

    return JSON.stringify({
        city: cityName,
        weatherInfo: response.data,
    });
}
