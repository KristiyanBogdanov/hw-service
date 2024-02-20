import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { MobileAppApi } from '../shared/api';
import {
    SolarTracker, SolarTrackerSchema,
    SolarTrackerSensors, SolarTrackerSensorsSchema,
    SolarTrackerReport, SolarTrackerReportSchema
} from './schema';
import { SolarTrackerController } from './solar-tracker.controller';
import { SolarTrackerScheduleService } from './solar-tracker-schedule.service';
import { SolarTrackerService } from './solar-tracker.service';
import { SolarTrackerRepository, SolarTrackerSensorsRepository, SolarTrackerReportRepository } from './repository';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: SolarTracker.name, schema: SolarTrackerSchema },
            { name: SolarTrackerSensors.name, schema: SolarTrackerSensorsSchema },
            { name: SolarTrackerReport.name, schema: SolarTrackerReportSchema }
        ]),
        HttpModule
    ],
    controllers: [SolarTrackerController],
    providers: [
        Logger,
        SolarTrackerScheduleService,
        SolarTrackerService,
        SolarTrackerRepository,
        SolarTrackerSensorsRepository,
        SolarTrackerReportRepository,
        MobileAppApi
    ],
})
export class SolarTrackerModule { }