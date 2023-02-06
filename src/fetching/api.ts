
import axios from "axios";
import { TGlobalData, TWeatherStation, TNewWeatherStation, TEstacaoData } from "./types";

export const getWeatherStations = async() => {
    const { data }: {data: TWeatherStation[]} = await axios.get(
        "https://weatherlogger-backend.onrender.com/weatherlogger/api/v1/weatherstation/"
      );
    return data;
}

export const getGlobalData = async() => {
    const { data }: {data: TGlobalData} = await axios.get(
        "https://weatherlogger-backend.onrender.com/weatherlogger/api/v1/globaldata/"
      );
    return data;
}

export const getEstacaoData = async(weatherStationId: number) => {
    const { data }: {data: TEstacaoData} = await axios.get(
        "https://weatherlogger-backend.onrender.com/weatherlogger/api/v1/estacaodata/"+weatherStationId.toString()
      );
    return data;
}

export const postEstacao = async(newWeatherStation: TNewWeatherStation) => {
    return axios.post('https://weatherlogger-backend.onrender.com/weatherlogger/api/v1/weatherstation/', newWeatherStation)
}