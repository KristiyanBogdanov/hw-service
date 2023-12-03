import { ISensorsReport } from '../../abstract-device/interface';
import { SensorReport } from '../../abstract-device/schema';

export interface ISolarTrackerReport extends ISensorsReport {
    irradianceSensor?: SensorReport;
    accelerometer?: SensorReport;
    azimuthMotor?: SensorReport;
    elevationMotor?: SensorReport;
}