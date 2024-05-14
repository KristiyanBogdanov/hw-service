import { InitSTReq, InitSTRes } from '../../dto';
import { solarTrackerStub } from './solar-tracker.stub';

export const initSTReqStub = (): InitSTReq => {
    return {
        serialNumber: 'ST2n19p0ha',
        sensorsStatus: {
            irradianceSensor: true,
            accelerometer: true,
            azimuthMotor: true,
            elevationMotor: true
        },
        capacity: 6,
        installationDate: new Date('2024-05-10T00:00:00.000Z'),
        coordinates: {
            longitude: 42.6977,
            latitude: 23.3219
        },
    };
}

export const initSTResStub = (): InitSTRes => {
    return {
        id: solarTrackerStub().id,
    };
};