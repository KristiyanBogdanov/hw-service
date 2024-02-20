import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsDateString, IsNotEmpty, IsPositive, IsString, ValidateNested } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { Location } from '../../abstract-device/schema';
import { ISolarTrackerSensorsStatus, ISolarTracker } from '../interface';

@Exclude()
@Schema({ _id: false })
export class SolarTrackerSensorsStatus implements ISolarTrackerSensorsStatus {
    @Expose()
    @IsBoolean()
    @Prop({ required: true })
    irradianceSensor: boolean;

    @Expose()
    @IsBoolean()
    @Prop({ required: true })
    accelerometer: boolean;

    @Expose()
    @IsBoolean()
    @Prop({ required: true })
    azimuthMotor: boolean;

    @Expose()
    @IsBoolean()
    @Prop({ required: true })
    elevationMotor: boolean;
}

@Schema({
    collection: 'solarTrackers',
    versionKey: false,
})
export class SolarTracker implements ISolarTracker {
    @Expose()
    id: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    @Prop({
        index: {
            name: 'stSerialNumberIndex',
            unique: true
        },
        required: true
    })
    serialNumber: string;

    @Prop({
        type: Location,
        required: true
    })
    location: Location;

    @Expose()
    @IsDateString()
    @Prop({ required: true })
    installationDate: Date;

    @Expose()
    @IsBoolean()
    @Prop({ required: true })
    isActive: boolean;

    @Expose()
    @IsPositive()
    @Prop({ required: true })
    capacity: number;

    @Expose()
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => SolarTrackerSensorsStatus)
    @Prop({
        type: SolarTrackerSensorsStatus,
        required: true
    })
    sensorsStatus: SolarTrackerSensorsStatus;

    @Expose()
    @IsDateString()
    @Prop({ required: true })
    lastUpdate: Date;

    constructor(partial: Partial<SolarTracker>) {
        Object.assign(this, partial);
    }
};

export const SolarTrackerSchema = SchemaFactory.createForClass(SolarTracker);