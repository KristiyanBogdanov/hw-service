import { Exclude, Expose } from 'class-transformer';
import { DeviceType, Importance, NotificationType,  } from '../enum';

@Exclude()
export class MobileAppNotificationDto {
    @Expose()
    notificationType: NotificationType;

    @Expose()
    serialNumber: string;
    
    @Expose()
    deviceType: DeviceType;
    
    @Expose()
    importance: Importance;
    
    @Expose()
    message: string;
    
    @Expose()
    timestamp: Date;
}