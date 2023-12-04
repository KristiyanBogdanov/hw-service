import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDateString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SensorReport } from '../../abstract-device/schema';
import { IWeatherStationReport } from '../interface';

@Schema({
    collection: 'weatherStationsReports',
})
export class WeatherStationReport implements IWeatherStationReport {
    @Prop({
        index: { name: 'wsSerialNumberIndex' },
        required: true
    })
    serialNumber: string;
    
    @IsOptional()
    @ValidateNested()
    @Type(() => SensorReport)
    @Prop({ type: SensorReport })
    anemometer?: SensorReport;

    @IsOptional()
    @ValidateNested()
    @Type(() => SensorReport)
    @Prop({ type: SensorReport })
    temperatureSensor?: SensorReport;

    @IsDateString()
    @Prop({ required: true })
    timestamp: Date;
}

export const WeatherStationReportSchema = SchemaFactory.createForClass(WeatherStationReport);