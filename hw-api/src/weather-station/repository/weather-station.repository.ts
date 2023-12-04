import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../../shared/database';
import { WeatherStation } from '../schema';

@Injectable()
export class WeatherStationRepository extends EntityRepository<WeatherStation> {
    constructor(@InjectModel(WeatherStation.name) model: Model<WeatherStation>) {
        super(model);
    }
}