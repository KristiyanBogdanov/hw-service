import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../../shared/database';
import { SolarTrackerReport } from '../schema';

@Injectable()
export class SolarTrackerReportRepository extends EntityRepository<SolarTrackerReport> {
    constructor(@InjectModel(SolarTrackerReport.name) model: Model<SolarTrackerReport>) {
        super(model);
    }
}