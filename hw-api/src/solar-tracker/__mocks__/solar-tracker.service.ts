import { getSTInsightsResStub, initSTResStub, reportSTStateResStub, saveSTSensorsDataResStub, validateSTSerialNumberResStub } from '../test/stub';

export const SolarTrackerService = jest.fn().mockReturnValue({
    init: jest.fn().mockResolvedValue(initSTResStub()),
    saveSensorsData: jest.fn().mockResolvedValue(saveSTSensorsDataResStub()),
    reportState: jest.fn().mockResolvedValue(reportSTStateResStub()),
    validateSerialNumber: jest.fn().mockResolvedValue(validateSTSerialNumberResStub()),
    getInsights: jest.fn().mockResolvedValue(getSTInsightsResStub())
}); 