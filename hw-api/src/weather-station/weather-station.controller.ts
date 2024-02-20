import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ValidateMongoId } from '../shared/pipe';
import { WeatherStationService } from './weather-station.service';
import {
    InitWSReq, InitWSRes,
    SaveWSSensorsDataReq, SaveWSSensorsDataRes,
    ReportWSStateReq, ReportWSStateRes, 
    GetWSInsightsRes,
    ValidateWSSerialNumberRes
} from './dto';

@Controller('weather-stations')
export class WeatherStationController {
    constructor(private readonly weatherStationService: WeatherStationService) { }

    @Post('/')
    async init(@Body() weatherStationData: InitWSReq): Promise<InitWSRes> {
        return await this.weatherStationService.init(weatherStationData);
    }

    @Post('/:weatherStationId/sensors-data')
    async saveSensorsData(
        @Param('weatherStationId', ValidateMongoId) weatherStationId: string,
        @Body() sensorsData: SaveWSSensorsDataReq
    ): Promise<SaveWSSensorsDataRes> {
        return await this.weatherStationService.saveSensorsData(weatherStationId, sensorsData);
    }

    @Post('/:weatherStationId/reports')
    async reportState(
        @Param('weatherStationId', ValidateMongoId) weatherStationId: string,
        @Body() report: ReportWSStateReq
    ): Promise<ReportWSStateRes> {
        return await this.weatherStationService.reportState(weatherStationId, report);
    }

    @Get('/validate/:serialNumber')
    async validateSerialNumber(@Param('serialNumber') serialNumber: string): Promise<ValidateWSSerialNumberRes> {
        return await this.weatherStationService.validateSerialNumber(serialNumber);
    }

    @Get('/:serialNumber/insights')
    async getInsights(@Param('serialNumber') serialNumber: string): Promise<GetWSInsightsRes> {
        return await this.weatherStationService.getInsights(serialNumber);
    }
}