import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MobileAppApi {
    private readonly baseUrl: string;
    private readonly user = 'users';

    constructor(private readonly configService: ConfigService) {
        this.baseUrl = this.configService.get<string>('MOBILE_APP_API_URL');
    }

    private createApiEndpoint(apiPath: string): string {
        return `${this.baseUrl}/${apiPath}`;
    }

    sendInactiveDeviceNotification() {
        return this.createApiEndpoint(`${this.user}/hw-notifications/inactive-devices`);
    }

    sendDeviceStateReportNotification() {
        return this.createApiEndpoint(`${this.user}/hw-notifications/device-state-reports`);
    }
}