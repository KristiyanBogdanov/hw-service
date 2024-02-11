import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SensorsRepository } from '../../abstract-device/repository';
import { AverageSensorValueDto } from '../../shared/dto';
import { SEVEN_DAYS_IN_MILLISECONDS, TWELVE_MONTHS_IN_MILLISECONDS, TWENTY_FOUR_HOURS_IN_MILLISECONDS } from '../../shared/constants';
import { SolarTrackerSensors } from '../schema';

@Injectable()
export class SolarTrackerSensorsRepository extends SensorsRepository<SolarTrackerSensors> {
    constructor(@InjectModel(SolarTrackerSensors.name) model: Model<SolarTrackerSensors>) {
        super(model);
    }

    async getHourlyAvgIrradiance24h(solarTrackerId: string): Promise<AverageSensorValueDto[]> {
        const result = await this.getAvgValue(TWENTY_FOUR_HOURS_IN_MILLISECONDS, solarTrackerId, '$hour', 'irradiance');
        if (result.length > 0) {
            return this.mapAvgValueToDto(result, 24);
        }
    }

    async getDailyAvgIrradiance7d(solarTrackerId: string): Promise<AverageSensorValueDto[]> {
        const result = await this.getAvgValue(SEVEN_DAYS_IN_MILLISECONDS, solarTrackerId, '$dayOfWeek', 'irradiance'); // 1 - Sunday, 7 - Saturday
        if (result.length > 0) {
            return this.mapAvgValueToDto(result, 7);
        }
    }

    async getMonthlyAvgIrradiance12m(solarTrackerId: string): Promise<AverageSensorValueDto[]> {
        const result = await this.getAvgValue(TWELVE_MONTHS_IN_MILLISECONDS, solarTrackerId, '$month', 'irradiance');
        if (result.length > 0) {
            return this.mapAvgValueToDto(result, 12);
        }
    }
}