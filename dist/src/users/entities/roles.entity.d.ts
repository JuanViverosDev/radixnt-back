import { Modules } from './modules.entity';
export declare class Roles {
    id: string;
    roleName: string;
    requestManager: boolean;
    roleModules: Modules[];
    roleState: boolean;
    createdAt: Date;
    updatedAt: Date;
}
