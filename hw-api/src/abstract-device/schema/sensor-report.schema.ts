import { Prop, Schema } from '@nestjs/mongoose';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ISensorReport } from '../interface';

@Schema({ _id: false })
export class SensorReport implements ISensorReport {
    @IsBoolean()
    @Prop({ required: true })
    isActive: boolean;

    @IsString()
    @IsNotEmpty()
    @Prop({ required: true })
    message: string;
}