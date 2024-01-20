import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SOLAR_TRACKER_CRON_PATTERN, SOLAR_TRACKER_CRON_INTERVAL_IN_MILLISECONDS } from '../shared/constants';
import { DeviceType, Importance, NotificationType } from '../abstract-device/enum';
import { SolarTrackerRepository } from './repository';
import { SolarTrackerService } from './solar-tracker.service';

@Injectable()
export class SolarTrackerScheduleService {
    constructor(
        private readonly solarTrackerRepository: SolarTrackerRepository,
        private readonly solarTrackerService: SolarTrackerService
    ) { }

    @Cron(SOLAR_TRACKER_CRON_PATTERN)
    async updateIsActiveStatus() {
        const solarTrackers = await this.solarTrackerRepository.find({
            isActive: true,
            lastUpdate: {
                $lt: new Date(new Date().getTime() - SOLAR_TRACKER_CRON_INTERVAL_IN_MILLISECONDS)
            }
        });

        // TODO: clean the code
        solarTrackers.forEach(solarTracker => {
            const report = {
                serialNumber: solarTracker.serialNumber,
                importance: Importance.Warning,
                generalMessage: 'Solar tracker is inactive',
                timestamp: new Date()
            };

            this.solarTrackerService.sendNotificationToMobileApp(report, DeviceType.SolarTracker, NotificationType.InactiveDevice);
            // TODO: add logger here
            console.log(`Solar tracker with serial number ${solarTracker.serialNumber} is inactive`);

            solarTracker.isActive = false;
            solarTracker.save();
        });
    }
}