import { Roles } from '../../users/entities/roles.entity';
export declare class RequestState {
    id: number;
    stateName: string;
    stageName?: string;
    faseName?: string;
    days?: number;
    isBusinessDays?: boolean;
    previousDays?: number;
    alertRoles: Roles[];
}
