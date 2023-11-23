import { Strategy } from 'passport-firebase-jwt';
import { UtilsService } from 'src/utils/utils.service';
declare const FirebaseAuthStrategy_base: new (...args: any[]) => Strategy;
export declare class FirebaseAuthStrategy extends FirebaseAuthStrategy_base {
    private readonly utilsService;
    private defaultApp;
    constructor(utilsService: UtilsService);
    validate(token: string): Promise<any>;
}
export {};
