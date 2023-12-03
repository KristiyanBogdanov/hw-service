import { PickType } from '@nestjs/mapped-types';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Coordinates } from '../../shared/dto';
import { SolarTracker } from '../schema';

export class InitSTReq extends PickType(SolarTracker, [
    'serialNumber',
    'installationDate',
    'sensorsStatus'
]) {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => Coordinates)
    readonly coordinates: Coordinates;
}

@Exclude()
export class InitSTRes {
    @Expose({ name: '_id' })
    @Transform((value) => value.obj._id.toString())
    oid: string;
}