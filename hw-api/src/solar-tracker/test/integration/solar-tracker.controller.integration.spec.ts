import { Test } from '@nestjs/testing';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import mongoose, { Connection } from 'mongoose';
import * as request from 'supertest';
import { MongoErrorFilter } from '../../../shared/filter';
import { AppModule } from '../../../app.module';
import { DatabaseService } from '../../../database/database.service';
import { initSTReqStub, reportSTStateReqStub, saveSTSensorsDataReqStub, validateSTSerialNumberResStub } from '../stub';
import { InitSTRes } from '../../dto';
import { SolarTrackerService } from '../../solar-tracker.service';

describe('SolarTrackerController (e2e)', () => {
    let app: any;
    let dbConnection: Connection;
    let httpServer: any;

    beforeAll(async () => {
        const modulRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        const solarTrackerService = modulRef.get<SolarTrackerService>(SolarTrackerService);
        jest.spyOn(solarTrackerService, 'sendHwNotificationToMobileApp').mockResolvedValue(undefined);

        app = modulRef.createNestApplication();

        app.useGlobalFilters(new MongoErrorFilter());
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

        await app.init();

        dbConnection = modulRef.get<DatabaseService>(DatabaseService).getConnection();
        httpServer = app.getHttpServer();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('init', () => {
        afterEach(async () => {
            await dbConnection.collection('solarTrackers').deleteMany({});
        });

        it('should return 201 status code when solar tracker is successfully created', async () => {
            const response = await request(httpServer).post('/solar-trackers/').send(initSTReqStub());
            const solarTrackerOid = new mongoose.Types.ObjectId(response.body.id);

            expect(response.status).toBe(HttpStatus.CREATED);
            expect(response.body).toHaveProperty('id');

            const solarTracker = await dbConnection.collection('solarTrackers').findOne({ _id: solarTrackerOid });
            expect(solarTracker).not.toBeNull();
        });

        it('should return 409 status code when solar tracker with the same serial number already exists', async () => {
            await request(httpServer).post('/solar-trackers/').send(initSTReqStub());
            const response = await request(httpServer).post('/solar-trackers/').send(initSTReqStub());

            expect(response.status).toBe(HttpStatus.CONFLICT);
        });

        it('should return 400 status code when solar tracker data is invalid', async () => {
            const response = await request(httpServer).post('/solar-trackers/').send({});
            expect(response.status).toBe(HttpStatus.BAD_REQUEST);

            const solarTracker = await dbConnection.collection('solarTrackers').findOne({ serialNumber: initSTReqStub().serialNumber });
            expect(solarTracker).toBeNull();
        });
    });

    describe('saveSensorsData', () => {
        let solarTracker: InitSTRes;

        beforeAll(async () => {
            const response = await request(httpServer).post('/solar-trackers/').send(initSTReqStub());
            solarTracker = response.body;
        });

        afterEach(async () => {
            await dbConnection.collection('solarTrackersSensors').deleteMany({});
        });

        afterAll(async () => {
            await dbConnection.collection('solarTrackers').deleteMany({});
        });

        it('should return 201 status code when sensors data is successfully saved', async () => {
            const sensorsDataResponse = await request(httpServer)
                .post(`/solar-trackers/${solarTracker.id}/sensors-data`)
                .send(saveSTSensorsDataReqStub());
            const sensorsDataOid = new mongoose.Types.ObjectId(sensorsDataResponse.body.id);

            expect(sensorsDataResponse.status).toBe(HttpStatus.CREATED);
            expect(sensorsDataResponse.body).toHaveProperty('id');

            const sensorsData = await dbConnection.collection('solarTrackersSensors').findOne({ _id: sensorsDataOid });
            expect(sensorsData).not.toBeNull();
        });

        it('should return 404 status code when solar tracker is not found', async () => {
            const nonExistingSolarTrackerId = new mongoose.Types.ObjectId().toHexString();

            const response = await request(httpServer)
                .post(`/solar-trackers/${nonExistingSolarTrackerId}/sensors-data`)
                .send(saveSTSensorsDataReqStub());

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });

        it('should return 400 status code when sensors data is invalid', async () => {
            const response = await request(httpServer)
                .post(`/solar-trackers/${solarTracker.id}/sensors-data`)
                .send({});

            expect(response.status).toBe(HttpStatus.BAD_REQUEST);

            const sensorsData = await dbConnection.collection('solarTrackersSensors').findOne({ deviceId: solarTracker.id });
            expect(sensorsData).toBeNull();
        });
    });

    describe('reportState', () => {
        let solarTracker: InitSTRes;

        beforeAll(async () => {
            const response = await request(httpServer).post('/solar-trackers/').send(initSTReqStub());
            solarTracker = response.body;
        });

        afterEach(async () => {
            await dbConnection.collection('solarTrackersReports').deleteMany({});
        });

        afterAll(async () => {
            await dbConnection.collection('solarTrackers').deleteMany({});
        });

        it('should return 201 status code when report is successfully saved', async () => {
            const reportResponse = await request(httpServer)
                .post(`/solar-trackers/${solarTracker.id}/reports`)
                .send(reportSTStateReqStub());
            const reportOid = new mongoose.Types.ObjectId(reportResponse.body.id);

            expect(reportResponse.status).toBe(HttpStatus.CREATED);
            expect(reportResponse.body).toHaveProperty('id');

            const report = await dbConnection.collection('solarTrackersReports').findOne({ _id: reportOid });
            expect(report).not.toBeNull();
        });

        it('should return 404 status code when solar tracker is not found', async () => {
            const nonExistingSolarTrackerId = new mongoose.Types.ObjectId().toHexString();

            const response = await request(httpServer)
                .post(`/solar-trackers/${nonExistingSolarTrackerId}/reports`)
                .send(reportSTStateReqStub());

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });

        it('should return 400 status code when report is invalid', async () => {
            const response = await request(httpServer)
                .post(`/solar-trackers/${solarTracker.id}/reports`)
                .send({});

            expect(response.status).toBe(HttpStatus.BAD_REQUEST);

            const report = await dbConnection.collection('solarTrackersReports').findOne({ deviceId: solarTracker.id });
            expect(report).toBeNull();
        });
    });

    describe('validateSerialNumber', () => {
        beforeAll(async () => {
            await request(httpServer).post('/solar-trackers/').send(initSTReqStub());
        });

        afterAll(async () => {
            await dbConnection.collection('solarTrackers').deleteMany({});
        });

        it('should return 200 status code and isValid set to true when serial number is valid', async () => {
            const response = await request(httpServer).get(`/solar-trackers/validate/${initSTReqStub().serialNumber}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toEqual(validateSTSerialNumberResStub());
        });

        it('should return 200 status code and isValid set to false when serial number is invalid', async () => {
            const response = await request(httpServer).get('/solar-trackers/validate/invalidSerialNumber');

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toEqual({ isValid: false });
        });
    });
});