import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ValidateSerialNumberRes } from '../abstract-device/dto';
import { SolarTrackerService } from './solar-tracker.service';
import {
    InitSTReq, InitSTRes,
    SaveSTSensorsDataReq, SaveSTSensorsDataRes,
    ReportSTSensorsStatusReq, ReportSTSensorsStatusRes, 
    GetSTInsightsReq, GetSTInsightsRes
} from './dto';

@Controller('solar-tracker')
export class SolarTrackerController {
    constructor(private readonly service: SolarTrackerService) { }

    @Post('/init')
    async init(@Body() solarTrackerData: InitSTReq): Promise<InitSTRes> {
        return await this.service.init(solarTrackerData);
    }

    @Post('/:serialNumber/sensors-data')
    async saveSensorsData(
        @Param('serialNumber') serialNumber: string,
        @Body() sensorsData: SaveSTSensorsDataReq
    ): Promise<SaveSTSensorsDataRes> {
        return await this.service.saveSensorsData(serialNumber, sensorsData);
    }

    @Post('/:serialNumber/report')
    async reportSensorsStatus(
        @Param('serialNumber') serialNumber: string,
        @Body() sensorsReport: ReportSTSensorsStatusReq
    ): Promise<ReportSTSensorsStatusRes> {
        return await this.service.reportSensorsStatus(serialNumber, sensorsReport);
    }

    @Get('/validate/:serialNumber')
    async validateSerialNumber(@Param('serialNumber') serialNumber: string): Promise<ValidateSerialNumberRes> {
        return await this.service.validateSerialNumber(serialNumber);
    }

    @Post('/insights')
    @HttpCode(HttpStatus.OK)
    async getInsights(@Body() requestData: GetSTInsightsReq): Promise<GetSTInsightsRes> {
        return await this.service.getInsights(requestData);
    }
}