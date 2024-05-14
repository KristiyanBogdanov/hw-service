import { FilterQuery } from 'mongoose';
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SolarTrackerRepository } from '../../repository';
import { SolarTracker } from '../../schema';
import { SolarTrackerModel } from '../support';
import { solarTrackerReportStub, solarTrackerStub } from '../stub';

describe('SolarTrackerRepository', () => {
    let solarTrackerRepository: SolarTrackerRepository;
    let solarTrackerModel: SolarTrackerModel;
    let solarTrackerFilterQuery: FilterQuery<SolarTracker>;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                SolarTrackerRepository,
                {
                    provide: getModelToken(SolarTracker.name),
                    useClass: SolarTrackerModel
                }
            ]
        }).compile();

        solarTrackerRepository = moduleRef.get<SolarTrackerRepository>(SolarTrackerRepository);
        solarTrackerModel = moduleRef.get<SolarTrackerModel>(getModelToken(SolarTracker.name));

        solarTrackerFilterQuery = {
            serialNumber: solarTrackerStub().serialNumber
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findById', () => {
        describe('when findById is called', () => {
            let solarTracker: SolarTracker;

            beforeEach(async () => {
                jest.spyOn(solarTrackerModel, 'findById');
                solarTracker = await solarTrackerRepository.findById(solarTrackerStub().id);
            });

            test('then it should call findById on the solarTrackerModel', () => {
                expect(solarTrackerModel.findById).toHaveBeenCalledWith(solarTrackerStub().id, undefined, undefined);
            });

            test('then it should return SolarTracker', () => {
                expect(solarTracker).toEqual(solarTrackerStub());
            });
        });
    });

    describe('findOne', () => {
        describe('when findOne is called', () => {
            let solarTracker: SolarTracker;

            beforeEach(async () => {
                jest.spyOn(solarTrackerModel, 'findOne');
                solarTracker = await solarTrackerRepository.findOne(solarTrackerFilterQuery);
            });

            test('then it should call findOne on the solarTrackerModel', () => {
                expect(solarTrackerModel.findOne).toHaveBeenCalledWith(solarTrackerFilterQuery, undefined, undefined);
            });

            test('then it should return SolarTracker', () => {
                expect(solarTracker).toEqual(solarTrackerStub());
            });
        });
    });

    describe('find', () => {
        describe('when find is called', () => {
            let solarTrackers: SolarTracker[];

            beforeEach(async () => {
                jest.spyOn(solarTrackerModel, 'find');
                solarTrackers = await solarTrackerRepository.find(solarTrackerFilterQuery);
            });

            test('then it should call find on the solarTrackerModel', () => {
                expect(solarTrackerModel.find).toHaveBeenCalledWith(solarTrackerFilterQuery, undefined, undefined);
            });

            test('then it should return SolarTracker[]', () => {
                expect(solarTrackers).toEqual([solarTrackerStub()]);
            });
        });
    });

    describe('create', () => {
        describe('when create is called', () => {
            let solarTracker: SolarTracker;

            beforeEach(async () => {
                jest.spyOn(solarTrackerModel, 'create');
                solarTracker = await solarTrackerRepository.create(solarTrackerStub());
            });

            test('then it should call create on the solarTrackerModel', () => {
                expect(solarTrackerModel.create).toHaveBeenCalledWith(solarTrackerStub());
            });

            test('then it should return SolarTracker', () => {
                expect(solarTracker).toEqual(solarTrackerStub());
            });
        });
    });

    describe('updateOne', () => {
        describe('when updateOne is called', () => {
            let modifiedCount: number;

            beforeEach(async () => {
                jest.spyOn(solarTrackerModel, 'updateOne');
                modifiedCount = await solarTrackerRepository.updateOne(solarTrackerFilterQuery, solarTrackerStub());
            });

            test('then it should call updateOne on the solarTrackerModel', () => {
                expect(solarTrackerModel.updateOne).toHaveBeenCalledWith(solarTrackerFilterQuery, solarTrackerStub(), undefined);
            });

            test('then it should return modifiedCount', () => {
                expect(modifiedCount).toEqual(1);
            });
        });
    });

    describe('findInactiveDevices', () => {
        describe('when findInactiveDevices is called with positive cronIntervalInMilliseconds', () => {
            let solarTrackers: SolarTracker[];

            beforeEach(async () => {
                jest.spyOn(solarTrackerModel, 'find');
                solarTrackers = await solarTrackerRepository.findInactiveDevices(1000);
            });

            test('then it should call find on the solarTrackerModel', () => {
                expect(solarTrackerModel.find).toHaveBeenCalledWith({
                    isActive: true,
                    lastUpdate: { $lte: expect.any(Date) }
                }, undefined, undefined);
            });

            test('then it should return SolarTracker[]', () => {
                expect(solarTrackers).toEqual([solarTrackerStub()]);
            });
        });

        describe('when findInactiveDevices is called with negative cronIntervalInMilliseconds', () => {
            let result: Error;
            
            beforeEach(async () => {
                jest.spyOn(solarTrackerModel, 'find');

                try {
                    await solarTrackerRepository.findInactiveDevices(-1000);
                } catch (e) {
                    result = e;
                }
            });

            test('then it should not call find on the solarTrackerModel', () => {
                expect(solarTrackerModel.find).not.toHaveBeenCalled();
            });

            test('then it should throw an error', () => {
                expect(result).toBeInstanceOf(Error);
            });
        });

        describe('when findInactiveDevices is called with empty result', () => {
            let solarTrackers: SolarTracker[];

            beforeEach(async () => {
                jest.spyOn(solarTrackerModel, 'find').mockResolvedValue([]);
                solarTrackers = await solarTrackerRepository.findInactiveDevices(1000);
            });

            test('then it should return empty array', () => {
                expect(solarTrackers).toEqual([]);
            });
        });
    });

    describe('updateSensorsStatus', () => {
        describe('when updateSensorsStatus is called with one sensor inactive', () => {
            beforeEach(async () => {
                jest.spyOn(solarTrackerModel, 'updateOne');
                await solarTrackerRepository.updateSensorsStatus(solarTrackerStub(), solarTrackerReportStub());
            });

            test('then it should call updateOne on the solarTrackerModel', () => {
                expect(solarTrackerModel.updateOne).toHaveBeenCalledWith({
                    _id: solarTrackerStub().id
                }, {
                    $set: {
                        'sensorsStatus.irradianceSensor': false,
                    }
                }, undefined);
            });
        });

        describe('when updateSensorsStatus is called with no sensor inactive', () => {
            beforeEach(async () => {
                let deviceReport = solarTrackerReportStub();
                deviceReport.irradianceSensor.isActive = true;

                jest.spyOn(solarTrackerModel, 'updateOne');
                await solarTrackerRepository.updateSensorsStatus(solarTrackerStub(), deviceReport);
            });

            test('then it should not call updateOne on the solarTrackerModel', () => {
                expect(solarTrackerModel.updateOne).not.toHaveBeenCalled();
            });
        });
    });
});