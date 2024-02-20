import { Exclude, Expose } from 'class-transformer';
import { DeviceType, Importance } from '../enum';

@Exclude()
export class MobileAppNotificationDto {
    @Expose()
    serialNumber: string;
    
    @Expose()
    deviceType: DeviceType;
    
    @Expose()
    importance: Importance;
    
    @Expose()
    message: string;

    @Expose()
    advice: string;
    
    @Expose()
    timestamp: Date;
}