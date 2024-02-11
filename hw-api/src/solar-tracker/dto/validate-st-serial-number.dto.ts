import { PickType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { SolarTracker } from '../schema';

@Exclude()
export class ValidateSTSerialNumberRes extends PickType(SolarTracker, [
    'capacity'
]) {
    @Expose()
    isValid: boolean;
}