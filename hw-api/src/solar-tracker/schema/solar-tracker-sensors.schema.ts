import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDateString, IsNumber, IsPositive } from 'class-validator';
import { ISolarTrackerSensors } from '../interface';

@Schema({
    collection: 'solarTrackerSensors',
    timeseries: {
        timeField: 'timestamp',
        metaField: 'serialNumber',
        granularity: 'minutes'
    }
})
export class SolarTrackerSensors implements ISolarTrackerSensors {
    @Prop({
        index: { name: 'stSerialNumberIndex' },
        required: true
    })
    serialNumber: string;

    @IsPositive()
    @Prop({ required: true })
    irradiance: number;

    @IsPositive()
    @Prop({ required: true })
    azimuth: number;

    @IsPositive()
    @Prop({ required: true })
    elevation: number;

    @IsNumber()
    @Prop({ required: true })
    azimuthDeviation: number;

    @IsNumber()
    @Prop({ required: true })
    elevationDeviation: number;

    @IsDateString()
    @Prop({ required: true })
    timestamp: Date;
}

export const SolarTrackerSensorsSchema = SchemaFactory.createForClass(SolarTrackerSensors);