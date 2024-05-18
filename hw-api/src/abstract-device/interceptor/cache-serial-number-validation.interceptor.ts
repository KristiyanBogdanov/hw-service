import { NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { firstValueFrom, Observable, of } from 'rxjs';
import { Cache } from 'cache-manager';
import { SERIAL_NUMBER_VALIDATION_CACHE_TTL } from '../../shared/constants';

export class CacheSerialNumberValidationInterceptor<T> implements NestInterceptor {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheService: Cache) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<T>> {
        const request = context.switchToHttp().getRequest();
        const serialNumber = request.params.serialNumber;
        const cacheKey = `serialNumberValidation:${serialNumber}`;

        const cachedResponse = await this.cacheService.get<T>(cacheKey);

        if (cachedResponse) {
            return of(cachedResponse);
        }

        const response = await firstValueFrom<T>(next.handle());
        await this.cacheService.set(cacheKey, response, SERIAL_NUMBER_VALIDATION_CACHE_TTL);

        return of(response);
    }
}