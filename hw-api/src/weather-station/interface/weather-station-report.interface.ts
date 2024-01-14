import { IDeviceReport } from '../../abstract-device/interface';
import { SensorReport } from '../../abstract-device/schema';

export interface IWeatherStationReport extends IDeviceReport {
    anemometer?: SensorReport;
    temperatureSensor?: SensorReport;
}