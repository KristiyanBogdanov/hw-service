import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeviceRepository } from '../../abstract-device/repository';
import { WeatherStation } from '../schema';

@Injectable()
export class WeatherStationRepository extends DeviceRepository<WeatherStation> {
    constructor(@InjectModel(WeatherStation.name) model: Model<WeatherStation>) {
        super(model);
    }
}