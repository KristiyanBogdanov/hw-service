import { MockModel } from '../../../database/test/support';
import { SolarTracker } from '../../schema';
import { solarTrackerStub } from '../stub';

export class SolarTrackerModel extends MockModel<SolarTracker> {
    protected entityStub = solarTrackerStub();
}