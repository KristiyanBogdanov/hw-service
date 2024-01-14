import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { EntityRepository } from '../../shared/database';
import { AverageSensorValueDto } from '../../shared/dto';

@Injectable()
export abstract class SensorsRepository<T> extends EntityRepository<T> {
    constructor(protected readonly model: Model<T>) {
        super(model);
    }

    async getLatestSensorsData(serialNumber: string): Promise<T> {
        return await this.findOne(
            { serialNumber: serialNumber },
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

    protected getAvgValue(serialNumber: string, groupingOperator: string, fieldName: string): Promise<Record<string, number>[]> {
        return this.aggregate([
            {
                $match: {
                    serialNumber: serialNumber
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