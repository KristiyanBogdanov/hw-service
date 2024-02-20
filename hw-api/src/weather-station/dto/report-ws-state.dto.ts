import { PickType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { WeatherStationReport } from '../schema';

export class ReportWSStateReq extends PickType(WeatherStationReport, [
    'anemometer',
    'temperatureSensor',
    'importance',
    'generalMessage',
    'advice',
    'timestamp'
]) {
    readonly anemometer: WeatherStationReport['anemometer'];
    readonly temperatureSensor: WeatherStationReport['temperatureSensor'];
    readonly importance: WeatherStationReport['importance'];
    readonly generalMessage: WeatherStationReport['generalMessage'];
    readonly timestamp: WeatherStationReport['timestamp'];
}

@Exclude()
export class ReportWSStateRes extends PickType(WeatherStationReport, [
    'id',
]) { }