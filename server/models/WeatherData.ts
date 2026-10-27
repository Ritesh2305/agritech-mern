import mongoose, { Document, Schema } from 'mongoose';

export interface IWeatherData extends Document {
  location: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  condition: string;
  uvIndex: number;
  advisory: string;
  forecast: {
    day: string;
    date: string;
    tempMax: number;
    tempMin: number;
    rainfallChance: number;
    condition: string;
    advisory: string;
  }[];
  date: Date;
}

const WeatherDataSchema = new Schema<IWeatherData>(
  {
    location: { type: String, required: true, index: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    rainfall: { type: Number, default: 0 },
    windSpeed: { type: Number, required: true },
    condition: { type: String, default: 'Clear' },
    uvIndex: { type: Number, default: 6 },
    advisory: { type: String, default: 'Ideal conditions for crop growth and standard irrigation.' },
    forecast: [
      {
        day: { type: String, required: true },
        date: { type: String, required: true },
        tempMax: { type: Number, required: true },
        tempMin: { type: Number, required: true },
        rainfallChance: { type: Number, default: 0 },
        condition: { type: String, default: 'Sunny' },
        advisory: { type: String, default: '' },
      },
    ],
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const WeatherData = mongoose.models.WeatherData || mongoose.model<IWeatherData>('WeatherData', WeatherDataSchema);
