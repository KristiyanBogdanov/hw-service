import { SaveSTSensorsDataReq, SaveSTSensorsDataRes } from '../../dto';

export const saveSTSensorsDataReqStub = (): SaveSTSensorsDataReq => {
    return {
        irradiance: 400,
        azimuth: 120,
        elevation: 45,
        azimuthDeviation: 0,
        elevationDeviation: 0,
        timestamp: new Date('2024-05-15T00:00:00.000Z')
    };
}

export const saveSTSensorsDataResStub = (): SaveSTSensorsDataRes => {
    return {
        id: '65db3e4e4e45c3279695ae12'
    };
}