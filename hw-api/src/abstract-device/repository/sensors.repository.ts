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

    protected mapAvgValueToDto(dbResult: Record<string, number>[], expectedLength: number): AverageSensorValueDto[] {
        const entities = [];
        for (let i = 1; i <= expectedLength; ++i) {
            entities.push({ id: i, average: null });
        }

        return entities.map((entity) => {
            const found = dbResult.find((record) => record._id === entity.id);
            return found ? { id: found._id, average: found.average } : entity;
        });
    }

    protected getAvgValue(interval:number, deviceId: string, groupingOperator: string, fieldName: string): Promise<Record<string, number>[]> {
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
                }
            },
        ]);
    }
}