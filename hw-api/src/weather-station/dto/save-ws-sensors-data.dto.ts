import { PickType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { WeatherStationSensors } from '../schema';

export class SaveWSSensorsDataReq extends PickType(WeatherStationSensors, [
    'temperature',
    'windSpeed',
    'windDirection',
    'timestamp'
]) {
    readonly temperature: WeatherStationSensors['temperature'];
    readonly windSpeed: WeatherStationSensors['windSpeed'];
    readonly windDirection: WeatherStationSensors['windDirection'];
    readonly timestamp: WeatherStationSensors['timestamp'];
}

@Exclude()
export class SaveWSSensorsDataRes extends PickType(WeatherStationSensors, [
    'id',
]) { }