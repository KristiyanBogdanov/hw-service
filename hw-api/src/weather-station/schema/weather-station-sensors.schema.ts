import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDateString, IsEnum, IsNumber, IsPositive } from 'class-validator';
import { IWeatherStationSensors } from '../interface';
import { WindDirection } from '../enum';

@Schema({
    collection: 'weatherStationsSensors',
    timeseries: {
        timeField: 'timestamp',
        metaField: 'serialNumber',
        granularity: 'minutes'
    }
})
export class WeatherStationSensors implements IWeatherStationSensors {
    @Prop({
        index: { name: 'wsSerialNumberIndex' },
        required: true
    })
    serialNumber: string;

    @IsPositive()
    @Prop({ required: true })
    windSpeed: number;

    @IsEnum(WindDirection)
    @Prop({
        type: String,
        enum: WindDirection,
        required: true 
    })
    windDirection: WindDirection;

    @IsNumber()
    @Prop({ required: true })
    temperature: number;

    @IsDateString()
    @Prop({ required: true })
    timestamp: Date;
}

export const WeatherStationSensorsSchema = SchemaFactory.createForClass(WeatherStationSensors);