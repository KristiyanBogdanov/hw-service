import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { plainToClass } from 'class-transformer';
import { MobileAppApi } from '../shared/api';
import { CoordinatesDto } from '../abstract-device/dto';
import { DeviceService } from '../abstract-device/device.service';
import { DeviceType } from '../abstract-device/enum';
import { SolarTrackerReportRepository, SolarTrackerRepository, SolarTrackerSensorsRepository } from './repository';
import { SolarTracker, SolarTrackerReport, SolarTrackerSensors } from './schema';
import {
    InitSTReq, InitSTRes,
    SaveSTSensorsDataReq, SaveSTSensorsDataRes,
    ReportSTStateReq, ReportSTStateRes, 
    GetSTInsightsReq, GetSTInsightsRes, STInsightsDto,
    ValidateSTSerialNumberRes
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
        httpService: HttpService,
        private readonly mobileAppApi: MobileAppApi,
        private readonly logger: Logger
    ) {
        super(solarTrackerRepository, solarTrackerSensorsRepository, solarTrackerReportRepository, httpService);
    }

    async init(deviceData: InitSTReq): Promise<InitSTRes> {
        const solarTracker = new SolarTracker(deviceData);
        solarTracker.location = CoordinatesDto.toLocation(deviceData.coordinates);

        const createdSolarTracker = await this.createDevice(solarTracker);

        return plainToClass(InitSTRes, createdSolarTracker);
    }

    async saveSensorsData(solarTrackerId: string, sensorsData: SaveSTSensorsDataReq): Promise<SaveSTSensorsDataRes> {
        const solarTrackerSensors = new SolarTrackerSensors(sensorsData);
        solarTrackerSensors.deviceId = solarTrackerId;

        const savedSensorsData = await this.saveDeviceSensorsData(solarTrackerId, solarTrackerSensors);

        return plainToClass(SaveSTSensorsDataRes, savedSensorsData);
    }

    async reportState(solarTrackerId: string, report: ReportSTStateReq): Promise<ReportSTStateRes> {
        const solarTrackerReport = new SolarTrackerReport(report);
        solarTrackerReport.deviceId = solarTrackerId;

        const result = await this.saveDeviceReport(solarTrackerId, solarTrackerReport);
        
        try {
            await this.sendHwNotificationToMobileApp(
                result.savedReport, result.serialNumber, DeviceType.SolarTracker, this.mobileAppApi.sendDeviceStateReportNotification()
            );
        } catch (error) {
            this.logger.error(error);
        }

        return plainToClass(ReportSTStateRes, result.savedReport);
    }

    async validateSerialNumber(serialNumber: string): Promise<ValidateSTSerialNumberRes> {
        const solarTracker = await this.deviceRepository.findOne({ serialNumber });

        return {
            isValid: !!solarTracker,
            capacity: solarTracker?.capacity
        };
    }

    async getInsights(requestData: GetSTInsightsReq): Promise<GetSTInsightsRes> {
        const insights: Record<string, STInsightsDto> = {};

        await Promise.all(
            requestData.serialNumbers.map(async (serialNumber) => {
                const solarTracker = await this.deviceRepository.findOne({ serialNumber });

                if (!solarTracker) {
                    throw new NotFoundException();
                }

                const stData = plainToClass(STInsightsDto, solarTracker);
                stData.coordinates = CoordinatesDto.fromLocation(solarTracker.location);

                const [latestSensorsData, last24hAvgIrradiance] = await Promise.all([
                    this.sensorsRepository.getLatestSensorsData(solarTracker.id),
                    this.sensorsRepository.getHourlyAvgIrradiance24h(solarTracker.id),
                ]);

                if (latestSensorsData) {
                    stData.currentAzimuth = latestSensorsData.azimuth;
                    stData.currentElevation = latestSensorsData.elevation;
                    stData.azimuthDeviation = latestSensorsData.azimuthDeviation;
                    stData.elevationDeviation = latestSensorsData.elevationDeviation;

                    stData.last24hAvgIrradiance = last24hAvgIrradiance;
                }

                insights[serialNumber] = stData;
            })
        );

        return { data: insights };
    }
}