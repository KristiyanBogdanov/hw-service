import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { plainToClass } from 'class-transformer';
import { MobileAppApi } from '../shared/api';
import { CoordinatesDto } from '../abstract-device/dto';
import { DeviceService } from '../abstract-device/device.service';
import { DeviceType } from '../abstract-device/enum';
import { WeatherStationReportRepository, WeatherStationRepository, WeatherStationSensorsRepository } from './repository';
import { WeatherStation, WeatherStationReport, WeatherStationSensors } from './schema';
import { 
    InitWSReq, InitWSRes,
    SaveWSSensorsDataReq, SaveWSSensorsDataRes,
    ReportWSStateReq, ReportWSStateRes, 
    GetWSInsightsRes,
    ValidateWSSerialNumberRes
} from './dto';

@Injectable()
export class WeatherStationService extends DeviceService<
    WeatherStation,
    WeatherStationSensors,
    WeatherStationReport,
    WeatherStationRepository,
    WeatherStationSensorsRepository,
    WeatherStationReportRepository
> {
    constructor(
        weatherStationRepository: WeatherStationRepository,
        weatherStationSensorsRepository: WeatherStationSensorsRepository,
        weatherStationReportRepository: WeatherStationReportRepository,
        httpService: HttpService,
        private readonly mobileAppApi: MobileAppApi,
        private readonly logger: Logger
    ) {
        super(weatherStationRepository, weatherStationSensorsRepository, weatherStationReportRepository, httpService);
    }

    async init(deviceData: InitWSReq): Promise<InitWSRes> {
        const weatherStation = new WeatherStation(deviceData);
        weatherStation.location = CoordinatesDto.toLocation(deviceData.coordinates);

        const createdWeatherStation = await this.createDevice(weatherStation);

        return plainToClass(InitWSRes, createdWeatherStation);
    }

    async saveSensorsData(weatherStationId: string, sensorsData: SaveWSSensorsDataReq): Promise<SaveWSSensorsDataRes> {
        const weatherStationSensors = new WeatherStationSensors(sensorsData);
        weatherStationSensors.deviceId = weatherStationId;

        const savedSensorsData = await this.saveDeviceSensorsData(weatherStationId, weatherStationSensors);

        return plainToClass(SaveWSSensorsDataRes, savedSensorsData);
    }

    async reportState(weatherStationId: string, report: ReportWSStateReq): Promise<ReportWSStateRes> {
        const weatherStationReport = new WeatherStationReport(report);
        weatherStationReport.deviceId = weatherStationId;

        const result = await this.saveDeviceReport(weatherStationId, weatherStationReport);
        
        try {
            await this.sendHwNotificationToMobileApp(
                result.savedReport, result.serialNumber, DeviceType.WeatherStation, this.mobileAppApi.sendDeviceStateReportNotification()
            );
        } catch (error) {
            this.logger.error(error);
        }
        
        return plainToClass(ReportWSStateRes, result.savedReport);
    }

    async validateSerialNumber(serialNumber: string): Promise<ValidateWSSerialNumberRes> {
        const weatherStation = await this.deviceRepository.findOne({ serialNumber });

        return {
            isValid: !!weatherStation
        };
    }

    async getInsights(serialNumber: string): Promise<GetWSInsightsRes> {
        const weatherStation = await this.deviceRepository.findOne({ serialNumber });

        if (!weatherStation) {
            throw new NotFoundException();
        }

        const insights = plainToClass(GetWSInsightsRes, weatherStation);
        insights.coordinates = CoordinatesDto.fromLocation(weatherStation.location);

        const [latestSensorsData, averageValues] = await Promise.all([
            this.sensorsRepository.getLatestSensorsData(weatherStation.id),
            this.sensorsRepository.getHourlyAvgTempAndWindSpeed24h(weatherStation.id)
        ]);
        
        if (latestSensorsData) {
            insights.currentTemperature = latestSensorsData.temperature;
            insights.currentWindSpeed = latestSensorsData.windSpeed;
            insights.currentWindDirection = latestSensorsData.windDirection;
        }

        if (averageValues) {
            insights.last24hAvgTemperature = averageValues.temperature;
            insights.last24hAvgWindSpeed = averageValues.windSpeed;
        }

        return insights;
    }
}