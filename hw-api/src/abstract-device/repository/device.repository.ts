import { Injectable } from '@nestjs/common';
import { Document, Model } from 'mongoose';
import { EntityRepository } from '../../database';
import { IDevice, IDeviceReport } from '../interface';

@Injectable()
export abstract class DeviceRepository<T extends IDevice> extends EntityRepository<T> {
    constructor(protected readonly model: Model<T>) {
        super(model);
    }

    async findInactiveDevices(cronIntervalInMilliseconds: number): Promise<(T & Document)[]> {
        const now = new Date();
        const lastUpdate = new Date(now.getTime() - cronIntervalInMilliseconds);

        return await this.find({
            isActive: true,
            lastUpdate: { $lte: lastUpdate }
        });
    }

    async updateSensorsStatus(device: T, deviceReport: IDeviceReport): Promise<void> {
        const updateFields: Record<string, boolean> = {};

        for (const sensorName of Object.keys(deviceReport)) {
            if (deviceReport[sensorName] && deviceReport[sensorName].isActive !== device.sensorsStatus[sensorName]) {
                updateFields[`sensorsStatus.${sensorName}`] = deviceReport[sensorName].isActive;
            }
        }

        if (Object.keys(updateFields).length > 0) {
            await this.updateOne({ _id: device.id }, {
                $set: updateFields
            });
        }
    }
}