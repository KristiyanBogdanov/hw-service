import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Coordinates } from '../shared/dto';
import { DeviceService } from '../abstract-device/device.service';
import { WeatherStationReportRepository, WeatherStationRepository, WeatherStationSensorsRepository } from './repository';
import { WeatherStation, WeatherStationReport, WeatherStationSensors } from './schema';
import { 
    InitWSReq, InitWSRes,
    SaveWSSensorsDataReq, SaveWSSensorsDataRes,
    ReportWSSensorsStatusReq, ReportWSSensorsStatusRes
} from './dto';

@Injectable()
export class WeatherStationService extends DeviceService<
    WeatherStation,
    WeatherStationSensors,
    WeatherStationReport
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
        weatherStation.location = Coordinates.toLocation(deviceData.coordinates);
        weatherStation.location.coordinates.pop();

        const createdWeatherStation = await this.createDevice(weatherStation);

        return plainToClass(InitWSRes, createdWeatherStation.toObject());
    }

    async saveSensorsData(serialNumber: string, sensorsData: SaveWSSensorsDataReq): Promise<SaveWSSensorsDataRes> {
        const weatherStationSensors = plainToClass(WeatherStationSensors, sensorsData);
        weatherStationSensors.serialNumber = serialNumber ;

        const savedSensorsData = await this.saveDeviceSensorsData(serialNumber, weatherStationSensors);

        return plainToClass(SaveWSSensorsDataRes, savedSensorsData.toObject());
    }

    async reportSensorsStatus(serialNumber: string, sensorsReport: ReportWSSensorsStatusReq): Promise<ReportWSSensorsStatusRes> {
        const weatherStationReport = plainToClass(WeatherStationReport, sensorsReport);
        weatherStationReport.serialNumber = serialNumber;

        const savedSensorsReport = await this.saveDeviceSensorsReport(serialNumber, weatherStationReport);

        return plainToClass(ReportWSSensorsStatusRes, savedSensorsReport.toObject());
    }
}