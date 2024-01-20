import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MobileAppApi {
    private readonly baseUrl: string;
    private readonly user = 'user';

    constructor(private readonly configService: ConfigService) {
        this.baseUrl = this.configService.get<string>('MOBILE_APP_API_URL');
    }

    private createApiEndpoint(apiPath: string): string {
        return `${this.baseUrl}/${apiPath}`;
    }

    sendHwNotification() {
        return this.createApiEndpoint(`${this.user}/send-hw-notification`);
    }
}