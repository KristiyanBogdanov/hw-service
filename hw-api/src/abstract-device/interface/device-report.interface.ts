import { ReportType } from '../enum';

export interface IDeviceReport {
    serialNumber: string;
    reportType: ReportType;
    generalMessage: string;
    timestamp: Date;
}