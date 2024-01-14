import { Injectable, NotFoundException } from '@nestjs/common';
import { Document } from 'mongoose';
import { EntityRepository } from '../shared/database';
import { IDevice, ISensorsData, ISensorsReport } from './interface';
import { ValidateSerialNumberRes } from './dto';

@Injectable()
export abstract class DeviceService<
    Device extends IDevice,
    SensorsData extends ISensorsData,
    SensorsReport extends ISensorsReport,
    DeviceRepository extends EntityRepository<Device>,
    SensorsRepository extends EntityRepository<SensorsData>,
    ReportRepository extends EntityRepository<SensorsReport>,
> {
    constructor(
        protected readonly deviceRepository: DeviceRepository,
        protected readonly sensorsRepository: SensorsRepository,
        protected readonly reportRepository: ReportRepository,
    ) { }

    protected async createDevice(device: Device): Promise<Device & Document> {
        device.isActive = true;
        device.lastUpdate = new Date();

        return await this.deviceRepository.create(device);
    }

    private checkIsActiveStatus(device: Device & Document) {
        if (device.isActive === false) {
            device.isActive = true;
        }

        device.lastUpdate = new Date()
        device.save();
    }

    protected async saveDeviceSensorsData(serialNumber: string, sensorsData: SensorsData): Promise<SensorsData & Document> {
        const device = await this.deviceRepository.findOne({ serialNumber: serialNumber });

        if (!device) {
            throw new NotFoundException(`Device with serial number ${serialNumber} not found`);
        }

        this.checkIsActiveStatus(device);

        return await this.sensorsRepository.create(sensorsData);
    }

    protected async saveDeviceSensorsReport(serialNumber: string, sensorsReport: SensorsReport): Promise<SensorsReport & Document> {
        const device = await this.deviceRepository.findOne({ serialNumber: serialNumber });

        if (!device) {
            throw new NotFoundException(`Device with serial number ${serialNumber} not found`);
        }

        this.checkIsActiveStatus(device);

        const updateFields: Record<string, boolean> = {};

        for (const sensorName of Object.keys(sensorsReport)) {
            if (sensorsReport[sensorName].isActive !== device.sensorsStatus[sensorName]) {
                updateFields[`sensorsStatus.${sensorName}`] = sensorsReport[sensorName].isActive;
            }
        }

        if (Object.keys(updateFields).length > 0) {
            await this.deviceRepository.updateOne({ serialNumber: serialNumber }, {
                $set: updateFields
            });
        }

        return await this.reportRepository.create(sensorsReport);
    }

    async validateSerialNumber(serialNumber: string): Promise<ValidateSerialNumberRes> {
        const device = await this.deviceRepository.findOne({ serialNumber: serialNumber });
        return { isValid: !!device };
    }
}