import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SensorsRepository } from '../../abstract-device/repository';
import { AverageSensorValueDto } from '../../abstract-device/dto';
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
                    timestamp: { $first: '$timestamp' },
                }
            },
            {
                $sort: { timestamp: 1 },
            },
        ]);

        if (result.length !== 0) {
            const temperature = [];
            const windSpeed = [];

            for (let i = 1; i <= 24; ++i) {
                temperature.push({ id: i, average: null });
                windSpeed.push({ id: i, average: null });
            }

            for (const record of result) {
                const currentTime = new Date().getTime();
                const recordTime = record.timestamp.getTime();
                const hoursDiff = Math.floor((currentTime - recordTime) / (1000 * 60 * 60));

                temperature[hoursDiff - 1] = { id: hoursDiff, average: record.avgTemp };
                windSpeed[hoursDiff - 1] = { id: hoursDiff, average: record.avgWindSpeed };
            }
            
            return { temperature, windSpeed };
        }
    }
}