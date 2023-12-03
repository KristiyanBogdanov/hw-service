import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../../shared/database';
import { SolarTracker } from '../schema';

@Injectable()
export class SolarTrackerRepository extends EntityRepository<SolarTracker> {
    constructor(@InjectModel(SolarTracker.name) model: Model<SolarTracker>) {
        super(model);
    }
}