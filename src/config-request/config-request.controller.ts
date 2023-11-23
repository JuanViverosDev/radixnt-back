import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/auth/auth.guard';
import { responseDto } from 'src/utils/dto/response.dto';
import { ParamUuidDto } from 'src/utils/dto/uuid.dto';
import { UtilsService } from 'src/utils/utils.service';
import { ConfigRequestService } from './config-request.service';
import { CreateLawyersDto } from './dto/create-lawyers.dto';
import { CreateTypeFileDto } from './dto/create-typefile.dto';
import { UpdateLawyersDto } from './dto/update-lawyers.dto';
import { UpdateTypeFileDto } from './dto/update-typefile.dto';

@Controller('configrequest')
export class ConfigRequestController {
  constructor(
    private readonly configRequestsService: ConfigRequestService,
    private readonly utilsService: UtilsService,
  ) {}

  @Post('createtypefile')
  async createTypeFile(@Body() createTypeFileDto: CreateTypeFileDto) {
    const response: responseDto =
      await this.configRequestsService.createTypeFile(createTypeFileDto);
    if (!response.success) return await this.utilsService.handleError(response);
    return response;
  }

  @Get('typefile')
  async findAllTypeFile() {
    const response: responseDto =
      await this.configRequestsService.findAllTypeFile();
    if (!response.success) return await this.utilsService.handleError(response);
    return response;
  }

  @Patch('modifytypefile/:id')
  async updateTypeFile(
    @Param() param: ParamUuidDto,
    @Body() updateTypeDileDto: UpdateTypeFileDto,
  ) {
    const response: responseDto =
      await this.configRequestsService.ModifyTypeFile(
        param.id,
        updateTypeDileDto,
      );
    if (!response.success) return await this.utilsService.handleError(response);
    return response;
  }

  @Post('createlawyers')
  @UseGuards(FirebaseAuthGuard)
  async create(@Body() createLawyersDto: CreateLawyersDto) {
    const response: responseDto = await this.configRequestsService.createLawyer(
      createLawyersDto,
    );
    if (!response.success) return await this.utilsService.handleError(response);
    return response;
  }

  @Get('lawyers')
  // @UseGuards(FirebaseAuthGuard)
  async findAll(@Req() req) {
    const response: responseDto =
      await this.configRequestsService.findAllLawyer();
    if (!response.success) return await this.utilsService.handleError(response);
    return response;
  }

  @Get('lawyer/:id')
  @UseGuards(FirebaseAuthGuard)
  async findOne(@Param() param: ParamUuidDto) {
    const response: responseDto = await this.configRequestsService.getOneLawyer(
      param.id,
    );
    if (!response.success) return await this.utilsService.handleError(response);
    return response;
  }

  @Patch('modifylawyers/:id')
  // @UseGuards(FirebaseAuthGuard)
  async update(
    @Param() param: ParamUuidDto,
    @Body() updateLawyerDto: UpdateLawyersDto,
  ) {
    const response: responseDto = await this.configRequestsService.updateLawyer(
      param.id,
      updateLawyerDto,
    );
    if (!response.success) return await this.utilsService.handleError(response);
    return response;
  }
}
