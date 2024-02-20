import { PickType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { AverageSensorValueDto, CoordinatesDto } from '../../shared/dto';
import { WeatherStation } from '../schema';

@Exclude()
export class GetWSInsightsRes extends PickType(WeatherStation, [
    'installationDate',
    'sensorsStatus',
    'isActive',
    'lastUpdate'
]) {
    coordinates: CoordinatesDto;
    currentTemperature: number;
    currentWindSpeed: number;
    currentWindDirection: string;
    last24hAvgTemperature: AverageSensorValueDto[];
    last24hAvgWindSpeed: AverageSensorValueDto[];
}