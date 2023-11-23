import { Injectable } from '@nestjs/common';
import { UserFireBaseDto } from './dto/create-user-firebase.dto';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword,
} from 'firebase/auth';
// import { firebaseConfig } from '../database/firebase.config';
import { ChangePasswordDto } from './dto/change-pass-firebase.dto';

const firebaseConfig = {
  apiKey: 'AIzaSyCUW4EY385T6OlzQNIzUOpNJqRlcYL7sos',
  authDomain: 'control-dis.firebaseapp.com',
  projectId: 'control-dis',
  storageBucket: 'control-dis.appspot.com',
  messagingSenderId: '429960129832',
  appId: '1:429960129832:web:16680f5af2437a9efb741d',
};

//const app = initializeApp(firebaseConfig, 'control-dis');

@Injectable()
export class AuthService {
  constructor() {}

  private app = initializeApp(firebaseConfig, 'control-dis');
  private auth = getAuth(this.app);

  async createFirebaseUser(user: UserFireBaseDto) {
    return createUserWithEmailAndPassword(this.auth, user.email, user.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        return {
          success: true,
          data: user,
        };
        // ...
      })
      .catch((error) => {
        return {
          success: false,
          code: error.code,
          message: error.message,
        };
        // ..
      });
  }

  async loginUser(login: UserFireBaseDto) {
    return signInWithEmailAndPassword(this.auth, login.email, login.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        return {
          success: true,
          data: user,
        };
      })
      .catch((error) => {
        return {
          success: false,
          code: error.code,
          message: error.message,
        };
      });
  }

  async changePasswordUser(email: string, infoChange: ChangePasswordDto) {
    return signInWithEmailAndPassword(this.auth, email, infoChange.password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        await updatePassword(user, infoChange.newPassword);
        return {
          success: true,
        };
      })
      .catch((error) => {
        return {
          success: false,
          code: error.code,
          message: error.message,
        };
      });
  }

  processLogin(response: any) {
    const { data } = response;
    return {
      token: data.accessToken,
      id: data.uid,
    };
  }
}
