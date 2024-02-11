import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SensorsRepository } from '../../abstract-device/repository';
import { AverageSensorValueDto } from '../../shared/dto';
import { TWENTY_FOUR_HOURS_IN_MILLISECONDS } from '../../shared/constants';
import { WeatherStationSensors } from '../schema';

@Injectable()
export class WeatherStationSensorsRepository extends SensorsRepository<WeatherStationSensors> {
    constructor(@InjectModel(WeatherStationSensors.name) model: Model<WeatherStationSensors>) {
        super(model);
    }

    async getHourlyAvgTempAndWindSpeed24h(weatherStationId: string): Promise<
    { temperature: AverageSensorValueDto[], windSpeed: AverageSensorValueDto[] }> {
        const result = await this.aggregate([
            {
                $match: {
                    deviceId: weatherStationId,
                    timestamp: {
                        $gte: new Date(new Date().getTime() - TWENTY_FOUR_HOURS_IN_MILLISECONDS),
                        $lt: new Date(),
                    }
                }
            },
            {
                $group: {
                    _id: { $hour: '$timestamp' },
                    avgTemp: { $avg: '$temperature' },
                    avgWindSpeed: { $avg: '$windSpeed' },
                }
            },
        ]);

        if (result.length !== 0) {
            const temperature = [];
            const windSpeed = [];

            for (let i = 1; i <= 24; ++i) {
                temperature.push({ id: i, average: null });
                windSpeed.push({ id: i, average: null });
            }

            return {
                temperature: temperature.map((entity) => {
                    const found = result.find((record) => record._id === entity.id);
                    return found ? { id: found._id, average: found.avgTemp } : entity;
                }),
                windSpeed: windSpeed.map((entity) => {
                    const found = result.find((record) => record._id === entity.id);
                    return found ? { id: found._id, average: found.avgWindSpeed } : entity;
                }),
            };
        }
    }
}