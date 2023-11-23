import { ConfigService } from '@nestjs/config';
 
const configService = new ConfigService();

export const firebaseConfig = {
  apiKey: configService.get('APIKEY'),
  authDomain: configService.get('AUTHDOMAIN'),
  projectId: configService.get('PROJECTID'),
  storageBucket: configService.get('STORAGEBUCKET'),
  messagingSenderId: configService.get('MESSAGINGSENDERID'),
  appId: configService.get('APPID'),
};
