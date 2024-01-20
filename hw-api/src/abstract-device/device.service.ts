import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Document } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { EntityRepository } from '../shared/database';
import { MobileAppApi } from '../shared/api';
import { IDevice, ISensorsData, IDeviceReport } from './interface';
import { MobileAppNotificationDto, ValidateSerialNumberRes } from './dto';
import { DeviceType, NotificationType } from './enum';

@Injectable()
export abstract class DeviceService<
    Device extends IDevice,
    SensorsData extends ISensorsData,
    DeviceReport extends IDeviceReport,
    DeviceRepository extends EntityRepository<Device>,
    SensorsRepository extends EntityRepository<SensorsData>,
    ReportRepository extends EntityRepository<DeviceReport>,
> {
    constructor(
        protected readonly deviceRepository: DeviceRepository,
        protected readonly sensorsRepository: SensorsRepository,
        protected readonly reportRepository: ReportRepository,
        private readonly httpService: HttpService,
        private readonly mobileAppApi: MobileAppApi,
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

    protected async saveDeviceReport(serialNumber: string, deviceReport: DeviceReport): Promise<DeviceReport & Document> {
        const device = await this.deviceRepository.findOne({ serialNumber: serialNumber });

        if (!device) {
            throw new NotFoundException(`Device with serial number ${serialNumber} not found`);
        }

        this.checkIsActiveStatus(device);

        const updateFields: Record<string, boolean> = {};

        for (const sensorName of Object.keys(deviceReport)) {
            if (deviceReport[sensorName].isActive !== device.sensorsStatus[sensorName]) {
                updateFields[`sensorsStatus.${sensorName}`] = deviceReport[sensorName].isActive;
            }
        }

        if (Object.keys(updateFields).length > 0) {
            await this.deviceRepository.updateOne({ serialNumber: serialNumber }, {
                $set: updateFields
            });
        }

        return await this.reportRepository.create(deviceReport);
    }

    async sendNotificationToMobileApp(report: IDeviceReport, deviceType: DeviceType, notificationType: NotificationType) {
        const mobileAppNotificationDto = plainToClass(MobileAppNotificationDto, report);
        mobileAppNotificationDto.message = report.generalMessage;
        mobileAppNotificationDto.notificationType = notificationType;
        mobileAppNotificationDto.deviceType = deviceType;

        const result = await lastValueFrom(
            this.httpService.post<void>(this.mobileAppApi.sendHwNotification(), mobileAppNotificationDto)
        );

        if (result.status !== HttpStatus.CREATED) {
            throw new InternalServerErrorException('Failed to send notification to mobile app');
        }
    }

    async validateSerialNumber(serialNumber: string): Promise<ValidateSerialNumberRes> {
        const device = await this.deviceRepository.findOne({ serialNumber: serialNumber });
        return { isValid: !!device };
    }
}

// TODO: try to remove toObject() calls and excludeExtraneousValues: true