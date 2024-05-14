 import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseFilters } from '@nestjs/common';
import { AxiosErrorFilter } from '../shared/filter';
import { ValidateMongoId } from '../shared/pipe';
import { SolarTrackerService } from './solar-tracker.service';
import {
    InitSTReq, InitSTRes,
    SaveSTSensorsDataReq, SaveSTSensorsDataRes,
    ReportSTStateReq, ReportSTStateRes,
    GetSTInsightsReq, GetSTInsightsRes,
    ValidateSTSerialNumberRes
} from './dto';

@Controller('solar-trackers')
export class SolarTrackerController {
    constructor(private readonly solarTrackerService: SolarTrackerService) { }

    @Post('/')
    async init(@Body() solarTrackerData: InitSTReq): Promise<InitSTRes> {
        return await this.solarTrackerService.init(solarTrackerData);
    }

    @Post('/:solarTrackerId/sensors-data')
    async saveSensorsData(
        @Param('solarTrackerId', ValidateMongoId) solarTrackerId: string,
        @Body() sensorsData: SaveSTSensorsDataReq
    ): Promise<SaveSTSensorsDataRes> {
        return await this.solarTrackerService.saveSensorsData(solarTrackerId, sensorsData);
    }

    @Post('/:solarTrackerId/reports')
    @UseFilters(new AxiosErrorFilter())
    async reportState(
        @Param('solarTrackerId', ValidateMongoId) solarTrackerId: string,
        @Body() report: ReportSTStateReq
    ): Promise<ReportSTStateRes> {
        return await this.solarTrackerService.reportState(solarTrackerId, report);
    }

    @Get('/validate/:serialNumber')
    async validateSerialNumber(@Param('serialNumber') serialNumber: string): Promise<ValidateSTSerialNumberRes> {
        return await this.solarTrackerService.validateSerialNumber(serialNumber);
    }

    @Post('/insights')
    @HttpCode(HttpStatus.OK)
    async getInsights(@Body() requestData: GetSTInsightsReq): Promise<GetSTInsightsRes> {
        return await this.solarTrackerService.getInsights(requestData);
    }
}

// TODO: optimise validateSerialNumber method by passing array of serial numbers