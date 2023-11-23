import { Positions } from './positions.entity';
import { Roles } from './roles.entity';
export declare class Users {
    id: string;
    userName: string;
    userLastName: string;
    userEmail: string;
    fireBaseUUID: string;
    userPosition: Positions;
    userRole: Roles;
    roles: Roles[] | string[];
    userState: boolean;
    createdAt: Date;
    updatedAt: Date;
}
