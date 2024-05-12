import { SolarTrackerReport } from '../../schema';
import { reportSTStateReqStub } from './report-st-state.stub';

export const solarTrackerReportStub = (): SolarTrackerReport => ({
    id: '84ag2e4e4o91g4219293ae14',
    deviceId: '65db3e4e4e45c3279695ae12',
    importance: reportSTStateReqStub().importance,
    generalMessage: reportSTStateReqStub().generalMessage,
    advice: reportSTStateReqStub().advice,
    timestamp: reportSTStateReqStub().timestamp,
    irradianceSensor: reportSTStateReqStub().irradianceSensor,
    accelerometer: reportSTStateReqStub().accelerometer,
    azimuthMotor: reportSTStateReqStub().azimuthMotor,
    elevationMotor: reportSTStateReqStub().elevationMotor,
});