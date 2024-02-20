import { PickType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { SolarTrackerSensors } from '../schema';

export class SaveSTSensorsDataReq extends PickType(SolarTrackerSensors, [
    'irradiance',
    'azimuth',
    'elevation',
    'azimuthDeviation',
    'elevationDeviation',
    'timestamp'
]) {
    readonly irradiance: SolarTrackerSensors['irradiance'];
    readonly azimuth: SolarTrackerSensors['azimuth'];
    readonly elevation: SolarTrackerSensors['elevation'];
    readonly azimuthDeviation: SolarTrackerSensors['azimuthDeviation'];
    readonly elevationDeviation: SolarTrackerSensors['elevationDeviation'];
    readonly timestamp: SolarTrackerSensors['timestamp'];
}

@Exclude()
export class SaveSTSensorsDataRes extends PickType(SolarTrackerSensors, [
    'id',
]) { }