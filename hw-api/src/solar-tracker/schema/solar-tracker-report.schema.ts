import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Importance } from '../../abstract-device/enum';
import { SensorReport } from '../../abstract-device/schema';
import { ISolarTrackerReport } from '../interface';

@Schema({
    collection: 'solarTrackersReports',
})
export class SolarTrackerReport implements ISolarTrackerReport {
    @Prop({
        index: { name: 'stSerialNumberIndex' },
        required: true
    })
    serialNumber: string;
    
    @IsOptional()
    @ValidateNested()
    @Type(() => SensorReport)
    @Prop({ type: SensorReport })
    irradianceSensor?: SensorReport;

    @IsOptional()
    @ValidateNested()
    @Type(() => SensorReport)
    @Prop({ type: SensorReport })
    accelerometer?: SensorReport;

    @IsOptional()
    @ValidateNested()
    @Type(() => SensorReport)
    @Prop({ type: SensorReport })
    azimuthMotor?: SensorReport;

    @IsOptional()
    @ValidateNested()
    @Type(() => SensorReport)
    @Prop({ type: SensorReport })
    elevationMotor?: SensorReport;

    @IsEnum(Importance)
    @Prop({
        type: String,
        enum: Importance,
        required: true,
    })
    importance: Importance;

    @IsString()
    @IsNotEmpty()
    @Prop({ required: true })
    generalMessage: string;

    @IsDateString()
    @Prop({ required: true })
    timestamp: Date;
}

export const SolarTrackerReportSchema = SchemaFactory.createForClass(SolarTrackerReport);