import { GetSTInsightsReq, GetSTInsightsRes } from '../../dto';

export const getSTInsightsReqStub = (): GetSTInsightsReq => {
    return {
        serialNumbers: ['ST2n19p0ha']
    };
};

export const getSTInsightsResStub = (): GetSTInsightsRes => {
    return {
        data: {
            '65db3e4e4e45c3279695ae12': {
                installationDate: new Date('2024-05-10T00:00:00.000Z'),
                sensorsStatus: {
                    irradianceSensor: true,
                    accelerometer: true,
                    azimuthMotor: true,
                    elevationMotor: true
                },
                capacity: 6,
                isActive: true,
                lastUpdate: new Date('2024-05-15T00:00:00.000Z'),
                coordinates: {
                    latitude: 23.3219,
                    longitude: 42.6977
                },
                currentAzimuth: 120,
                currentElevation: 45,
                azimuthDeviation: 0,
                elevationDeviation: 0,
                last24hAvgIrradiance: [
                    {
                        id: 1,
                        average: 500
                    },
                    {
                        id: 2,
                        average: 600
                    },
                    // ...
                ]
            }
        }
    };
}