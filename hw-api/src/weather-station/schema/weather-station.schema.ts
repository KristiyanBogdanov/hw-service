import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsDateString, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Location } from '../../abstract-device/schema';
import { IWeatherStation, IWeatherStationSensorsStatus } from '../interface';

@Schema({ _id: false })
export class WeatherStationSensorsStatus implements IWeatherStationSensorsStatus {
    @IsBoolean()
    @Prop({ required: true })
    anemometer: boolean;
    
    @IsBoolean()
    @Prop({ required: true })
    temperatureSensor: boolean;
}

@Schema({
    collection: 'weatherStations',
})
export class WeatherStation implements IWeatherStation {
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

    @IsDateString()
    @Prop({ required: true })
    installationDate: Date;

    @IsBoolean()
    @Prop({ required: true })
    isActive: boolean;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => WeatherStationSensorsStatus)
    @Prop({
        type: WeatherStationSensorsStatus,
        required: true
    })
    sensorsStatus: WeatherStationSensorsStatus;

    @IsDateString()
    @Prop({ required: true })
    lastUpdate: Date;
}

export const WeatherStationSchema = SchemaFactory.createForClass(WeatherStation);