import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { EntityRepository } from '../../database';
import { AverageSensorValueDto } from '../../shared/dto';
import { ISensorsData } from '../interface';

@Injectable()
export abstract class SensorsRepository<T extends ISensorsData> extends EntityRepository<T> {
    constructor(protected readonly model: Model<T>) {
        super(model);
    }

    async getLatestSensorsData(deviceId: string): Promise<T> {
        return await this.findOne(
            { deviceId: deviceId },
            {},
            { sort: { timestamp: -1 } }
        );
    }

    protected mapAvgValueToDto(dbResult: { _id: string, average: number, timestamp: Date }[], expectedLength: number): AverageSensorValueDto[] {
        const entities = [];

        for (let i = 1; i <= expectedLength; ++i) {
            entities.push({ id: i, average: null });
        }

        for (const record of dbResult) {
            const currentTime = new Date().getTime();
            const recordTime = record.timestamp.getTime();
            const hoursDiff = Math.floor((currentTime - recordTime) / (1000 * 60 * 60));

            entities[hoursDiff - 1] = { id: hoursDiff, average: record.average };
        }

        return entities;
    }

    protected getAvgValue(interval: number, deviceId: string, groupingOperator: string, fieldName: string): Promise<
        { _id: string, average: number, timestamp: Date }[]
    > {
        return this.aggregate([
            {
                $match: {
                    deviceId: deviceId,
                    timestamp: {
                        $gte: new Date(new Date().getTime() - interval),
                        $lt: new Date(),
                    }
                }
            },
            {
                $group: {
                    _id: { [groupingOperator]: '$timestamp' },
                    average: { $avg: `$${fieldName}` },
                    timestamp: { $first: '$timestamp' },
                },
            },
            {
                $sort: { timestamp: 1 },
            }
        ]);
    }
}