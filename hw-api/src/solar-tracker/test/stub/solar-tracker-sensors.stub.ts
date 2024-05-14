import { SolarTrackerSensors } from '../../schema';

export const solarTrackerSensorsStub = (): SolarTrackerSensors => {
    return {
        id: '93qb2e0e1e41d3279635ae76',
        deviceId: '65db3e4e4e45c3279695ae12',  
        irradiance: 400,
        azimuth: 120,
        elevation: 45,
        azimuthDeviation: 0,
        elevationDeviation: 0,
        timestamp: new Date('2024-05-12T00:00:00.000Z')
    };
}

export const solarTrackerSensorsDocumentStub = () => {
    return {
        ...solarTrackerSensorsStub(),
        save: jest.fn(),
    };
}