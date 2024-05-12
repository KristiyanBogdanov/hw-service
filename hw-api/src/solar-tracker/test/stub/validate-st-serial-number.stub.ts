import { ValidateSTSerialNumberRes } from '../../dto';
import { solarTrackerStub } from './solar-tracker.stub';

export const validateSTSerialNumberResStub = (): ValidateSTSerialNumberRes => {
    return {
        capacity: solarTrackerStub().capacity,
        isValid: true
    };
}