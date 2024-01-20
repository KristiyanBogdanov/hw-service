import { Importance } from '../enum';

export interface IDeviceReport {
    serialNumber: string;
    importance: Importance;
    generalMessage: string;
    timestamp: Date;
}