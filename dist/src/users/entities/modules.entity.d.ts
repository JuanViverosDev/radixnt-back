import { Roles } from './roles.entity';
import { CategoryModule } from './catModules.entity';
export declare class Modules {
    id: string;
    moduleName: string;
    moduleComponent: string;
    moduleUrl: string;
    moduleIcon: string;
    moduleRole: Roles[];
    moduleCategory: CategoryModule;
    moduleOrder: number;
    moduleState: boolean;
    permission: string;
    createdAt: Date;
    updatedAt: Date;
}
