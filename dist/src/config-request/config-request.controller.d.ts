import { responseDto } from 'src/utils/dto/response.dto';
import { ParamUuidDto } from 'src/utils/dto/uuid.dto';
import { UtilsService } from 'src/utils/utils.service';
import { ConfigRequestService } from './config-request.service';
import { CreateLawyersDto } from './dto/create-lawyers.dto';
import { CreateTypeFileDto } from './dto/create-typefile.dto';
import { UpdateLawyersDto } from './dto/update-lawyers.dto';
import { UpdateTypeFileDto } from './dto/update-typefile.dto';
export declare class ConfigRequestController {
    private readonly configRequestsService;
    private readonly utilsService;
    constructor(configRequestsService: ConfigRequestService, utilsService: UtilsService);
    createTypeFile(createTypeFileDto: CreateTypeFileDto): Promise<void | responseDto>;
    findAllTypeFile(): Promise<void | responseDto>;
    updateTypeFile(param: ParamUuidDto, updateTypeDileDto: UpdateTypeFileDto): Promise<void | responseDto>;
    create(createLawyersDto: CreateLawyersDto): Promise<void | responseDto>;
    findAll(req: any): Promise<void | responseDto>;
    findOne(param: ParamUuidDto): Promise<void | responseDto>;
    update(param: ParamUuidDto, updateLawyerDto: UpdateLawyersDto): Promise<void | responseDto>;
}
