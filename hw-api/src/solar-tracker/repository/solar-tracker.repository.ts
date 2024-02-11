import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeviceRepository } from '../../abstract-device/repository';
import { SolarTracker } from '../schema';

@Injectable()
export class SolarTrackerRepository extends DeviceRepository<SolarTracker> {
    constructor(@InjectModel(SolarTracker.name) model: Model<SolarTracker>) {
        super(model);
    }
}