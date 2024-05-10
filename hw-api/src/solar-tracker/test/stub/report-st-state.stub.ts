import { Importance } from '../../../abstract-device/enum';
import { ReportSTStateReq, ReportSTStateRes } from '../../dto';

export const reportSTStateReqStub = (): ReportSTStateReq => {
    return {
        irradianceSensor: {
            isActive: false,
            message: 'Irradiance sensor is blocked'
        },
        accelerometer: null,
        azimuthMotor: null,
        elevationMotor: null,
        importance: Importance.Critical,
        generalMessage: 'Critical error in the system detected',
        advice: 'Please check the system',
        timestamp: new Date('2024-05-16T00:00:00.000Z')
    };
}

export const reportSTStateResStub = (): ReportSTStateRes => {
    return {
        id: '65db3e4e4e45c3279695ae12'
    };
}