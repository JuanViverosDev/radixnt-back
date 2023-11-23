import { Modules } from './modules.entity';
export declare class CategoryModule {
    id: string;
    categoryName: string;
    categoryModule: Modules[];
    categoryOrder: number;
    categoryState: boolean;
    createdAt: Date;
    updatedAt: Date;
}
