import { PickType } from '@nestjs/mapped-types';
import { Exclude, Expose, Transform } from 'class-transformer';
import { WeatherStationReport } from '../schema';

export class ReportWSSensorsStatusReq extends PickType(WeatherStationReport, [
    'anemometer',
    'temperatureSensor',
    'timestamp'
]) { }

@Exclude()
export class ReportWSSensorsStatusRes {
    @Expose({ name: '_id' })
    @Transform((value) => value.obj._id.toString())
    oid: string;
}