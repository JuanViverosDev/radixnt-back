import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateLawyersDto } from './dto/create-lawyers.dto';
import { CreateTypeFileDto } from './dto/create-typefile.dto';
import { UpdateLawyersDto } from './dto/update-lawyers.dto';
import { UpdateTypeFileDto } from './dto/update-typefile.dto';
import { Lawyers } from './entities/lawyers.entity';
import { TypeFile } from './entities/typeFile.entity';

@Injectable()
export class ConfigRequestService {
    constructor(
        @InjectRepository(TypeFile)
        private readonly repositoryTypeFile: Repository<TypeFile>,
        @InjectRepository(Lawyers)
        private readonly repositoryLawyers: Repository<Lawyers>,
      ) {}

    async createTypeFile(createTypeDto: CreateTypeFileDto) {
        try {
          const saveTypeTypeFile = await this.repositoryTypeFile.save(
            createTypeDto,
          );
          return {
            success: true,
            data: plainToInstance(TypeFile, saveTypeTypeFile),
          };
        } catch (error) {
          return {
            success: false,
            message: error.message,
          };
        }
      }
    
      async findAllTypeFile() {
        try {
          const listTypeTypeFile = await this.repositoryTypeFile.find();
          return {
            success: true,
            data: plainToInstance(TypeFile, listTypeTypeFile),
          };
        } catch (error) {
          return {
            success: false,
            message: error.message,
          };
        }
      }
    
      async ModifyTypeFile(id: string, updateTypeFileDto: UpdateTypeFileDto) {
        try {
          const currentTypeTypeFile = await this.repositoryTypeFile.findOne({
            where: { id: id },
          });
          if (!currentTypeTypeFile) {
            return {
              success: false,
              code: 'CD002',
            };
          }
    
          if (updateTypeFileDto.typeFileName)
            currentTypeTypeFile.typeFileName = updateTypeFileDto.typeFileName;
          currentTypeTypeFile.typeFileState = updateTypeFileDto.typeFileState;
    
          const modifyPotition = await this.repositoryTypeFile.save(
            currentTypeTypeFile,
          );
          return {
            success: true,
            data: plainToInstance(TypeFile, modifyPotition),
          };
        } catch (error) {
          return {
            success: false,
            message: error.message,
          };
        }
      }

      async createLawyer(createLawyerDto: CreateLawyersDto) {
        try {        
          const saveLawyer = await this.repositoryLawyers.save(
            createLawyerDto,
          );
          return {
            success: true,
            data: plainToInstance(Lawyers, saveLawyer),
          };
        } catch (error) {
          return {
            success: false,
            message: error.message,
          };
        }
      }
    
      async findAllLawyer() {
        try {
          const listLawyer = await this.repositoryLawyers.find();
          return {
            success: true,
            data: listLawyer,
          };
        } catch (error) {
          return {
            success: false,
            message: error.message,
          };
        }
      }
    
      async getOneLawyer(id: string) {
        try {
          const requestHeader = await this.repositoryLawyers.findOne({
            where: { id: id },
          });
          return {
            success: true,
            data: plainToInstance(Lawyers, requestHeader),
          };
        } catch (error) {
          return {
            success: false,
            message: error.message,
          };
        }
      }
    
      async updateLawyer(id: string, updateLawyerDto: UpdateLawyersDto) {
        try {
          const currentLawyer = await this.repositoryLawyers.findOne({
            where: { id: id },
          });
    
          if (!currentLawyer) {
            return {
              success: false,
              code: 'CD002',
            };
          }
    
          if(updateLawyerDto.publicDefenderName)
            currentLawyer.publicDefenderName = updateLawyerDto.publicDefenderName;
          if(updateLawyerDto.publicDefenderPhone)
            currentLawyer.publicDefenderPhone = updateLawyerDto.publicDefenderPhone;
          if(updateLawyerDto.publicDefenderAddress)
            currentLawyer.publicDefenderAddress = updateLawyerDto.publicDefenderAddress;
          if(updateLawyerDto.publicDefenderEmail)
            currentLawyer.publicDefenderEmail = updateLawyerDto.publicDefenderEmail;
          if(updateLawyerDto.publicDefenderCompany)
            currentLawyer.publicDefenderCompany = updateLawyerDto.publicDefenderCompany;
          if(updateLawyerDto.publicDefenderStartDate)
            currentLawyer.publicDefenderStartDate = updateLawyerDto.publicDefenderStartDate;
          if(updateLawyerDto.publicDefenderEndDate)
            currentLawyer.publicDefenderEndDate = updateLawyerDto.publicDefenderEndDate;
          if(updateLawyerDto.howManyProceedingsNumber)
            currentLawyer.howManyProceedingsNumber = updateLawyerDto.howManyProceedingsNumber;
          if(updateLawyerDto.proceedingsNumbers)
            currentLawyer.proceedingsNumbers = updateLawyerDto.proceedingsNumbers;
          if(updateLawyerDto.publicDefenderState !== null && updateLawyerDto.publicDefenderState !== undefined )
            currentLawyer.publicDefenderState = updateLawyerDto.publicDefenderState;
          if (updateLawyerDto.medioAComunicar)
            currentLawyer.medioAComunicar = updateLawyerDto.medioAComunicar;
          if (updateLawyerDto.publicDefenderId)
            currentLawyer.publicDefenderId = updateLawyerDto.publicDefenderId;
          
          const modifyLawyer = await this.repositoryLawyers.save(
            currentLawyer,
          );
          return {
            success: true,
            data: modifyLawyer,
          };
        } catch (error) {
          return {
            success: false,
            message: error.message,
          };
        }
      }
}
