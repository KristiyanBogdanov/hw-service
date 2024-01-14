import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CoordinatesDto } from '../shared/dto';
import { DeviceService } from '../abstract-device/device.service';
import { WeatherStationReportRepository, WeatherStationRepository, WeatherStationSensorsRepository } from './repository';
import { WeatherStation, WeatherStationReport, WeatherStationSensors } from './schema';
import { 
    InitWSReq, InitWSRes,
    SaveWSSensorsDataReq, SaveWSSensorsDataRes,
    ReportWSStateReq, ReportWSStateRes, 
    GetWSInsightsRes
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
    ) {
        super(weatherStationRepository, weatherStationSensorsRepository, weatherStationReportRepository);
    }

    async init(deviceData: InitWSReq): Promise<InitWSRes> {
        const weatherStation = plainToClass(WeatherStation, deviceData);
        weatherStation.location = CoordinatesDto.toLocation(deviceData.coordinates);

        const createdWeatherStation = await this.createDevice(weatherStation);

        return plainToClass(InitWSRes, createdWeatherStation.toObject());
    }

    async saveSensorsData(serialNumber: string, sensorsData: SaveWSSensorsDataReq): Promise<SaveWSSensorsDataRes> {
        const weatherStationSensors = plainToClass(WeatherStationSensors, sensorsData);
        weatherStationSensors.serialNumber = serialNumber ;

        const savedSensorsData = await this.saveDeviceSensorsData(serialNumber, weatherStationSensors);

        return plainToClass(SaveWSSensorsDataRes, savedSensorsData.toObject());
    }

    async reportState(serialNumber: string, report: ReportWSStateReq): Promise<ReportWSStateRes> {
        const weatherStationReport = plainToClass(WeatherStationReport, report);
        weatherStationReport.serialNumber = serialNumber;

        const savedReport = await this.saveDeviceReport(serialNumber, weatherStationReport);

        return plainToClass(ReportWSStateRes, savedReport.toObject());
    }

    async getInsights(serialNumber: string): Promise<GetWSInsightsRes> {
        const weatherStation = await this.deviceRepository.findOne({ serialNumber });

        if (!weatherStation) {
            throw new NotFoundException(`Weather station with serial number ${serialNumber} not found`);
        }

        const insights = plainToClass(GetWSInsightsRes, weatherStation.toObject());
        insights.coordinates = CoordinatesDto.fromLocation(weatherStation.location);

        const [latestSensorsData, averageValues] = await Promise.all([
            this.sensorsRepository.getLatestSensorsData(serialNumber),
            this.sensorsRepository.getHourlyAvgTempAndWindSpeed24h(serialNumber)
        ]);
        
        if (latestSensorsData) {
            insights.currentTemperature = latestSensorsData.temperature;
            insights.currentWindSpeed = latestSensorsData.windSpeed;
            insights.currentWindDirection = latestSensorsData.windDirection;
        }

        insights.last24hAvgTemperature = averageValues.temperature;
        insights.last24hAvgWindSpeed = averageValues.windSpeed;

        return insights;
    }
}