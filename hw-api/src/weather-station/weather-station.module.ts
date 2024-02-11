import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { MobileAppApi } from '../shared/api';
import {
    WeatherStation, WeatherStationSchema,
    WeatherStationSensors, WeatherStationSensorsSchema,
    WeatherStationReport, WeatherStationReportSchema
} from './schema';
import { WeatherStationController } from './weather-station.controller';
import { WeatherStationScheduleService } from './weather-station-schedule.service';
import { WeatherStationService } from './weather-station.service';
import { WeatherStationReportRepository, WeatherStationRepository, WeatherStationSensorsRepository } from './repository';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: WeatherStation.name, schema: WeatherStationSchema },
            { name: WeatherStationSensors.name, schema: WeatherStationSensorsSchema },
            { name: WeatherStationReport.name, schema: WeatherStationReportSchema }
        ]),
        HttpModule
    ],
    controllers: [WeatherStationController],
    providers: [
        Logger,
        WeatherStationScheduleService,
        WeatherStationService,
        WeatherStationRepository,
        WeatherStationSensorsRepository,
        WeatherStationReportRepository,
        MobileAppApi
    ],
})
export class WeatherStationModule { }