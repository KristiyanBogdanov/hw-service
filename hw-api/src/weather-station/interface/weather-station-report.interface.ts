import { ISensorsReport } from '../../abstract-device/interface';
import { SensorReport } from '../../abstract-device/schema';

export interface IWeatherStationReport extends ISensorsReport {
    anemometer?: SensorReport;
    temperatureSensor?: SensorReport;
}