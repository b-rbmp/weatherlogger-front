
export type TWeatherRecord = {
    weather_station_id: number;
    date: string;
    temperature: number;
    heat_index: number;
    dewpoint: number;
    humidity: number;
    pressure: number;
    dioxide_carbon_ppm: number;
    rain_presence: boolean;
    weather_station: TWeatherStation
}

export type TWeatherStation = {
    api_key: string;
    name: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    altitude: number;
    id: number;
}

export type TNewWeatherStation = {
    api_key: string;
    name: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    altitude: number;
}

export type TCondicoesHistorica = {
    date: string,
    temperature: number,
    heat_index: number,
    dewpoint: number,
    humidity: number,
    pressure: number,
    dioxide_carbon_ppm: number,
    rain_presence: boolean
}
export type TEstacaoData = {
    estacao_info: TWeatherStation,
    start_date: string,
    end_date: string,
    condicoes_historicas: TCondicoesHistorica[]
}

export type TEvolucaoConectividade = {
    date: string;
	connected: number;
}

export type TGlobalData = {
    estacoes_registradas: number;
    estacoes_conectadas: number;
    numero_amostras: number;
    ultima_amostra: string;
    stations: TWeatherStation[];
    preview_station: {
        estacao: TWeatherStation,
        record: TWeatherRecord,
    };
    evolucao_conectividade: TEvolucaoConectividade[];
      
}