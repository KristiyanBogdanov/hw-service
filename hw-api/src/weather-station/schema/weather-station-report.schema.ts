import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ReportType } from '../../abstract-device/enum';
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

    @IsEnum(ReportType)
    @Prop({
        type: String,
        enum: ReportType,
        required: true,
    })
    reportType: ReportType;

    @IsString()
    @IsNotEmpty()
    @Prop({ required: true })
    generalMessage: string;

    @IsDateString()
    @Prop({ required: true })
    timestamp: Date;
}

export const WeatherStationReportSchema = SchemaFactory.createForClass(WeatherStationReport);