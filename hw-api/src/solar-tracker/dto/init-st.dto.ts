import { PickType } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { CoordinatesDto } from '../../abstract-device/dto';
import { SolarTracker } from '../schema';

export class InitSTReq extends PickType(SolarTracker, [
    'serialNumber',
    'sensorsStatus',
    'capacity',
    'installationDate'
]) {
    readonly serialNumber: SolarTracker['serialNumber'];
    readonly sensorsStatus: Readonly<SolarTracker['sensorsStatus']>;
    readonly installationDate: SolarTracker['installationDate'];

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CoordinatesDto)
    readonly coordinates: Readonly<CoordinatesDto>;
}

@Exclude()
export class InitSTRes extends PickType(SolarTracker, [
    'id'
]) { }