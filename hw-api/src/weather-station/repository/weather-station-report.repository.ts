import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../../database';
import { WeatherStationReport } from '../schema';

@Injectable()
export class WeatherStationReportRepository extends EntityRepository<WeatherStationReport> {
    constructor(@InjectModel(WeatherStationReport.name) model: Model<WeatherStationReport>) {
        super(model);
    }
}