import { Location } from '../schema';
 
export interface IDevice {
    id: string;
    serialNumber: string;
    location: Location;
    installationDate: Date;
    sensorsStatus: Object;
    isActive: boolean;
    lastUpdate: Date;
};