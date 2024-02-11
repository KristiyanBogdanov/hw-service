import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDateString, IsNumber, IsPositive, Max, Min } from 'class-validator';
import { Expose } from 'class-transformer';
import { SOLAR_TRACKER_AZIMUTH_MAX_ANGLE, SOLAR_TRACKER_AZIMUTH_MIN_ANGLE, SOLAR_TRACKER_ELEVATION_MAX_ANGLE, SOLAR_TRACKER_ELEVATION_MIN_ANGLE } from '../../shared/constants';
import { ISolarTrackerSensors } from '../interface';

@Schema({
    collection: 'solarTrackerSensors',
    versionKey: false,
    timeseries: {
        timeField: 'timestamp',
        metaField: 'serialNumber',
        granularity: 'minutes'
    }
})
export class SolarTrackerSensors implements ISolarTrackerSensors {
    @Expose()
    id: string;

    @Expose()
    @Prop({
        index: { name: 'stIdIndex' },
        required: true
    })
    deviceId: string;

    @Expose()
    @IsPositive()
    @Prop({ required: true })
    irradiance: number;

    @Expose()
    @IsNumber()
    @Min(SOLAR_TRACKER_AZIMUTH_MIN_ANGLE)
    @Max(SOLAR_TRACKER_AZIMUTH_MAX_ANGLE)
    @Prop({ required: true })
    azimuth: number;

    @Expose()
    @IsNumber()
    @Min(SOLAR_TRACKER_ELEVATION_MIN_ANGLE)
    @Max(SOLAR_TRACKER_ELEVATION_MAX_ANGLE)
    @Prop({ required: true })
    elevation: number;

    @Expose()
    @IsNumber()
    @Prop({ required: true })
    azimuthDeviation: number;

    @Expose()
    @IsNumber()
    @Prop({ required: true })
    elevationDeviation: number;

    @Expose()
    @IsDateString()
    @Prop({ required: true })
    timestamp: Date;

    constructor(partial: Partial<SolarTrackerSensors>) {
        Object.assign(this, partial);
    }
}

export const SolarTrackerSensorsSchema = SchemaFactory.createForClass(SolarTrackerSensors);