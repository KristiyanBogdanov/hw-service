import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsDateString, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { Location } from '../../abstract-device/schema';
import { IWeatherStation, IWeatherStationSensorsStatus } from '../interface';

@Exclude()
@Schema({ _id: false })
export class WeatherStationSensorsStatus implements IWeatherStationSensorsStatus {
    @Expose()
    @IsBoolean()
    @Prop({ required: true })
    anemometer: boolean;
    
    @Expose()
    @IsBoolean()
    @Prop({ required: true })
    temperatureSensor: boolean;
}

@Schema({
    collection: 'weatherStations',
    versionKey: false
})
export class WeatherStation implements IWeatherStation {
    @Expose()
    id: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    @Prop({
        index: {
            name: 'wsSerialNumberIndex',
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
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => WeatherStationSensorsStatus)
    @Prop({
        type: WeatherStationSensorsStatus,
        required: true
    })
    sensorsStatus: WeatherStationSensorsStatus;

    @Expose()
    @IsDateString()
    @Prop({ required: true })
    lastUpdate: Date;

    constructor(partial: Partial<WeatherStation>) {
        Object.assign(this, partial);
    }
}

export const WeatherStationSchema = SchemaFactory.createForClass(WeatherStation);