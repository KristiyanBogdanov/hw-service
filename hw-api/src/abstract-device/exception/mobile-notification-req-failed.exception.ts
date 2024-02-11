export class MobileNotificationReqFailedException extends Error {
    constructor() {
        super('Failed to send notification to mobile app');
    }
}