import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../../shared/database';
import { SolarTrackerSensors } from '../schema';

@Injectable()
export class SolarTrackerSensorsRepository extends EntityRepository<SolarTrackerSensors> {
    constructor(@InjectModel(SolarTrackerSensors.name) model: Model<SolarTrackerSensors>) {
        super(model);
    }
}