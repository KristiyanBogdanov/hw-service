import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Coordinates } from '../shared/dto';
import { DeviceService } from '../abstract-device/device.service';
import { SolarTrackerReportRepository, SolarTrackerRepository, SolarTrackerSensorsRepository } from './repository';
import { SolarTracker, SolarTrackerReport, SolarTrackerSensors } from './schema';
import {
    InitSTReq, InitSTRes,
    SaveSTSensorsDataReq, SaveSTSensorsDataRes,
    ReportSTSensorsStatusReq, ReportSTSensorsStatusRes
} from './dto';

@Injectable()
export class SolarTrackerService extends DeviceService<
    SolarTracker,
    SolarTrackerSensors,
    SolarTrackerReport
> {
    constructor(
        solarTrackerRepository: SolarTrackerRepository,
        solarTrackerSensorsRepository: SolarTrackerSensorsRepository,
        solarTrackerReportRepository: SolarTrackerReportRepository,
    ) {
        super(solarTrackerRepository, solarTrackerSensorsRepository, solarTrackerReportRepository);
    }

    async init(deviceData: InitSTReq): Promise<InitSTRes> {
        const solarTracker = plainToClass(SolarTracker, deviceData);
        solarTracker.location = Coordinates.toLocation(deviceData.coordinates);

        const createdSolarTracker = await this.createDevice(solarTracker);

        return plainToClass(InitSTRes, createdSolarTracker.toObject());
    }

    async saveSensorsData(serialNumber: string, sensorsData: SaveSTSensorsDataReq): Promise<SaveSTSensorsDataRes> {
        const solarTrackerSensors = plainToClass(SolarTrackerSensors, sensorsData);
        solarTrackerSensors.serialNumber = serialNumber ;

        const savedSensorsData = await this.saveDeviceSensorsData(serialNumber, solarTrackerSensors);

        return plainToClass(SaveSTSensorsDataRes, savedSensorsData.toObject());
    }

    async reportSensorsStatus(serialNumber: string, sensorsReport: ReportSTSensorsStatusReq): Promise<ReportSTSensorsStatusRes> {
        const solarTrackerReport = plainToClass(SolarTrackerReport, sensorsReport);
        solarTrackerReport.serialNumber = serialNumber;

        const savedSensorsReport = await this.saveDeviceSensorsReport(serialNumber, solarTrackerReport);

        return plainToClass(ReportSTSensorsStatusRes, savedSensorsReport.toObject());
    }
}