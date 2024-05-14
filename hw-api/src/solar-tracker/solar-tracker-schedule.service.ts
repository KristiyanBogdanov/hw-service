import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { 
    SOLAR_TRACKER_CRON_PATTERN, SOLAR_TRACKER_CRON_INTERVAL_IN_MILLISECONDS, 
    INACTIVE_SOLAR_TRACKER_NOTIFICATION_MESSAGE, INACTIVE_SOLAR_TRACKER_NOTIFICATION_ADVICE 
} from '../shared/constants';
import { MobileAppApi } from '../shared/api';
import { DeviceType, Importance } from '../abstract-device/enum';
import { SolarTrackerRepository } from './repository';
import { SolarTrackerService } from './solar-tracker.service';

@Injectable()
export class SolarTrackerScheduleService {
    constructor(
        private readonly solarTrackerRepository: SolarTrackerRepository,
        private readonly solarTrackerService: SolarTrackerService,
        private readonly mobileAppApi: MobileAppApi,
        private readonly logger: Logger
    ) { }

    @Cron(SOLAR_TRACKER_CRON_PATTERN)
    async updateIsActiveStatus() {
        const inactiveSolarTrackers = await this.solarTrackerRepository.findInactiveDevices(SOLAR_TRACKER_CRON_INTERVAL_IN_MILLISECONDS);

        Promise.all(inactiveSolarTrackers.map(async solarTracker => {
            const report = {
                deviceId: solarTracker.id,
                importance: Importance.Warning,
                generalMessage: INACTIVE_SOLAR_TRACKER_NOTIFICATION_MESSAGE(solarTracker.serialNumber),
                advice: INACTIVE_SOLAR_TRACKER_NOTIFICATION_ADVICE,
                timestamp: new Date()
            };

            try {
                await this.solarTrackerService.sendHwNotificationToMobileApp(
                    report, solarTracker.serialNumber, DeviceType.SolarTracker, this.mobileAppApi.sendInactiveDeviceNotification()
                );
            } catch (error) {
                this.logger.error(error);
            }

            solarTracker.isActive = false;
            solarTracker.save();
        }));
    }
}