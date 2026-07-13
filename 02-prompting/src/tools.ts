import axios from "axios";
import { exec } from "child_process";

export async function getWeatherData(cityName: string) {
    const url = `https://wttr.in/${cityName.toLowerCase()}?format=%C+%t`;
    const response = await axios.get(url);

    return JSON.stringify({
        city: cityName,
        weatherInfo: response.data,
    });
}

export async function executeCliCommand(commmand: string) {
    return new Promise((res, _) => {
        exec(commmand, (error, stdout) => {
            if (error) return res(`Exec error: ${error}`);
            else return res(stdout);
        });
    });
}
