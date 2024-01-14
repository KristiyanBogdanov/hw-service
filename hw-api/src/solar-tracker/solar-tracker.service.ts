import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CoordinatesDto } from '../shared/dto';
import { DeviceService } from '../abstract-device/device.service';
import { SolarTrackerReportRepository, SolarTrackerRepository, SolarTrackerSensorsRepository } from './repository';
import { SolarTracker, SolarTrackerReport, SolarTrackerSensors } from './schema';
import {
    InitSTReq, InitSTRes,
    SaveSTSensorsDataReq, SaveSTSensorsDataRes,
    ReportSTStateReq, ReportSTStateRes, 
    GetSTInsightsReq, GetSTInsightsRes, STInsightsDto
} from './dto';

@Injectable()
export class SolarTrackerService extends DeviceService<
    SolarTracker,
    SolarTrackerSensors,
    SolarTrackerReport,
    SolarTrackerRepository,
    SolarTrackerSensorsRepository,
    SolarTrackerReportRepository
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
        solarTracker.location = CoordinatesDto.toLocation(deviceData.coordinates);

        const createdSolarTracker = await this.createDevice(solarTracker);

        return plainToClass(InitSTRes, createdSolarTracker.toObject());
    }

    async saveSensorsData(serialNumber: string, sensorsData: SaveSTSensorsDataReq): Promise<SaveSTSensorsDataRes> {
        const solarTrackerSensors = plainToClass(SolarTrackerSensors, sensorsData);
        solarTrackerSensors.serialNumber = serialNumber ;

        const savedSensorsData = await this.saveDeviceSensorsData(serialNumber, solarTrackerSensors);

        return plainToClass(SaveSTSensorsDataRes, savedSensorsData.toObject());
    }

    async reportState(serialNumber: string, report: ReportSTStateReq): Promise<ReportSTStateRes> {
        const solarTrackerReport = plainToClass(SolarTrackerReport, report);
        solarTrackerReport.serialNumber = serialNumber;

        const savedReport = await this.saveDeviceReport(serialNumber, solarTrackerReport);

        return plainToClass(ReportSTStateRes, savedReport.toObject());
    }

    async getInsights(requestData: GetSTInsightsReq): Promise<GetSTInsightsRes> {
        const insights: Record<string, STInsightsDto> = {};

        await Promise.all(
            requestData.serialNumbers.map(async (serialNumber) => {
                const solarTracker = await this.deviceRepository.findOne({ serialNumber: serialNumber });

                if (!solarTracker) {
                    throw new NotFoundException(`Device with serial number ${serialNumber} not found`);
                }

                const stData = plainToClass(STInsightsDto, solarTracker.toObject());
                stData.coordinates = CoordinatesDto.fromLocation(solarTracker.location);

                const [latestSensorsData, last24hAvgIrradiance] = await Promise.all([
                    this.sensorsRepository.getLatestSensorsData(serialNumber),
                    this.sensorsRepository.getHourlyAvgIrradiance24h(serialNumber),
                ]);

                if (latestSensorsData) {
                    stData.currentAzimuth = latestSensorsData.azimuth;
                    stData.currentElevation = latestSensorsData.elevation;
                    stData.azimuthDeviation = latestSensorsData.azimuthDeviation;
                    stData.elevationDeviation = latestSensorsData.elevationDeviation;
                }

                stData.last24hAvgIrradiance = last24hAvgIrradiance;

                insights[serialNumber] = stData;
            })
        );

        return { data: insights };
    }
}