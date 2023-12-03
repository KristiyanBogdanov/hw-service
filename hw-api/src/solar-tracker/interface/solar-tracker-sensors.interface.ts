import { ISensorsData } from '../../abstract-device/interface'

export interface ISolarTrackerSensors extends ISensorsData {
    irradiance: number;
    azimuth: number;
    elevation: number;
    azimuthDeviation: number;
    elevationDeviation: number;
}