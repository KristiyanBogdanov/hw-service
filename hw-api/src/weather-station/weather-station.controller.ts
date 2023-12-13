import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ValidateSerialNumberRes } from '../abstract-device/dto';
import { WeatherStationService } from './weather-station.service';
import {
    InitWSReq, InitWSRes,
    SaveWSSensorsDataReq, SaveWSSensorsDataRes,
    ReportWSSensorsStatusReq, ReportWSSensorsStatusRes
} from './dto';

@Controller('weather-station')
export class WeatherStationController {
    constructor(private readonly service: WeatherStationService) { }

    @Post('/init')
    async init(@Body() weatherStationData: InitWSReq): Promise<InitWSRes> {
        return await this.service.init(weatherStationData);
    }

    @Post('/:serialNumber/sensors-data')
    async saveSensorsData(
        @Param('serialNumber') serialNumber: string,
        @Body() sensorsData: SaveWSSensorsDataReq
    ): Promise<SaveWSSensorsDataRes> {
        return await this.service.saveSensorsData(serialNumber, sensorsData);
    }

    @Post('/:serialNumber/report')
    async reportSensorsStatus(
        @Param('serialNumber') serialNumber: string,
        @Body() sensorsReport: ReportWSSensorsStatusReq
    ): Promise<ReportWSSensorsStatusRes> {
        return await this.service.reportSensorsStatus(serialNumber, sensorsReport);
    }

    @Get('/validate/:serialNumber')
    async validateSerialNumber(@Param('serialNumber') serialNumber: string): Promise<ValidateSerialNumberRes> {
        return await this.service.validateSerialNumber(serialNumber);
    }
}