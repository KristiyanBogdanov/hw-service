import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
        ])
    ],
    controllers: [SolarTrackerController],
    providers: [
        SolarTrackerScheduleService,
        SolarTrackerService,
        SolarTrackerRepository,
        SolarTrackerSensorsRepository,
        SolarTrackerReportRepository
    ],
})
export class SolarTrackerModule { }