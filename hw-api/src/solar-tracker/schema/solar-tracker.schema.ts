import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsDateString, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Location } from '../../abstract-device/schema';
import { ISolarTrackerSensorsStatus, ISolarTracker } from '../interface';

@Schema({ _id: false })
export class SolarTrackerSensorsStatus implements ISolarTrackerSensorsStatus {
    @IsBoolean()
    @Prop({ required: true })
    irradianceSensor: boolean;

    @IsBoolean()
    @Prop({ required: true })
    accelerometer: boolean;

    @IsBoolean()
    @Prop({ required: true })
    azimuthMotor: boolean;

    @IsBoolean()
    @Prop({ required: true })
    elevationMotor: boolean;
}

@Schema({
    collection: 'solarTrackers',
})
export class SolarTracker implements ISolarTracker {
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

    @IsDateString()
    @Prop({ required: true })
    installationDate: Date;

    @IsBoolean()
    @Prop({ required: true })
    isActive: boolean;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => SolarTrackerSensorsStatus)
    @Prop({
        type: SolarTrackerSensorsStatus,
        required: true
    })
    sensorsStatus: SolarTrackerSensorsStatus;

    @IsDateString()
    @Prop({ required: true })
    lastUpdate: Date;
};

export const SolarTrackerSchema = SchemaFactory.createForClass(SolarTracker);