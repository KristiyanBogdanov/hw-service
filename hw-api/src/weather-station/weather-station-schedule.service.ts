import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WEATHER_STATION_CRON_INTERVAL_IN_MILLISECONDS, WEATHER_STATION_CRON_PATTERN } from '../shared/constants';
import { WeatherStationRepository } from './repository';

@Injectable()
export class WeatherStationScheduleService {
    constructor(private readonly weatherStationRepository: WeatherStationRepository) { }

    @Cron(WEATHER_STATION_CRON_PATTERN)
    async updateIsActiveStatus() {
        const weatherStations = await this.weatherStationRepository.find({
            isActive: true,
            lastUpdate: {
                $lt: new Date(new Date().getTime() - WEATHER_STATION_CRON_INTERVAL_IN_MILLISECONDS)
            }
        });
        
        weatherStations.forEach(weatherStation => {
            console.log(`Weather station with serial number ${weatherStation.serialNumber} is inactive`);

            weatherStation.isActive = false;
            weatherStation.save();
        });
    }
}