import { PickType } from '@nestjs/mapped-types';
import { Exclude, Expose, Transform } from 'class-transformer';
import { WeatherStationReport } from '../schema';

export class ReportWSStateReq extends PickType(WeatherStationReport, [
    'anemometer',
    'temperatureSensor',
    'importance',
    'generalMessage',
    'timestamp'
]) { }

@Exclude()
export class ReportWSStateRes {
    @Expose({ name: '_id' })
    @Transform((value) => value.obj._id.toString())
    oid: string;
}