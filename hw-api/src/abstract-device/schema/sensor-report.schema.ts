import { Prop, Schema } from '@nestjs/mongoose';
import { IsBoolean, IsString } from 'class-validator';
import { ISensorReport } from '../interface';

@Schema({ _id: false })
export class SensorReport implements ISensorReport {
    @IsBoolean()
    @Prop({ required: true })
    isActive: boolean;

    @IsString()
    @Prop()
    message?: string;
}