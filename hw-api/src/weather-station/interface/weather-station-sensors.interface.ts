import { ISensorsData } from '../../abstract-device/interface'

export interface IWeatherStationSensors extends ISensorsData {
    windSpeed: number;
    windDirection: string;
    temperature: number;
}