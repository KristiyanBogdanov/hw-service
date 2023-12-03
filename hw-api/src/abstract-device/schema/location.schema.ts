import { Prop, Schema } from '@nestjs/mongoose';
import { ILocation } from '../interface';

@Schema({ _id: false })
export class Location implements ILocation {
    @Prop({ required: true })
    type: string;

    // TODO: test with one number, with two numbers - [number, number]
    @Prop({ required: true })   
    coordinates: [number, number];
}