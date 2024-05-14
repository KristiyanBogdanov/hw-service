import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from './database.service';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('NODE_ENV') === 'test'
                    ? configService.get<string>('TEST_DATABASE_URI')
                    : configService.get<string>('DATABASE_URI'),
                dbName: configService.get<string>('DATABASE_NAME'),
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule { }