import { ISensorsData } from '../../abstract-device/interface'
import { WindDirection } from '../enum';

export interface IWeatherStationSensors extends ISensorsData {
    windSpeed: number;
    windDirection: WindDirection;
    temperature: number;
}