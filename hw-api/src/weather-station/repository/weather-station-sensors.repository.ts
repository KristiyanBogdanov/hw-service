import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../../shared/database';
import { WeatherStationSensors } from '../schema';

@Injectable()
export class WeatherStationSensorsRepository extends EntityRepository<WeatherStationSensors> {
    constructor(@InjectModel(WeatherStationSensors.name) model: Model<WeatherStationSensors>) {
        super(model);
    }
}