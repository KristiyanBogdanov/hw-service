import { GetSTInsightsReq, GetSTInsightsRes } from '../../dto';
import { solarTrackerStub } from './solar-tracker.stub';

export const getSTInsightsReqStub = (): GetSTInsightsReq => {
    return {
        serialNumbers: [solarTrackerStub().serialNumber]
    };
};

export const getSTInsightsResStub = (): GetSTInsightsRes => {
    const id = solarTrackerStub().id;

    return {
        data: {
            id: {
                installationDate: solarTrackerStub().installationDate,
                sensorsStatus: solarTrackerStub().sensorsStatus,
                capacity: solarTrackerStub().capacity,
                isActive: solarTrackerStub().isActive,
                lastUpdate: solarTrackerStub().lastUpdate,
                coordinates: {
                    latitude: solarTrackerStub().location.coordinates[0],
                    longitude: solarTrackerStub().location.coordinates[1]
                },
                currentAzimuth: 120,
                currentElevation: 45,
                azimuthDeviation: 0,
                elevationDeviation: 0,
                last24hAvgIrradiance: [
                    {
                        id: 1,
                        average: 500
                    },
                    {
                        id: 2,
                        average: 600
                    },
                    // ...
                ]
            }
        }
    };
}