import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { 
    INACTIVE_WEATHER_STATION_NOTIFICATION_ADVICE, INACTIVE_WEATHER_STATION_NOTIFICATION_MESSAGE, 
    WEATHER_STATION_CRON_INTERVAL_IN_MILLISECONDS, WEATHER_STATION_CRON_PATTERN 
} from '../shared/constants';
import { MobileAppApi } from '../shared/api';
import { DeviceType, Importance } from '../abstract-device/enum';
import { WeatherStationRepository } from './repository';
import { WeatherStationService } from './weather-station.service';

@Injectable()
export class WeatherStationScheduleService {
    constructor(
        private readonly weatherStationRepository: WeatherStationRepository,
        private readonly weatherStationService: WeatherStationService,
        private readonly mobileAppApi: MobileAppApi,
        private readonly logger: Logger
    ) { }

    @Cron(WEATHER_STATION_CRON_PATTERN)
    async updateIsActiveStatus() {
        const inactiveWeatherStations = await this.weatherStationRepository.findInactiveDevices(WEATHER_STATION_CRON_INTERVAL_IN_MILLISECONDS);

        Promise.all(inactiveWeatherStations.map(async weatherStation => {
            const report = {
                deviceId: weatherStation.id,
                importance: Importance.Warning,
                generalMessage: INACTIVE_WEATHER_STATION_NOTIFICATION_MESSAGE,
                advice: INACTIVE_WEATHER_STATION_NOTIFICATION_ADVICE,
                timestamp: new Date()
            };

            try {
                await this.weatherStationService.sendHwNotificationToMobileApp(
                    report, weatherStation.serialNumber, DeviceType.WeatherStation, this.mobileAppApi.sendInactiveDeviceNotification()
                );
            } catch (error) {
                this.logger.error(error);
            }

            weatherStation.isActive = false;
            weatherStation.save();
        }));
    }
}