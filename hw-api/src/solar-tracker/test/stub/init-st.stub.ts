import { InitSTReq, InitSTRes } from '../../dto';

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
            latitude: 23.3219,
            longitude: 42.6977
        },
    };
}

export const initSTResStub = (): InitSTRes => {
    return {
        id: '65db3e4e4e45c3279695ae12'
    };
};