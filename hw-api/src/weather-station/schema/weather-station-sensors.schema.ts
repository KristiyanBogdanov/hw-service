import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDateString, IsEnum, IsNumber, IsPositive } from 'class-validator';
import { Expose } from 'class-transformer';
import { IWeatherStationSensors } from '../interface';
import { WindDirection } from '../enum';

@Schema({
    collection: 'weatherStationsSensors',
    versionKey: false,
    timeseries: {
        timeField: 'timestamp',
        metaField: 'serialNumber',
        granularity: 'minutes'
    }
})
export class WeatherStationSensors implements IWeatherStationSensors {
    @Expose()
    id: string;

    @Expose()
    @Prop({
        index: { name: 'wsIdIndex' },
        required: true
    })
    deviceId: string;

    @Expose()
    @IsPositive()
    @Prop({ required: true })
    windSpeed: number;

    @Expose()
    @IsEnum(WindDirection)
    @Prop({
        type: String,
        enum: WindDirection,
        required: true 
    })
    windDirection: WindDirection;

    @Expose()
    @IsNumber()
    @Prop({ required: true })
    temperature: number;

    @Expose()
    @IsDateString()
    @Prop({ required: true })
    timestamp: Date;

    constructor(partial: Partial<WeatherStationSensors>) {
        Object.assign(this, partial);
    }
}

export const WeatherStationSensorsSchema = SchemaFactory.createForClass(WeatherStationSensors);