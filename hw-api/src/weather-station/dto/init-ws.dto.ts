import { PickType } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { CoordinatesDto } from '../../shared/dto';
import { WeatherStation } from '../schema';

export class InitWSReq extends PickType(WeatherStation, [
    'serialNumber',
    'installationDate',
    'sensorsStatus'
]) {
    readonly serialNumber: WeatherStation['serialNumber'];
    readonly sensorsStatus: Readonly<WeatherStation['sensorsStatus']>;
    readonly installationDate: WeatherStation['installationDate'];

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CoordinatesDto)
    readonly coordinates: CoordinatesDto;
}

@Exclude()
export class InitWSRes extends PickType(WeatherStation, [
    'id'
]) { }