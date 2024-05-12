import { SolarTracker } from '../../schema';

export const solarTrackerStub = (): SolarTracker => {
    return {
        id: '65db3e4e4e45c3279695ae12',
        serialNumber: 'ST2n19p0ha',
        location: {
            type: 'Point',
            coordinates: [23.3219, 42.6977],
        },
        installationDate: new Date('2024-05-10T00:00:00.000Z'),
        isActive: true,
        capacity: 6,
        sensorsStatus: {
            irradianceSensor: true,
            accelerometer: true,
            azimuthMotor: true,
            elevationMotor: true,
        },
        lastUpdate: new Date('2024-05-15T00:00:00.000Z'),
    };
}