import { IDevice } from '../../abstract-device/interface';

export interface IWeatherStationSensorsStatus {
    anemometer: boolean;
    temperatureSensor: boolean;
}

export interface IWeatherStation extends IDevice {
    sensorsStatus: IWeatherStationSensorsStatus;
}