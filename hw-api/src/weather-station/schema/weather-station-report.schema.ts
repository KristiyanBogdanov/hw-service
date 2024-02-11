import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { Importance } from '../../abstract-device/enum';
import { SensorReport } from '../../abstract-device/schema';
import { IWeatherStationReport } from '../interface';

@Schema({
    collection: 'weatherStationsReports',
    versionKey: false,
})
export class WeatherStationReport implements IWeatherStationReport {
    @Expose()
    id: string;

    @Expose()
    @Prop({
        index: { name: 'wsIdIndex' },
        required: true
    })
    deviceId: string;

    @Expose()
    @IsOptional()
    @ValidateNested()
    @Type(() => SensorReport)
    @Prop({ type: SensorReport })
    anemometer: SensorReport;

    @Expose()
    @IsOptional()
    @ValidateNested()
    @Type(() => SensorReport)
    @Prop({ type: SensorReport })
    temperatureSensor: SensorReport;

    @Expose()
    @IsEnum(Importance)
    @Prop({
        type: String,
        enum: Importance,
        required: true,
    })
    importance: Importance;

    @Expose()
    @IsString()
    @IsNotEmpty()
    @Prop({ required: true })
    generalMessage: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    @Prop({ required: true })
    advice: string;

    @Expose()
    @IsDateString()
    @Prop({ required: true })
    timestamp: Date;

    constructor(partial: Partial<WeatherStationReport>) {
        Object.assign(this, partial);
    }
}

export const WeatherStationReportSchema = SchemaFactory.createForClass(WeatherStationReport);