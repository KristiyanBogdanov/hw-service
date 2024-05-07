export const TWENTY_FOUR_HOURS_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

export const SOLAR_TRACKER_CRON_INTERVAL = 15; // minutes
export const SOLAR_TRACKER_CRON_PATTERN = `0 */${SOLAR_TRACKER_CRON_INTERVAL} * * * *`;	
export const SOLAR_TRACKER_CRON_INTERVAL_IN_MILLISECONDS = SOLAR_TRACKER_CRON_INTERVAL * 60 * 1000;

export const WEATHER_STATION_CRON_INTERVAL = 15; // minutes
export const WEATHER_STATION_CRON_PATTERN = `0 */${WEATHER_STATION_CRON_INTERVAL} * * * *`;
export const WEATHER_STATION_CRON_INTERVAL_IN_MILLISECONDS = WEATHER_STATION_CRON_INTERVAL * 60 * 1000;

export const SOLAR_TRACKER_AZIMUTH_MIN_ANGLE = 60;
export const SOLAR_TRACKER_AZIMUTH_MAX_ANGLE = 120;
export const SOLAR_TRACKER_ELEVATION_MIN_ANGLE = 45;
export const SOLAR_TRACKER_ELEVATION_MAX_ANGLE = 90;

export const INACTIVE_SOLAR_TRACKER_NOTIFICATION_MESSAGE = (serialNumber: string) => `Solar tracker with serial number ${serialNumber} is not active`;
export const INACTIVE_SOLAR_TRACKER_NOTIFICATION_ADVICE = 'Please check the solar tracker and if necessary, restart it';
export const INACTIVE_WEATHER_STATION_NOTIFICATION_MESSAGE = (serialNumber: string) => `Weather station with serial number ${serialNumber} is not active`;
export const INACTIVE_WEATHER_STATION_NOTIFICATION_ADVICE = 'Please contact the support team';