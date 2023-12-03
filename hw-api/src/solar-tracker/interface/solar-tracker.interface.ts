import { IDevice } from '../../abstract-device/interface';

export interface ISolarTrackerSensorsStatus {
    irradianceSensor: boolean;
    accelerometer: boolean;
    azimuthMotor: boolean;
    elevationMotor: boolean;
}

export interface ISolarTracker extends IDevice {
    sensorsStatus: ISolarTrackerSensorsStatus;
}