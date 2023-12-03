import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDateString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ISolarTrackerReport } from '../interface';
import { SensorReport } from '../../abstract-device/schema';

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

    @IsDateString()
    @Prop({ required: true })
    timestamp: Date;
}

export const SolarTrackerReportSchema = SchemaFactory.createForClass(SolarTrackerReport);