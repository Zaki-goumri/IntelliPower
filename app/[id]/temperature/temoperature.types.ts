export interface TemperatureReading {
  id: string;
  sensorId: string;
  temp: number;
  humidity: number;
  createdAt: string;
}

export interface DayData {
  key: string;
  average: number;
  content: TemperatureReading[];
}

export interface HistoryData {
  actualRes: DayData[];
}

export interface Stats {
  avg: number;
  min: number;
  max: number;
}