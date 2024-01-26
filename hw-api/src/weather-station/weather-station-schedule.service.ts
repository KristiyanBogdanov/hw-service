import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WEATHER_STATION_CRON_INTERVAL_IN_MILLISECONDS, WEATHER_STATION_CRON_PATTERN } from '../shared/constants';
import { DeviceType, Importance, NotificationType } from '../abstract-device/enum';
import { WeatherStationRepository } from './repository';
import { WeatherStationService } from './weather-station.service';

@Injectable()
export class WeatherStationScheduleService {
    constructor(
        private readonly weatherStationRepository: WeatherStationRepository,
        private readonly weatherStationService: WeatherStationService
    ) { }

    @Cron(WEATHER_STATION_CRON_PATTERN)
    async updateIsActiveStatus() {
        const weatherStations = await this.weatherStationRepository.find({
            isActive: true,
            lastUpdate: {
                $lt: new Date(new Date().getTime() - WEATHER_STATION_CRON_INTERVAL_IN_MILLISECONDS)
            }
        });
        
        weatherStations.forEach(weatherStation => {
            const report = {
                serialNumber: weatherStation.serialNumber,
                importance: Importance.Warning,
                generalMessage: 'Weather station is inactive',
                timestamp: new Date()
            };

            this.weatherStationService.sendNotificationToMobileApp(report, DeviceType.WeatherStation, NotificationType.InactiveDevice);
            console.log(`Weather station with serial number ${weatherStation.serialNumber} is inactive`);

            weatherStation.isActive = false;
            weatherStation.save();
        });
    }
}