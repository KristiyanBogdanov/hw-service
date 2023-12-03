import { PickType } from '@nestjs/mapped-types';
import { Exclude, Expose, Transform } from 'class-transformer';
import { SolarTrackerSensors } from '../schema';

export class SaveSTSensorsDataReq extends PickType(SolarTrackerSensors, [
    'irradiance',
    'azimuth',
    'elevation',
    'azimuthDeviation',
    'elevationDeviation',
    'timestamp'
]) { }

@Exclude()
export class SaveSTSensorsDataRes {
    @Expose({ name: '_id' })
    @Transform((value) => value.obj._id.toString())
    oid: string;
}