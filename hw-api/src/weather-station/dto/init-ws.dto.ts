import { PickType } from '@nestjs/mapped-types';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { CoordinatesDto } from '../../shared/dto';
import { WeatherStation } from '../schema';

export class InitWSReq extends PickType(WeatherStation, [
    'serialNumber',
    'installationDate',
    'sensorsStatus'
]) {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CoordinatesDto)
    readonly coordinates: CoordinatesDto;
}

@Exclude()
export class InitWSRes {
    @Expose({ name: '_id' })
    @Transform((value) => value.obj._id.toString())
    oid: string;
}