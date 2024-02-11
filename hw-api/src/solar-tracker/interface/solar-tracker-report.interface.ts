import { IDeviceReport } from '../../abstract-device/interface';
import { SensorReport } from '../../abstract-device/schema';

export interface ISolarTrackerReport extends IDeviceReport {
    irradianceSensor: SensorReport;
    accelerometer: SensorReport;
    azimuthMotor: SensorReport;
    elevationMotor: SensorReport;
}