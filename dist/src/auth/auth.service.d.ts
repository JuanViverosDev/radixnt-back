import { UserFireBaseDto } from './dto/create-user-firebase.dto';
import { ChangePasswordDto } from './dto/change-pass-firebase.dto';
export declare class AuthService {
    constructor();
    private app;
    private auth;
    createFirebaseUser(user: UserFireBaseDto): Promise<{
        success: boolean;
        data: import("@firebase/auth").User;
    } | {
        success: boolean;
        code: any;
        message: any;
    }>;
    loginUser(login: UserFireBaseDto): Promise<{
        success: boolean;
        data: import("@firebase/auth").User;
    } | {
        success: boolean;
        code: any;
        message: any;
    }>;
    changePasswordUser(email: string, infoChange: ChangePasswordDto): Promise<{
        success: boolean;
    } | {
        success: boolean;
        code: any;
        message: any;
    }>;
    processLogin(response: any): {
        token: any;
        id: any;
    };
}
