import { Prop, Schema } from '@nestjs/mongoose';
import { ILocation } from '../interface';

@Schema({ _id: false })
export class Location implements ILocation {
    @Prop({ 
        required: true,
        enum: ['Point']
    })
    type: string;

    @Prop({
        required: true,
        type: [Number],
        validate: {
            validator: (value: [number, number]) => {
                return value.length === 2;
            },
            message: 'Coordinates must be an array of two numbers'
        }
    })
    coordinates: [number, number];
}