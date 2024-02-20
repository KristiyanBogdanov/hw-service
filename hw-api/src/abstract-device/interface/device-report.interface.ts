import { Importance } from '../enum';

export interface IDeviceReport {
    deviceId: string;
    importance: Importance;
    generalMessage: string;
    advice: string;
    timestamp: Date;
}