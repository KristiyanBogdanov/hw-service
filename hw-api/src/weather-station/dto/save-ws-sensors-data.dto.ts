import { PickType } from '@nestjs/mapped-types';
import { Exclude, Expose, Transform } from 'class-transformer';
import { WeatherStationSensors } from '../schema';

export class SaveWSSensorsDataReq extends PickType(WeatherStationSensors, [
    'temperature',
    'windSpeed',
    'windDirection',
    'timestamp'
]) { }

@Exclude()
export class SaveWSSensorsDataRes {
    @Expose({ name: '_id' })
    @Transform((value) => value.obj._id.toString())
    oid: string;
}