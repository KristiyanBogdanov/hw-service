import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { Importance } from '../../abstract-device/enum';
import { SensorReport } from '../../abstract-device/schema';
import { ISolarTrackerReport } from '../interface';

@Schema({
    collection: 'solarTrackersReports',
    versionKey: false,
})
export class SolarTrackerReport implements ISolarTrackerReport {
    @Expose()
    id: string;

    @Expose()
    @Prop({
        index: { name: 'stIdIndex' },
        required: true
    })
    deviceId: string;

    @Expose()
    @IsOptional()
    @ValidateNested()
    @Type(() => SensorReport)
    @Prop({ type: SensorReport })
    irradianceSensor: SensorReport;

    @Expose()
    @IsOptional()
    @ValidateNested()
    @Type(() => SensorReport)
    @Prop({ type: SensorReport })
    accelerometer: SensorReport;

    @Expose()
    @IsOptional()
    @ValidateNested()
    @Type(() => SensorReport)
    @Prop({ type: SensorReport })
    azimuthMotor: SensorReport;

    @Expose()
    @IsOptional()
    @ValidateNested()
    @Type(() => SensorReport)
    @Prop({ type: SensorReport })
    elevationMotor: SensorReport;

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

    constructor(partial: Partial<SolarTrackerReport>) {
        Object.assign(this, partial);
    }
}

export const SolarTrackerReportSchema = SchemaFactory.createForClass(SolarTrackerReport);