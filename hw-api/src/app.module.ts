import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { SolarTrackerModule } from './solar-tracker/solar-tracker.module';
import { WeatherStationModule } from './weather-station/weather-station.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('DATABASE_URI'),
                dbName: configService.get<string>('DATABASE_NAME'),
            }),
            inject: [ConfigService],
        }),
        ScheduleModule.forRoot(),
        SolarTrackerModule,
        WeatherStationModule
    ],
})
export class AppModule { }