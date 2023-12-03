import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SOLAR_TRACKER_CRON_PATTERN, SOLAR_TRACKER_CRON_INTERVAL_IN_MILLISECONDS } from '../shared/constants';
import { SolarTrackerRepository } from './repository';

@Injectable()
export class SolarTrackerScheduleService {
    constructor(private readonly solarTrackerRepository: SolarTrackerRepository) { }

    @Cron(SOLAR_TRACKER_CRON_PATTERN)
    async updateIsActiveStatus() {
        const solarTrackers = await this.solarTrackerRepository.find({
            isActive: true,
            lastUpdate: {
                $lt: new Date(new Date().getTime() - SOLAR_TRACKER_CRON_INTERVAL_IN_MILLISECONDS)
            }
        });

        // TODO: add send notification functionality here
        solarTrackers.forEach(solarTracker => {
            // TODO: add logger here
            console.log(`Solar tracker with serial number ${solarTracker.serialNumber} is inactive`);

            solarTracker.isActive = false;
            solarTracker.save();
        });
    }
}