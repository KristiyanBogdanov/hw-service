import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsDateString, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { Location } from '../../abstract-device/schema';
import { IWeatherStation, IWeatherStationSensorsStatus } from '../interface';

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
})
export class WeatherStation implements IWeatherStation {
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
}

export const WeatherStationSchema = SchemaFactory.createForClass(WeatherStation);