import { Test } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ConflictException, Logger, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Document } from 'mongoose';
import { MobileAppApi } from '../../shared/api';
import { InitSTRes, ReportSTStateRes, SaveSTSensorsDataRes, ValidateSTSerialNumberRes } from '../dto';
import { SolarTrackerReportRepository, SolarTrackerRepository, SolarTrackerSensorsRepository } from '../repository';
import { SolarTrackerService } from '../solar-tracker.service';
import { SolarTracker, SolarTrackerReport, SolarTrackerSensors } from '../schema';
import {
    initSTReqStub, initSTResStub,
    reportSTStateReqStub, reportSTStateResStub,
    saveSTSensorsDataReqStub, saveSTSensorsDataResStub,
    solarTrackerDocumentStub, solarTrackerReportDocumentStub, solarTrackerSensorsDocumentStub,
    solarTrackerStub
} from './stub';

describe('SolarTrackerService', () => {
    let solarTrackerService: SolarTrackerService;
    let solarTrackerRepository: DeepMocked<SolarTrackerRepository>;
    let solarTrackerSensorsRepository: DeepMocked<SolarTrackerSensorsRepository>;
    let solarTrackerReportRepository: DeepMocked<SolarTrackerReportRepository>;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [],
            providers: [
                SolarTrackerService,
                {
                    provide: SolarTrackerRepository,
                    useValue: createMock<SolarTrackerRepository>()
                },
                {
                    provide: SolarTrackerSensorsRepository,
                    useValue: createMock<SolarTrackerSensorsRepository>()
                },
                {
                    provide: SolarTrackerReportRepository,
                    useValue: createMock<SolarTrackerReportRepository>()
                },
                {
                    provide: HttpService,
                    useValue: createMock<HttpService>(),
                },
                {
                    provide: MobileAppApi,
                    useValue: createMock<MobileAppApi>(),
                },
                {
                    provide: Logger,
                    useValue: createMock<Logger>(),
                },
            ]
        }).compile();

        solarTrackerService = moduleRef.get<SolarTrackerService>(SolarTrackerService);
        solarTrackerRepository = moduleRef.get(SolarTrackerRepository);
        solarTrackerSensorsRepository = moduleRef.get(SolarTrackerSensorsRepository);
        solarTrackerReportRepository = moduleRef.get(SolarTrackerReportRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('init', () => {
        describe('when init method is called with new solar tracker data', () => {
            let solarTrackerDocument: SolarTracker & Document;
            let result: InitSTRes;

            beforeEach(async () => {
                solarTrackerDocument = solarTrackerDocumentStub() as unknown as SolarTracker & Document;

                solarTrackerRepository.findOne.mockResolvedValue(null);
                solarTrackerRepository.create.mockResolvedValue(solarTrackerDocument);

                result = await solarTrackerService.init(initSTReqStub());
            });

            test('then it should call solarTrackerRepository.create', () => {
                expect(solarTrackerRepository.create).toHaveBeenCalledWith(
                    expect.objectContaining({
                        isActive: true,
                        lastUpdate: expect.any(Date),
                    })
                );
            });

            test('then it should return InitSTRes', () => {
                expect(result).toEqual(initSTResStub());
            });
        });

        describe('when init method is called with existing solar tracker data', () => {
            let solarTrackerDocument: SolarTracker & Document;
            let result: Error;

            beforeEach(async () => {
                solarTrackerDocument = solarTrackerDocumentStub() as unknown as SolarTracker & Document;
                solarTrackerRepository.findOne.mockResolvedValue(solarTrackerDocument);

                try {
                    await solarTrackerService.init(initSTReqStub());
                } catch (error) {
                    result = error;
                }
            });

            test('then it should throw ConflictException', () => {
                expect(result).toBeInstanceOf(ConflictException);
            });

            test('then it should not call solarTrackerRepository.create', () => {
                expect(solarTrackerRepository.create).not.toHaveBeenCalled();
            });
        });
    });

    describe('saveSensorsData', () => {
        describe('when saveSensorsData method is called with existing solar tracker id', () => {
            let solarTrackerDocument: SolarTracker & Document;
            let solarTrackerSensorsDocument: SolarTrackerSensors & Document;
            let result: SaveSTSensorsDataRes;

            beforeEach(async () => {
                solarTrackerDocument = solarTrackerDocumentStub() as unknown as SolarTracker & Document;
                solarTrackerSensorsDocument = solarTrackerSensorsDocumentStub() as unknown as SolarTrackerSensors & Document;

                solarTrackerRepository.findById.mockResolvedValue(solarTrackerDocument);
                solarTrackerSensorsRepository.create.mockResolvedValue(solarTrackerSensorsDocument);

                result = await solarTrackerService.saveSensorsData(solarTrackerStub().id, saveSTSensorsDataReqStub());
            });

            test('then it should update lastUpdate field on the solarTrackerDocument', () => {
                let lastUpdateBefore = solarTrackerDocumentStub().lastUpdate;
                expect(solarTrackerDocument.lastUpdate.getTime()).toBeGreaterThan(lastUpdateBefore.getTime());
            });

            test('then it should call save method on the solarTrackerDocument', () => {
                expect(solarTrackerDocument.save).toHaveBeenCalled();
            });

            test('then it should call solarTrackerSensorsRepository.create', () => {
                expect(solarTrackerSensorsRepository.create).toHaveBeenCalled();
            });

            test('then it should return SaveSTSensorsDataRes', () => {
                expect(result).toEqual(saveSTSensorsDataResStub());
            });
        });

        describe('when saveSensorsData method is called with non-existing solar tracker id', () => {
            let result: Error;

            beforeEach(async () => {
                solarTrackerRepository.findById.mockResolvedValue(null);

                try {
                    await solarTrackerService.saveSensorsData(solarTrackerStub().id, saveSTSensorsDataReqStub());
                } catch (error) {
                    result = error;
                }
            });

            test('then it should not call solarTrackerSensorsRepository.create', () => {
                expect(solarTrackerSensorsRepository.create).not.toHaveBeenCalled();
            });

            test('then it should throw NotFoundException', () => {
                expect(result).toBeInstanceOf(NotFoundException);
            });
        });

        describe('when saveSensorsData method is called with inactive solar tracker', () => {
            let solarTrackerDocument: SolarTracker & Document;

            beforeEach(async () => {
                solarTrackerDocument = solarTrackerDocumentStub() as unknown as SolarTracker & Document;
                solarTrackerDocument.isActive = false;
                solarTrackerRepository.findById.mockResolvedValue(solarTrackerDocument);

                await solarTrackerService.saveSensorsData(solarTrackerStub().id, saveSTSensorsDataReqStub());
            });

            test('then it should update isActive field on the solarTrackerDocument', () => {
                expect(solarTrackerDocument.isActive).toBe(true);
            });

            test('then it should call save method on the solarTrackerDocument', () => {
                expect(solarTrackerDocument.save).toHaveBeenCalled();
            });
        });
    });

    describe('reportState', () => {
        describe('when reportState method is called with existing solar tracker id', () => {
            let solarTrackerDocument: SolarTracker & Document;
            let solarTrackerReportDocument: SolarTrackerReport & Document;
            let result: ReportSTStateRes;

            beforeEach(async () => {
                solarTrackerDocument = solarTrackerDocumentStub() as unknown as SolarTracker & Document;
                solarTrackerReportDocument = solarTrackerReportDocumentStub() as unknown as SolarTrackerReport & Document;

                solarTrackerRepository.findById.mockResolvedValue(solarTrackerDocument);
                solarTrackerReportRepository.create.mockResolvedValue(solarTrackerReportDocument);
                solarTrackerService.sendHwNotificationToMobileApp = jest.fn();

                result = await solarTrackerService.reportState(solarTrackerStub().id, reportSTStateReqStub());
            });

            test('then it should update lastUpdate field on the solarTrackerDocument', () => {
                let lastUpdateBefore = solarTrackerDocumentStub().lastUpdate;
                expect(solarTrackerDocument.lastUpdate.getTime()).toBeGreaterThan(lastUpdateBefore.getTime());
            });

            test('then it should call save method on the solarTrackerDocument', () => {
                expect(solarTrackerDocument.save).toHaveBeenCalled();
            });

            test('then it should call solarTrackerRepository.updateSensorsStatus', () => {
                expect(solarTrackerRepository.updateSensorsStatus).toHaveBeenCalled();
            });

            test('then it should call solarTrackerReportRepository.create', () => {
                expect(solarTrackerReportRepository.create).toHaveBeenCalled();
            });

            test('then it should call sendHwNotificationToMobileApp', () => {
                expect(solarTrackerService.sendHwNotificationToMobileApp).toHaveBeenCalled();
            });

            test('then it should return ReportSTStateRes', () => {
                expect(result).toEqual(reportSTStateResStub());
            });
        });

        describe('when reportState method is called with non-existing solar tracker id', () => {
            let result: Error;

            beforeEach(async () => {
                solarTrackerRepository.findById.mockResolvedValue(null);

                try {
                    await solarTrackerService.reportState(solarTrackerStub().id, reportSTStateReqStub());
                } catch (error) {
                    result = error;
                }
            });

            test('then it should not call solarTrackerReportRepository.create', () => {
                expect(solarTrackerReportRepository.create).not.toHaveBeenCalled();
            });

            test('then it should throw NotFoundException', () => {
                expect(result).toBeInstanceOf(NotFoundException);
            });
        });

        describe('when reportState method is called with inactive solar tracker', () => {
            let solarTrackerDocument: SolarTracker & Document;

            beforeEach(async () => {
                solarTrackerDocument = solarTrackerDocumentStub() as unknown as SolarTracker & Document;
                solarTrackerDocument.isActive = false;

                solarTrackerRepository.findById.mockResolvedValue(solarTrackerDocument);
                solarTrackerService.sendHwNotificationToMobileApp = jest.fn();

                await solarTrackerService.reportState(solarTrackerStub().id, reportSTStateReqStub());
            });

            test('then it should update isActive field on the solarTrackerDocument', () => {
                expect(solarTrackerDocument.isActive).toBe(true);
            });

            test('then it should call save method on the solarTrackerDocument', () => {
                expect(solarTrackerDocument.save).toHaveBeenCalled();
            });
        });
    });

    describe('validateSerialNumber', () => {
        describe('when validateSerialNumber method is called with existing serial number', () => {
            let solarTrackerDocument: SolarTracker & Document;
            let result: ValidateSTSerialNumberRes;

            beforeEach(async () => {
                solarTrackerDocument = solarTrackerDocumentStub() as unknown as SolarTracker & Document;

                solarTrackerRepository.findOne.mockResolvedValue(solarTrackerDocument);

                result = await solarTrackerService.validateSerialNumber(solarTrackerStub().serialNumber);
            });

            test('then it should call solarTrackerRepository.findOne', () => {
                expect(solarTrackerRepository.findOne).toHaveBeenCalledWith({ serialNumber: solarTrackerStub().serialNumber });
            });

            test('then it should return ValidateSTSerialNumberRes', () => {
                expect(result).toEqual({
                    isValid: true,
                    capacity: solarTrackerDocument.capacity
                });
            });
        });

        describe('when validateSerialNumber method is called with non-existing serial number', () => {
            let result: ValidateSTSerialNumberRes;

            beforeEach(async () => {
                solarTrackerRepository.findOne.mockResolvedValue(null);

                result = await solarTrackerService.validateSerialNumber(solarTrackerStub().serialNumber);
            });

            test('then it should return ValidateSTSerialNumberRes', () => {
                expect(result).toEqual({
                    isValid: false,
                    capacity: undefined
                });
            });
        });
    });

    describe('getInsights', () => {
        describe('when getInsights method is called with non-existing serial number', () => {
            let result: Error;

            beforeEach(async () => {
                solarTrackerRepository.findOne.mockResolvedValue(null);

                try {
                    await solarTrackerService.getInsights({ serialNumbers: [solarTrackerStub().serialNumber] });
                } catch (error) {
                    result = error;
                }
            });

            test('then it should throw NotFoundException', () => {
                expect(result).toBeInstanceOf(NotFoundException);
            });
        });
    });
});