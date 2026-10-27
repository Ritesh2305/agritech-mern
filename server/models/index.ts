import { User } from './User.ts';
import { Farm } from './Farm.ts';
import { Crop } from './Crop.ts';
import { SoilTest } from './SoilTest.ts';
import { Resource } from './Resource.ts';
import { Order } from './Order.ts';
import { Consultation } from './Consultation.ts';
import { ForumPost } from './ForumPost.ts';
import { Alert } from './Alert.ts';
import { ActivityLog } from './ActivityLog.ts';
import { WeatherData } from './WeatherData.ts';
import { isMongoConnected } from '../config/db.ts';

export {
  User,
  User as UserModel,
  Farm,
  Farm as FarmModel,
  Crop,
  Crop as CropModel,
  SoilTest,
  SoilTest as SoilTestModel,
  Resource,
  Resource as ResourceModel,
  Order,
  Order as OrderModel,
  Consultation,
  Consultation as ConsultationModel,
  ForumPost,
  ForumPost as PostModel,
  Alert,
  Alert as AlertModel,
  ActivityLog,
  ActivityLog as ActivityLogModel,
  WeatherData,
  WeatherData as WeatherDataModel,
  isMongoConnected,
};
