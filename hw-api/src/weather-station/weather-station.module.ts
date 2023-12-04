import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    WeatherStation, WeatherStationSchema,
    WeatherStationSensors, WeatherStationSensorsSchema,
    WeatherStationReport, WeatherStationReportSchema
} from './schema';
import { WeatherStationReportRepository, WeatherStationRepository, WeatherStationSensorsRepository } from './repository';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: WeatherStation.name, schema: WeatherStationSchema },
            { name: WeatherStationSensors.name, schema: WeatherStationSensorsSchema },
            { name: WeatherStationReport.name, schema: WeatherStationReportSchema }
        ])
    ],
    controllers: [],
    providers: [
        WeatherStationRepository,
        WeatherStationSensorsRepository,
        WeatherStationReportRepository
    ],
})
export class WeatherStationModule { }