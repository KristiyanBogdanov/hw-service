import { PickType } from '@nestjs/mapped-types';
import { Exclude, Expose, Transform } from 'class-transformer';
import { SolarTrackerReport } from '../schema';

export class ReportSTStateReq extends PickType(SolarTrackerReport, [
    'irradianceSensor',
    'accelerometer',
    'azimuthMotor',
    'elevationMotor',
    'importance',
    'generalMessage',
    'timestamp'
]) { }

@Exclude()
export class ReportSTStateRes {
    @Expose({ name: '_id' })
    @Transform((value) => value.obj._id.toString())
    oid: string;
}