import { PickType } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import { AverageSensorValueDto, CoordinatesDto } from '../../shared/dto';
import { SolarTracker } from '../schema';

export class GetSTInsightsReq {
    @IsArray()
    @ArrayMinSize(1)
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    serialNumbers: ReadonlyArray<string>;
}

@Exclude()
export class STInsightsDto extends PickType(SolarTracker, [
    'installationDate',
    'sensorsStatus',
    'capacity',
    'isActive',
    'lastUpdate'
]) {
    coordinates: CoordinatesDto;
    currentAzimuth: number;
    currentElevation: number;
    azimuthDeviation: number;
    elevationDeviation: number;
    last24hAvgIrradiance: AverageSensorValueDto[];
}

export class GetSTInsightsRes {
    data: Record<string, STInsightsDto>;
}