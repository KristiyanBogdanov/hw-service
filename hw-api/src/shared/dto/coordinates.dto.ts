import { IsLatitude, IsLongitude } from 'class-validator';
import { ILocation } from '../../abstract-device/interface';

export class Coordinates {
    @IsLongitude()
    readonly longitude: number;

    @IsLatitude()
    readonly latitude: number;

    static toLocation(coord: Coordinates): ILocation {
        return {
            type: 'Point',
            coordinates: [coord.longitude, coord.latitude]
        }
    }
}