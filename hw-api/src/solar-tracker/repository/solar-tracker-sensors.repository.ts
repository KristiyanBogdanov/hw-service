import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SensorsRepository } from '../../abstract-device/repository';
import { AverageSensorValueDto } from '../../shared/dto';
import { TWENTY_FOUR_HOURS_IN_MILLISECONDS } from '../../shared/constants';
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
}