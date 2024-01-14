import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SensorsRepository } from '../../abstract-device/repository';
import { AverageSensorValueDto } from '../../shared/dto';
import { SolarTrackerSensors } from '../schema';

@Injectable()
export class SolarTrackerSensorsRepository extends SensorsRepository<SolarTrackerSensors> {
    constructor(@InjectModel(SolarTrackerSensors.name) model: Model<SolarTrackerSensors>) {
        super(model);
    }

    async getHourlyAvgIrradiance24h(serialNumber: string): Promise<AverageSensorValueDto[]> {
        const result = await this.getAvgValue(serialNumber, '$hour', 'irradiance');
        if (result.length > 0) {
            return this.mapAvgValueToDto(result, 24);
        }
    }

    async getDailyAvgIrradiance7d(serialNumber: string): Promise<AverageSensorValueDto[]> {
        const result = await this.getAvgValue(serialNumber, '$dayOfWeek', 'irradiance'); // 1 - Sunday, 7 - Saturday
        if (result.length > 0) {
            return this.mapAvgValueToDto(result, 7);
        }
    }

    async getMonthlyAvgIrradiance12m(serialNumber: string): Promise<AverageSensorValueDto[]> {
        const result = await this.getAvgValue(serialNumber, '$month', 'irradiance');
        if (result.length > 0) {
            return this.mapAvgValueToDto(result, 12);
        }
    }
}