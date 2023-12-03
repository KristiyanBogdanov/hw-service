import { PickType } from '@nestjs/mapped-types';
import { Exclude, Expose, Transform } from 'class-transformer';
import { SolarTrackerReport } from '../schema';

export class ReportSTSensorsStatusReq extends PickType(SolarTrackerReport, [
    'irradianceSensor',
    'accelerometer',
    'azimuthMotor',
    'elevationMotor',
    'timestamp'
]) { }

@Exclude()
export class ReportSTSensorsStatusRes {
    @Expose({ name: '_id' })
    @Transform((value) => value.obj._id.toString())
    oid: string;
}