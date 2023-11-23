"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
const firebaseConfig = {
    apiKey: 'AIzaSyCUW4EY385T6OlzQNIzUOpNJqRlcYL7sos',
    authDomain: 'control-dis.firebaseapp.com',
    projectId: 'control-dis',
    storageBucket: 'control-dis.appspot.com',
    messagingSenderId: '429960129832',
    appId: '1:429960129832:web:16680f5af2437a9efb741d',
};
let AuthService = class AuthService {
    constructor() {
        this.app = (0, app_1.initializeApp)(firebaseConfig, 'control-dis');
        this.auth = (0, auth_1.getAuth)(this.app);
    }
    async createFirebaseUser(user) {
        return (0, auth_1.createUserWithEmailAndPassword)(this.auth, user.email, user.password)
            .then((userCredential) => {
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
    async loginUser(login) {
        return (0, auth_1.signInWithEmailAndPassword)(this.auth, login.email, login.password)
            .then((userCredential) => {
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
    async changePasswordUser(email, infoChange) {
        return (0, auth_1.signInWithEmailAndPassword)(this.auth, email, infoChange.password)
            .then(async (userCredential) => {
            const user = userCredential.user;
            await (0, auth_1.updatePassword)(user, infoChange.newPassword);
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
    processLogin(response) {
        const { data } = response;
        return {
            token: data.accessToken,
            id: data.uid,
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map