import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';
import { DatabaseModule } from './database/database.module';
import { SolarTrackerModule } from './solar-tracker/solar-tracker.module';
import { WeatherStationModule } from './weather-station/weather-station.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        LoggerModule.forRoot({
            forRoutes: ['*'],
            pinoHttp: {
                customProps: (req, res) => ({
                    context: 'HTTP',
                }),
                transport: {
                    target: 'pino-pretty',
                    options: {
                        singleLine: true,
                    },
                },
            },
        }),
        DatabaseModule,
        ScheduleModule.forRoot(),
        SolarTrackerModule,
        WeatherStationModule,
        CacheModule.register({
            isGlobal: true,
        })
    ],
})
export class AppModule { }