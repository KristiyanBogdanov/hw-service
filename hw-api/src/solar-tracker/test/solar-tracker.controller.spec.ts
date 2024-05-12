import { Test } from '@nestjs/testing';
import { SolarTrackerController } from '../solar-tracker.controller';
import { SolarTrackerService } from '../solar-tracker.service';
import { GetSTInsightsRes, InitSTRes, ReportSTStateRes, SaveSTSensorsDataRes, ValidateSTSerialNumberRes } from '../dto';
import { 
    initSTReqStub, initSTResStub, 
    reportSTStateReqStub, reportSTStateResStub, 
    saveSTSensorsDataReqStub, saveSTSensorsDataResStub, 
    validateSTSerialNumberResStub,
    getSTInsightsReqStub,getSTInsightsResStub,
    solarTrackerStub
} from './stub';

jest.mock('../solar-tracker.service');

describe('SolarTrackerController', () => {
    let solarTrackerController: SolarTrackerController;
    let solarTrackerService: SolarTrackerService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [],
            controllers: [SolarTrackerController],
            providers: [SolarTrackerService]
        }).compile();

        solarTrackerService = moduleRef.get<SolarTrackerService>(SolarTrackerService);
        solarTrackerController = moduleRef.get<SolarTrackerController>(SolarTrackerController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('init', () => {
        describe('when init method is called', () => {
            let result: InitSTRes;

            beforeEach(async () => {
                result = await solarTrackerController.init(initSTReqStub());
            });

            test('then it should call solarTrackerService.init', () => {
                expect(solarTrackerService.init).toHaveBeenCalledWith(initSTReqStub());
            });

            test('then it should return InitSTRes', () => {
                expect(result).toEqual(initSTResStub());
            });
        });
    });

    describe('saveSensorsData', () => {
        describe('when saveSensorsData method is called', () => {
            let result: SaveSTSensorsDataRes;

            beforeEach(async () => {
                result = await solarTrackerController.saveSensorsData(solarTrackerStub().id, saveSTSensorsDataReqStub());
            });

            test('then it should call solarTrackerService.saveSensorsData', () => {
                expect(solarTrackerService.saveSensorsData).toHaveBeenCalledWith(solarTrackerStub().id, saveSTSensorsDataReqStub());
            });

            test('then it should return SaveSTSensorsDataRes', () => {
                expect(result).toEqual(saveSTSensorsDataResStub());
            });
        });
    });

    describe('reportState', () => {
        describe('when reportState method is called', () => {
            let result: ReportSTStateRes;

            beforeEach(async () => {
                result = await solarTrackerController.reportState(solarTrackerStub().id, reportSTStateReqStub());
            });

            test('then it should call solarTrackerService.reportState', () => {
                expect(solarTrackerService.reportState).toHaveBeenCalledWith(solarTrackerStub().id, reportSTStateReqStub());
            });

            test('then it should return ReportSTStateRes', () => {
                expect(result).toEqual(reportSTStateResStub());
            });
        });
    });

    describe('validateSerialNumber', () => {
        describe('when validateSerialNumber method is called', () => {
            let result: ValidateSTSerialNumberRes;

            beforeEach(async () => {
                result = await solarTrackerController.validateSerialNumber(solarTrackerStub().serialNumber);
            });

            test('then it should call solarTrackerService.validateSerialNumber', () => {
                expect(solarTrackerService.validateSerialNumber).toHaveBeenCalledWith(solarTrackerStub().serialNumber);
            });

            test('then it should return ValidateSTSerialNumberRes', () => {
                expect(result).toEqual(validateSTSerialNumberResStub());
            });
        });
    });

    describe('getInsights', () => {
        describe('when getInsights method is called', () => {
            let result: GetSTInsightsRes;

            beforeEach(async () => {
                result = await solarTrackerController.getInsights(getSTInsightsReqStub());
            });

            test('then it should call solarTrackerService.getInsights', () => {
                expect(solarTrackerService.getInsights).toHaveBeenCalledWith(getSTInsightsReqStub());
            });

            test('then it should return GetSTInsightsRes', () => {
                expect(result).toEqual(getSTInsightsResStub());
            });
        });
    });
});