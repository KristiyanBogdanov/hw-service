import { PickType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { SolarTrackerReport } from '../schema';

export class ReportSTStateReq extends PickType(SolarTrackerReport, [
    'irradianceSensor',
    'accelerometer',
    'azimuthMotor',
    'elevationMotor',
    'importance',
    'generalMessage',
    'advice',
    'timestamp'
]) {
    readonly irradianceSensor: SolarTrackerReport['irradianceSensor'];
    readonly accelerometer: SolarTrackerReport['accelerometer'];
    readonly azimuthMotor: SolarTrackerReport['azimuthMotor'];
    readonly elevationMotor: SolarTrackerReport['elevationMotor'];
    readonly importance: SolarTrackerReport['importance'];
    readonly generalMessage: SolarTrackerReport['generalMessage'];
    readonly timestamp: SolarTrackerReport['timestamp'];
}

@Exclude()
export class ReportSTStateRes extends PickType(SolarTrackerReport, [
    'id',
]) { }