import { IsLatitude, IsLongitude } from 'class-validator';
import { ILocation } from '../../abstract-device/interface';

export class CoordinatesDto {
    @IsLongitude()
    readonly longitude: number;

    @IsLatitude()
    readonly latitude: number;

    static toLocation(coord: CoordinatesDto): ILocation {
        return {
            type: 'Point',
            coordinates: [coord.longitude, coord.latitude]
        }
    }

    static fromLocation(location: ILocation): CoordinatesDto {
        return {
            longitude: location.coordinates[0],
            latitude: location.coordinates[1]
        }
    }
}