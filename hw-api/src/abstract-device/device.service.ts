import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Document } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { EntityRepository } from '../database';
import { IDevice, ISensorsData, IDeviceReport } from './interface';
import { MobileAppNotificationDto } from './dto';
import { DeviceType } from './enum';
import { DeviceRepository, SensorsRepository } from './repository';
import { MobileNotificationReqFailedException } from './exception';

@Injectable()
export abstract class DeviceService<
    TDevice extends IDevice,
    TSensorsData extends ISensorsData,
    TDeviceReport extends IDeviceReport,
    TDeviceRepository extends DeviceRepository<TDevice>,
    TSensorsRepository extends SensorsRepository<TSensorsData>,
    TReportRepository extends EntityRepository<TDeviceReport>,
> {
    constructor(
        protected readonly deviceRepository: TDeviceRepository,
        protected readonly sensorsRepository: TSensorsRepository,
        protected readonly reportRepository: TReportRepository,
        private readonly httpService: HttpService,
    ) { }

    protected async createDevice(device: TDevice): Promise<TDevice> {
        const existingDevice = await this.deviceRepository.findOne({ serialNumber: device.serialNumber });

        if (existingDevice) {
            throw new ConflictException();
        }

        device.isActive = true;
        device.lastUpdate = new Date();

        return await this.deviceRepository.create(device);
    }

    private checkIsActiveStatus(device: TDevice & Document) {
        if (device.isActive === false) {
            device.isActive = true;
        }

        device.lastUpdate = new Date()
        device.save();
    }

    protected async saveDeviceSensorsData(deviceId: string, sensorsData: TSensorsData): Promise<TSensorsData> {
        const device = await this.deviceRepository.findById(deviceId);

        if (!device) {
            throw new NotFoundException();
        }

        this.checkIsActiveStatus(device);

        return await this.sensorsRepository.create(sensorsData);
    }

    protected async saveDeviceReport(deviceId: string, deviceReport: TDeviceReport): Promise<{ savedReport: TDeviceReport, serialNumber: string }> {
        const device = await this.deviceRepository.findById(deviceId);

        if (!device) {
            throw new NotFoundException();
        }

        this.checkIsActiveStatus(device);

        this.deviceRepository.updateSensorsStatus(device, deviceReport);

        return {
            savedReport: await this.reportRepository.create(deviceReport),
            serialNumber: device.serialNumber
        };
    }

    async sendHwNotificationToMobileApp(report: IDeviceReport, serialNumber: string, deviceType: DeviceType, apiEndpoint: string): Promise<void> {
        const mobileAppNotificationDto = plainToClass(MobileAppNotificationDto, report);
        mobileAppNotificationDto.serialNumber = serialNumber;
        mobileAppNotificationDto.message = report.generalMessage;
        mobileAppNotificationDto.deviceType = deviceType;

        const result = await lastValueFrom(
            this.httpService.post<void>(apiEndpoint, mobileAppNotificationDto)
        );

        if (result.status !== HttpStatus.CREATED) {
            throw new MobileNotificationReqFailedException();
        }
    }
}