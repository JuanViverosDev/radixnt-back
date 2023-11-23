import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { responseDto } from 'src/utils/dto/response.dto';
import {
  Any,
  getMetadataArgsStorage,
  IsNull,
  Like,
  Not,
  Repository,
} from 'typeorm';
import { CreateProcessStateDto } from './dto/create-processState.dto';
import { CreateRequestDto } from './dto/create-request.dto';
import { CreateCommunicationDto } from './dto/create-typecommunication.dto';
import { CreateTypeReqDto } from './dto/create-typereq.dto';
import { UpdateProcessStateDto } from './dto/update-processState.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { UpdateCommunicationDto } from './dto/update-typecommunication.dto';
import { UpdateTypeReqDto } from './dto/update-typereq.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { ProcessState } from './entities/processState.entity';
import { RequestHeader } from './entities/request.entity';
import { RequestDisciplined } from './entities/requestDisciplined.entity';
import { TypeCommunication } from './entities/typeCommunication.entity';
import { TypeRequest } from './entities/typeRequest.entity';
import { Documents } from './entities/document.entity';
import { RequestObservations } from './entities/requestObservations.entity';
import { RequestStage } from './entities/requestStage.entity';
import { UsersService } from 'src/users/users.service';
import { RequestState } from './entities/requestState.entity';
import { Attachment } from 'src/attachments/entities/attachment.entity';
import { Template } from './entities/template.entity';
import { ObservationsService } from './observations.service';
import { Config } from './entities/config.entity';
import { SearchDocumentDto } from './dto/search-document.dto';
import { SetGlobalConfigDto } from './dto/set-global-config.dto';
import { ModifyExpireDateDto } from './dto/modify-expire-date.dto';
import { PaginateDto } from './dto/paginate.dto';
import { PDFDocument, PDFImage, StandardFonts } from 'pdf-lib';
import { Folio } from './entities/folio.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment';
import * as handlebars from 'handlebars';
import { NotifyDisciplinedDto } from './dto/notifyDisciplined.dto';
import { HttpService } from '@nestjs/axios';
import { NotifyOrCommunicateDto } from './dto/notify-or-communicate.dto';
import { Lawyers } from 'src/config-request/entities/lawyers.entity';
import { AttachVoucherDto } from './dto/attach-voucher.dto';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(RequestHeader)
    private readonly repositoryRequestHeader: Repository<RequestHeader>,
    @InjectRepository(TypeRequest)
    private readonly repositoryTypeRequest: Repository<TypeRequest>,
    @InjectRepository(ProcessState)
    private readonly repositoryProcessState: Repository<ProcessState>,
    @InjectRepository(TypeCommunication)
    private readonly repositoryTypeCommunication: Repository<TypeCommunication>,
    @InjectRepository(RequestDisciplined)
    private readonly repositoryRequestDisciplined: Repository<RequestDisciplined>,
    @InjectRepository(Documents)
    private readonly repositoryDocuments: Repository<Documents>,
    @InjectRepository(RequestObservations)
    private readonly repositoryRequestObservations: Repository<RequestObservations>,
    @InjectRepository(RequestStage)
    private readonly repositoryRequestStage: Repository<RequestStage>,
    @InjectRepository(RequestState)
    private readonly repositoryRequestState: Repository<RequestState>,
    private readonly usersService: UsersService,
    @InjectRepository(Attachment)
    private readonly repositoryAttachment: Repository<Attachment>,
    @InjectRepository(Template)
    private readonly repositoryTemplate: Repository<Template>,
    @InjectRepository(Config)
    private readonly repositoryConfig: Repository<Config>,
    @InjectRepository(Folio)
    private readonly repositoryFolio: Repository<Folio>,
    private readonly observationsService: ObservationsService,
    private readonly notificationsService: NotificationsService,
    private readonly httpService: HttpService,
  ) {}

  async create(createRequestDto: CreateRequestDto) {
    try {
      const initialStage = await this.repositoryRequestStage.findOne({
        where: { id: 1 },
      });

      let initialArray = [];
      initialArray.push(initialStage);
      createRequestDto.requestStages = initialArray;
      let newState = await this.repositoryRequestState.findOne({
        where: { id: 2 },
      });
      createRequestDto.requestState = newState;

      const userAssing = await this.usersService.getUserByRoleName(
        'Director de Instruccion',
      );
      const userEmail = userAssing.data.userEmail;
      //if(!userAssing.success) return await this.utilsService.handleError({ success: false, code: 'CD002' });
      createRequestDto.agentSelected = userAssing.data;
      createRequestDto.expediente = '0';

      const now = new Date();
      now.setMonth(now.getMonth() + 1, now.getDay());
      createRequestDto.expireDate = now;

      const saveRequest = await this.repositoryRequestHeader.save({
       ... createRequestDto,
       enabled: true,
      });

      await this.createInitialDocumentsV2(saveRequest);

      //Guarda Log de creación de request
      await this.observationsService.logObservationOrSystemLog(
        saveRequest.id,
        'Se creó la petición',
        null,
        'system',
      );

      createRequestDto.attachments?.forEach(async (attachment) => {
        await this.repositoryAttachment.save({
          ...attachment,
          requestHeader: saveRequest,
        });
      });

      if (createRequestDto.requestObservations.length > 0) {
        await this.observationsService.logObservationOrSystemLog(
          saveRequest.id,
          createRequestDto.requestObservations[0].content,
          createRequestDto.userId,
          'user',
        );
      }

      if (
        createRequestDto.documentalTypeSelected === 'Oficio' ||
        createRequestDto.documentalTypeSelected === 'Memorando'
      ) {
        await this.handleOficioOrMemorando(saveRequest);
      }
      //Envío correo al director de instrucción
      try {
        await this.notificationsService.sendEmail({
          recipient: userEmail,
          templateName: 'assignationTemplate',
          data: {
            nombre:
              '' +
              userAssing.data.userName +
              ' ' +
              userAssing.data.userLastName,
            nombreQuejoso: createRequestDto.nombreSolicitante,
          },
        });

        await this.observationsService.logObservationOrSystemLog(
          saveRequest.id,
          `Se envia email a ${userEmail}`,
          null,
          'system',
        );
      } catch (error) {
        console.log('Error enviando correo');
      }

      return {
        success: true,
        data: plainToInstance(RequestHeader, saveRequest),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async createInitialDocumentsV2(request: RequestHeader) {
    const globalConfig = (await this.getGlobalConfig()).data;
    let documents = await Promise.all(
      (
        await this.repositoryTemplate.find({
          relations: ['requestStage'],
          where: {
            requestStage: {
              id: 1,
            },
          },
        })
      ).map(async (template: Template) => {
        // const {consecutive, prefix} = await this.getConsecutiveAndPrefix(template);
        const templateContent = handlebars.compile(template.templateContent);
        const html = templateContent({ request, template, globalConfig });
        return {
          requestId: request.id,
          content: html ?? template.templateContent,
          stage: template.requestStage,
          order: template.order,
          title: template.templateName,
          state: 'Por completar',
          documentType: template.documentType,
          consecutive: null,
          prefix: null,
          seNotificaDisciplinado: template.seNotificaDisciplinado,
          seNotificaQuejoso: template.seNotificaQuejoso,
          seComunicaDisciplinado: template.seComunicaDisciplinado,
          seComunicaQuejoso: template.seComunicaQuejoso,
          fechaNotificacionQuejoso: template.fechaNotificacionQuejoso,
          fechaComunicacionQuejoso: template.fechaComunicacionQuejoso,
          fechaComunicacionDisciplinado: template.fechaComunicacionDisciplinado,
          fechaNotificacionDisciplinado: template.fechaNotificacionDisciplinado,
        } as Documents;
      }),
    );
    await this.repositoryDocuments.save(documents);
  }

  async findAll() {
    try {
      const listRequestHeader = await this.repositoryRequestHeader.find({
        relations: [
          'agentSelected',
          'requestState',
          'requestObservations',
          'requestObservations.userCreated',
          'requestStages',
          'attachments',
          'disciplined',
          'disciplined.requestHeader',
          'disciplined.lawyer',
          'requestState.alertRoles',
        ],
        where: { id: Not(IsNull()) },
      });
      return {
        success: true,
        data: plainToInstance(RequestHeader, listRequestHeader),
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async findRequestByUser(id: string) {
    try {
      const requestHeader = await this.repositoryRequestHeader.find({
        relations: [
          'agentSelected',
          'requestState',
          'requestObservations',
          'requestObservations.userCreated',
          'requestStages',
          'attachments',
          'disciplined',
          'disciplined.lawyer',
          'disciplined.requestHeader',
        ],
        where: { agentSelected: { id } },
      });
      requestHeader.forEach((req: RequestHeader) => {
        if (req.complianceFacts) {
          const { complianceFacts: date } = req;
          req.complianceFacts = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDay(),
          );
        }
      });
      return {
        success: true,
        data: plainToInstance(RequestHeader, requestHeader),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async findOne(id: string) {
    try {
      const requestHeader = await this.repositoryRequestHeader.findOne({
        relations: [
          'agentSelected',
          'requestState',
          'requestObservations',
          'requestObservations.userCreated',
          'requestStages',
          'attachments',
          'disciplined',
        ],
        where: { id: id },
      });
      return {
        success: true,
        data: plainToInstance(RequestHeader, requestHeader),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async update(id: string, updateRequestDto: UpdateRequestDto) {
    try {
      let notify = false;
      let currentRequest: RequestHeader = (await this.findOne(id)).data;

      if (!currentRequest) {
        return {
          success: false,
          code: 'CD002',
        };
      }

      console.log(updateRequestDto.requestStateId)
      if (updateRequestDto.requestStateId) {
        currentRequest.requestState = await this.repositoryRequestState.findOne({
          where: { id: updateRequestDto.requestStateId },
        });
        console.log(currentRequest.requestState)
      }

      //Calcula el RequestState y los cambios relacionados.
      await this.calculateActualRequestState(
        updateRequestDto,
        currentRequest.requestState?.id ?? 2,
        currentRequest.agentSelected.id,
        id,
      );

      currentRequest = (await this.findOne(id)).data;

      if (updateRequestDto.radicado) {
        currentRequest.radicado = updateRequestDto.radicado;
      }
      if (updateRequestDto.expediente && currentRequest.expediente === '0') {
        currentRequest.expediente = updateRequestDto.expediente;
      }
      if (updateRequestDto.nombreSolicitante) {
        currentRequest.nombreSolicitante = updateRequestDto.nombreSolicitante;
      }
      if (updateRequestDto.calidadSolicitante) {
        currentRequest.calidadSolicitante = updateRequestDto.calidadSolicitante;
      }
      if (updateRequestDto.etapa) {
        currentRequest.etapa = updateRequestDto.etapa;
      }
      if (updateRequestDto.documentalTypeSelected) {
        currentRequest.documentalTypeSelected =
          updateRequestDto.documentalTypeSelected;
      }
      if (updateRequestDto.comunicationChannelSelected) {
        currentRequest.comunicationChannelSelected =
          updateRequestDto.comunicationChannelSelected;
      }
      if (updateRequestDto.direccionCorrespondencia) {
        currentRequest.direccionCorrespondencia =
          updateRequestDto.direccionCorrespondencia;
      }
      if (updateRequestDto.correo) {
        currentRequest.correo = updateRequestDto.correo;
      }
      if (updateRequestDto.telefono) {
        currentRequest.telefono = updateRequestDto.telefono;
      }
      if (updateRequestDto.nombreFuncionario) {
        currentRequest.nombreFuncionario = updateRequestDto.nombreFuncionario;
      }
      if (updateRequestDto.dependecia) {
        currentRequest.dependecia = updateRequestDto.dependecia;
      }
      if (updateRequestDto.positionSelected) {
        currentRequest.positionSelected = updateRequestDto.positionSelected;
      }
      if (updateRequestDto.systemState) {
        currentRequest.systemState = updateRequestDto.systemState;
      }
      // if (updateRequestDto.userAgentSelected) {
      //   if (currentRequest.agentSelected.id !== updateRequestDto.userAgentSelected)
      //     notify = true;
      //   let newUserAgentSelected = await this.usersService.getUserById(updateRequestDto.userAgentSelected);
      //   currentRequest.agentSelected = newUserAgentSelected.data;
      // }

      if (updateRequestDto.applicantType) {
        const currentType = await this.repositoryTypeRequest.findOneOrFail({
          where: { id: updateRequestDto.applicantType },
        });
        currentRequest.applicantTypeRequest = currentType;
      }
      if (updateRequestDto.subject) {
        currentRequest.subject = updateRequestDto.subject;
      }
      if (updateRequestDto.authorIdentified) {
        currentRequest.authorIdentified = updateRequestDto.authorIdentified;
      }
      if (updateRequestDto.indagacionPrevia) {
        currentRequest.indagacionPrevia = updateRequestDto.indagacionPrevia;
      }
      if (updateRequestDto.disciplanaryInvestigation) {
        currentRequest.disciplanaryInvestigation =
          updateRequestDto.disciplanaryInvestigation;
      }
      if (updateRequestDto.recursoApelacion) {
        currentRequest.recursoApelacion = updateRequestDto.recursoApelacion;
      }
      if (updateRequestDto.procedeRecursoApelacion) {
        currentRequest.procedeRecursoApelacion =
          updateRequestDto.procedeRecursoApelacion;
      }
      if (updateRequestDto.decisionEvaluacion) {
        currentRequest.decisionEvaluacion = updateRequestDto.decisionEvaluacion;
      }
      if (updateRequestDto.continueInvestigation) {
        currentRequest.continueInvestigation =
          updateRequestDto.continueInvestigation;
      }
      if (updateRequestDto.decisionSegundaInstancia) {
        currentRequest.decisionSegundaInstancia =
          updateRequestDto.decisionSegundaInstancia;
      }
      if (updateRequestDto.decisionSegundaInstanciaOtros) {
        currentRequest.decisionSegundaInstanciaOtros =
          updateRequestDto.decisionSegundaInstanciaOtros;
      }
      if (updateRequestDto.confesar) {
        currentRequest.confesar = updateRequestDto.confesar;
      }
      if (updateRequestDto.tieneApoderado) {
        currentRequest.tieneApoderado = updateRequestDto.tieneApoderado;
      }
      if (updateRequestDto.procedeConfesion) {
        currentRequest.procedeConfesion = updateRequestDto.procedeConfesion;
      }
      if (updateRequestDto.medioJuzgamiento) {
        currentRequest.medioJuzgamiento = updateRequestDto.medioJuzgamiento;
      }
      if (updateRequestDto.aceptaCargos) {
        currentRequest.aceptaCargos = updateRequestDto.aceptaCargos;
      }
      if (updateRequestDto.apruebaPruebasCompletas) {
        currentRequest.apruebaPruebasCompletas =
          updateRequestDto.apruebaPruebasCompletas;
      }
      if (updateRequestDto.apelaFallo) {
        currentRequest.apelaFallo = updateRequestDto.apelaFallo;
      }
      if (updateRequestDto.presentaRecursoApelacionAutoDecisionPruebas) {
        currentRequest.presentaRecursoApelacionAutoDecisionPruebas =
          updateRequestDto.presentaRecursoApelacionAutoDecisionPruebas;
      }
      if (updateRequestDto.concedeRecurso) {
        currentRequest.concedeRecurso = updateRequestDto.concedeRecurso;
      }
      if (updateRequestDto.hayNulidad) {
        currentRequest.hayNulidad = updateRequestDto.hayNulidad;
      }
      if (updateRequestDto.archiveDisciplanaryInvestigation) {
        currentRequest.archiveDisciplanaryInvestigation =
          updateRequestDto.archiveDisciplanaryInvestigation;
      }
      if (updateRequestDto.recursoApelacionJuzgamiento) {
        currentRequest.recursoApelacionJuzgamiento =
          updateRequestDto.recursoApelacionJuzgamiento;
      }
      if (updateRequestDto.procedeRecursoApelacionJuzgamiento) {
        currentRequest.procedeRecursoApelacionJuzgamiento =
          updateRequestDto.procedeRecursoApelacionJuzgamiento;
      }
      if (updateRequestDto.continueInvestigationJuzgamiento) {
        currentRequest.continueInvestigationJuzgamiento =
          updateRequestDto.continueInvestigationJuzgamiento;
      }
      if (updateRequestDto.numberSettled) {
        currentRequest.numberSettled = updateRequestDto.numberSettled;
      }
      if (updateRequestDto.applicantName) {
        currentRequest.applicantName = updateRequestDto.applicantName;
      }
      if (updateRequestDto.employeeFullName) {
        currentRequest.employeeFullName = updateRequestDto.employeeFullName;
      }
      if (updateRequestDto.employeeDependency) {
        currentRequest.employeeDependency = updateRequestDto.employeeDependency;
      }
      if (updateRequestDto.employeePosition) {
        currentRequest.employeePosition = updateRequestDto.employeePosition;
      }
      if (updateRequestDto.employeeEmail) {
        currentRequest.employeeEmail = updateRequestDto.employeeEmail;
      }
      if (updateRequestDto.employeeAddress) {
        currentRequest.employeeAddress = updateRequestDto.employeeAddress;
      }
      if (updateRequestDto.fileNumber) {
        currentRequest.fileNumber = updateRequestDto.fileNumber;
      }
      if (updateRequestDto.nameRequester) {
        currentRequest.nameRequester = updateRequestDto.nameRequester;
      }
      if (updateRequestDto.userReceive) {
        currentRequest.userReceive = updateRequestDto.userReceive;
      }
      if (updateRequestDto.expireDate) {
        currentRequest.expireDate = updateRequestDto.expireDate;
      }

      if (updateRequestDto.proceedingsNumbers) {
        currentRequest.proceedingsNumbers = updateRequestDto.proceedingsNumbers;
      }

      if (updateRequestDto.state_id) {
        const currentState = await this.repositoryProcessState.findOneOrFail({
          where: { id: updateRequestDto.state_id },
        });
        currentRequest.state = currentState;
      }

      if (updateRequestDto.complianceFacts) {
        currentRequest.complianceFacts = updateRequestDto.complianceFacts;
      }

      if (updateRequestDto.enabled !== undefined) {
        currentRequest.enabled = updateRequestDto.enabled;
      }

      if (updateRequestDto.cedulaSolicitante) {
        currentRequest.cedulaSolicitante = updateRequestDto.cedulaSolicitante;
      }

      currentRequest.disciplined = await Promise.all(
        updateRequestDto.disciplined?.map(async (disciplined) => {
          return await this.repositoryRequestDisciplined.save(disciplined);
        }),
      );

      if (updateRequestDto.requestObservations) {
        await this.observationsService.logObservationOrSystemLog(
          currentRequest.id,
          updateRequestDto.requestObservations[
            updateRequestDto.requestObservations.length - 1
          ].content,
          updateRequestDto.userId,
          'user',
        );
      }

      const modifyRequest = await this.repositoryRequestHeader.save(
        currentRequest,
      );

      const attachmentsReq = updateRequestDto.attachments;
      const attachmentsDb = currentRequest.attachments;

      if (attachmentsReq.length != attachmentsDb.length) {
        if (attachmentsReq.length < attachmentsDb.length) {
          attachmentsDb?.forEach(async (attachment) => {
            if (!attachmentsReq.find((id) => id.id == attachment.id)) {
              await this.observationsService.logObservationOrSystemLog(
                currentRequest.id,
                `El archivo ${attachment.fileName} ha sido eliminado`,
                null,
                'system',
              );
              await this.repositoryAttachment.remove(attachment);
            }
          });
        } else {
          attachmentsReq?.forEach(async (attachment) => {
            if (!attachmentsDb.find((id) => id.id == attachment.id)) {
              await this.observationsService.logObservationOrSystemLog(
                currentRequest.id,
                `El archivo ${attachment.fileName} ha sido añadido`,
                null,
                'system',
              );
              await this.repositoryAttachment.save({
                ...attachment,
                requestHeader: modifyRequest,
              });
            }
          });
        }
      }

      //TODO: Verificar attachments que se hayan eliminado.
      // updateRequestDto.attachments?.forEach(async attachment => {

      //   await this.repositoryAttachment.save({
      //     ...attachment,
      //     requestHeader: modifyRequest
      //   });
      //   // await this.observationsService.logObservationOrSystemLog(currentRequest.id,`Se ha añadido ${attachment.fileName}`, null, 'system' )
      // })

      if (notify) {
        const recipients = [
          {
            name: modifyRequest.agentSelected.userName,
            email: modifyRequest.agentSelected.userEmail,
          },
        ];
      }
      return {
        success: true,
        data: plainToInstance(RequestHeader, modifyRequest),
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async modifyStateRequest(id: string, state: string) {
    try {
      const currentRequest = await this.repositoryRequestHeader.findOne({
        where: { id: id },
      });

      if (!currentRequest) {
        return {
          success: false,
          code: 'CD002',
        };
      }

      const currentState = await this.repositoryProcessState.findOneOrFail({
        where: { id: state },
      });

      if (!currentState) {
        return {
          success: false,
          code: 'CD002',
        };
      }

      currentRequest.state = currentState;
      const modifyRequest = await this.repositoryRequestHeader.save(
        currentRequest,
      );

      await this.observationsService.logObservationOrSystemLog(
        currentRequest.id,
        `El ${currentRequest.agentSelected.userName} ${currentRequest.agentSelected.userLastName} ha modificado el estado de la peticion`,
        currentRequest.agentSelected.id,
        'system',
      );

      return {
        success: true,
        data: plainToInstance(RequestHeader, modifyRequest),
      };
    } catch (error) {
      console.log(error.message);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async createTypeReq(createTypeDto: CreateTypeReqDto) {
    try {
      const saveTypeRequest = await this.repositoryTypeRequest.save(
        createTypeDto,
      );
      return {
        success: true,
        data: plainToInstance(TypeRequest, saveTypeRequest),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async findAllTypeReq() {
    try {
      const listTypeRequest = await this.repositoryTypeRequest.find();
      return {
        success: true,
        data: plainToInstance(TypeRequest, listTypeRequest),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async ModifyTypeReq(id: string, updateTypeReqDto: UpdateTypeReqDto) {
    try {
      const currentTypeRequest = await this.repositoryTypeRequest.findOne({
        where: { id: id },
      });
      if (!currentTypeRequest) {
        return {
          success: false,
          code: 'CD002',
        };
      }

      if (updateTypeReqDto.typeReqName)
        currentTypeRequest.typeReqName = updateTypeReqDto.typeReqName;
      currentTypeRequest.typeReqState = updateTypeReqDto.typeReqState;

      const modifyPotition = await this.repositoryTypeRequest.save(
        currentTypeRequest,
      );
      return {
        success: true,
        data: plainToInstance(TypeRequest, modifyPotition),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async createProcessState(createTypeDto: CreateProcessStateDto) {
    try {
      const saveProcessStateuest = await this.repositoryProcessState.save(
        createTypeDto,
      );
      return {
        success: true,
        data: plainToInstance(ProcessState, saveProcessStateuest),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async findAllProcessState() {
    try {
      const listProcessStateuest = await this.repositoryProcessState.find();
      return {
        success: true,
        data: plainToInstance(ProcessState, listProcessStateuest),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async ModifyProcessState(
    id: string,
    updateProcessStateDto: UpdateProcessStateDto,
  ) {
    try {
      const currentProcessStateuest = await this.repositoryProcessState.findOne(
        {
          where: { id: id },
        },
      );
      if (!currentProcessStateuest) {
        return {
          success: false,
          code: 'CD002',
        };
      }

      if (updateProcessStateDto.processStateName)
        currentProcessStateuest.processStateName =
          updateProcessStateDto.processStateName;
      currentProcessStateuest.processStateState =
        updateProcessStateDto.processStateState;

      const modifyPotition = await this.repositoryProcessState.save(
        currentProcessStateuest,
      );
      return {
        success: true,
        data: plainToInstance(ProcessState, modifyPotition),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async createCommunication(createTypeDto: CreateCommunicationDto) {
    try {
      const saveTypeCommunication = await this.repositoryTypeCommunication.save(
        createTypeDto,
      );
      return {
        success: true,
        data: plainToInstance(TypeCommunication, saveTypeCommunication),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async findAllCommunication() {
    try {
      const listTypeCommunication =
        await this.repositoryTypeCommunication.find();
      return {
        success: true,
        data: plainToInstance(TypeCommunication, listTypeCommunication),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async ModifyCommunication(
    id: string,
    updateCommunicationDto: UpdateCommunicationDto,
  ) {
    try {
      const currentTypeCommunication =
        await this.repositoryTypeCommunication.findOne({
          where: { id: id },
        });
      if (!currentTypeCommunication) {
        return {
          success: false,
          code: 'CD002',
        };
      }

      if (updateCommunicationDto.communicationName)
        currentTypeCommunication.communicationName =
          updateCommunicationDto.communicationName;
      currentTypeCommunication.communicationState =
        updateCommunicationDto.communicationState;

      const modifyPotition = await this.repositoryTypeCommunication.save(
        currentTypeCommunication,
      );
      return {
        success: true,
        data: plainToInstance(TypeCommunication, modifyPotition),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async uploadDocument(document: UploadDocumentDto): Promise<responseDto> {
    try {
      const req = await this.repositoryRequestHeader.findOne({
        where: {
          id: document.requestId,
        },
        relations: ['disciplined', 'disciplined.lawyer'],
      });
      const template = await this.repositoryTemplate.findOne({
        where: {
          templateName: document.title,
        },
      });
      let consecutive: number, prefix: string;

      const isAuto =
        document.documentType === 'AUTO' ||
        document.title.split(' ')[0].toUpperCase() === 'AUTO';
      if (document.state === 'Aceptado' && isAuto) {
        const { consecutive: c, prefix: p } =
          await this.getConsecutiveAndPrefix(template);
        consecutive = c;
        prefix = p;
        if (req.expediente === '0') {
          const proceedingsNumber: number = (
            await this.generateProceedingsNumberV2()
          ).data;
          await this.repositoryRequestHeader.update(document.requestId, {
            expediente: String(proceedingsNumber),
          });
        }
      }

      if (!document.communicationsAndNotificationsData) {
        const nullValues = {
          fechaComunicacionFisica: null,
          fechaNotificacionFisica: null,
          fechaComunicacionEmail: null,
          fechaNotificacionEmail: null,
        };

        const disciplinados = {},
          apoderados = {};

        req.disciplined.forEach((d) => {
          disciplinados[d.id] = nullValues;
          apoderados[(d.lawyer as Lawyers)?.id] = nullValues;
        });

        document.communicationsAndNotificationsData = {
          disciplinados,
          apoderados,
          quejoso: nullValues,
        };
      }

      const doc: Documents = await this.repositoryDocuments.save({
        ...document,
        consecutive: consecutive ?? null,
        prefix: prefix ?? null,
        request: document.requestId,
        documentType: template.documentType,
      });

      return {
        success: true,
        data: plainToInstance(Documents, doc),
      };
    } catch (err) {
      return { success: false, message: err };
    }
  }

  async getDocuments(requestId: string, stage: string): Promise<responseDto> {
    try {
      const documents = await this.repositoryDocuments
        .createQueryBuilder()
        .select('documents')
        .from(Documents, 'documents')
        .where(
          'documents.id_request = :requestId AND documents.stage = :stage',
          { requestId: requestId, stage: stage },
        )
        .orderBy('documents.id')
        .getMany();
      return {
        success: true,
        data: plainToInstance(Documents, documents),
      };
    } catch (err) {
      return { success: false, message: err };
    }
  }

  async getAllDocumentsByRequestV2(requestId: string): Promise<responseDto> {
    try {
      const existingDocuments = await this.repositoryDocuments.find({
        relations: ['stage'],
        where: { requestId: { id: requestId } },
        order: {
          id: 'asc',
        },
      });

      const request = (await this.findOne(requestId)).data;
      const globalConfig = (await this.getGlobalConfig()).data;
      const templates: Template[] = await this.repositoryTemplate.find({
        relations: ['requestStage'],
        order: {
          id: 'ASC',
        },
      });

      const documents: Documents[] = await Promise.all(
        templates.map(async (template) => {
          const doc = existingDocuments.find(
            (d) => d.title === template.templateName,
          );
          if (doc)
            return {
              ...doc,
              seNotificaDisciplinado: template.seNotificaDisciplinado,
              seNotificaQuejoso: template.seNotificaQuejoso,
              seComunicaDisciplinado: template.seComunicaDisciplinado,
              seComunicaQuejoso: template.seComunicaQuejoso,
              seComunicaApoderado: template.seComunicaApoderado,
              seNotificaApoderado: template.seNotificaApoderado,
            };
          // const {consecutive, prefix} = await this.getConsecutiveAndPrefix(template);

          const templateContent = handlebars.compile(template.templateContent);
          const html = templateContent({ request, template, globalConfig });
          return {
            requestId: requestId,
            content: html ?? template.templateContent,
            stage: template.requestStage,
            order: template.order,
            title: template.templateName,
            state: 'Por completar',
            consecutive: null,
            prefix: null,
            seNotificaDisciplinado: template.seNotificaDisciplinado,
            seNotificaQuejoso: template.seNotificaQuejoso,
            seComunicaDisciplinado: template.seComunicaDisciplinado,
            seComunicaQuejoso: template.seComunicaQuejoso,
            fechaNotificacionQuejoso: template.fechaNotificacionQuejoso,
            fechaComunicacionQuejoso: template.fechaComunicacionQuejoso,
            fechaComunicacionDisciplinado:
              template.fechaComunicacionDisciplinado,
            fechaNotificacionDisciplinado:
              template.fechaNotificacionDisciplinado,
          } as Documents;
        }),
      );
      return {
        success: true,
        data: plainToInstance(Documents, documents),
      };
    } catch (err) {
      console.error(err);
      return { success: false, message: err };
    }
  }

  async calculateActualRequestState(
    updateRequestDto: UpdateRequestDto,
    actualRequestState: number,
    actualAssignedUserId: string,
    requestId: string,
    recursiveCalls: number = 0,
  ) {
    let idRequestState = actualRequestState;

    let changedAssigned = false;

    if (
      updateRequestDto.userAgentSelected != actualAssignedUserId &&
      recursiveCalls === 0
    ) {
      await this.assignRequestToRole(
        requestId,
        updateRequestDto.userAgentSelected,
      );
      changedAssigned = true;
    }

    const request: RequestHeader = await this.repositoryRequestHeader.findOne({
      where: {
        id: requestId,
      },
    });

    switch (actualRequestState) {
      case 2: {
        //"Recibir, verificar y asignar la Solicitud"
        if (changedAssigned) {
          idRequestState = 3; //"Analizar la queja, anónimo, informe y/o publicación respectiva"
        }
        break;
      }
      case 3: {
        if (
          updateRequestDto.authorIdentified == 'no' &&
          updateRequestDto.indagacionPrevia == 'no'
        ) {
          idRequestState = 4; //"Realizar Auto Inhibitorio"
          let autoInhibitorio = await this.repositoryDocuments
            .createQueryBuilder()
            .select('documents')
            .from(Documents, 'documents')
            .where(
              'documents.id_request = :requestId AND documents.title = :title',
              { requestId: requestId, title: 'Auto Inhibitorio 1952' },
            )
            .getOne();
          if (
            autoInhibitorio != null &&
            (autoInhibitorio.state === 'Completado' || autoInhibitorio.state === 'Aceptado')
          ) {
            idRequestState = 5; //Revisar y aprobar auto inhibitorio
            await this.assignRequestToRole(
              requestId,
              'Director de Instruccion',
            );
          }
        }

        if (
          updateRequestDto.authorIdentified == 'no' &&
          updateRequestDto.indagacionPrevia == 'yes'
        ) {
          let documento = await this.repositoryDocuments
            .createQueryBuilder()
            .select('documents')
            .from(Documents, 'documents')
            .where(
              'documents.id_request = :requestId AND documents.title = :title',
              {
                requestId: requestId,
                title: 'Auto inicio indagacion previa 1952',
              },
            )
            .getOne();
          if (documento != null && (documento.state === 'Completado' || documento.state === 'Aceptado')) {
            idRequestState = 11; //Revisar y aprobar auto indagación previa
            await this.assignRequestToRole(
              requestId,
              'Director de Instruccion',
            );
          } else {
            idRequestState = 10; //"Realizar auto de inicio de Indagación Previa"
          }
        }

        if (
          updateRequestDto.authorIdentified == 'yes' &&
          updateRequestDto.disciplanaryInvestigation == 'no'
        ) {
          idRequestState = 16; //"Elaborar auto de archivo, oficio y memorando"
        }

        if (
          updateRequestDto.authorIdentified == 'yes' &&
          updateRequestDto.disciplanaryInvestigation == 'yes'
        ) {
          idRequestState = 29; //"Elaborar Auto de Inicio de Investigación disciplinaria, oficios y memorandos"
        }

        if (request.expediente === '0') {
          request.expediente = (await this.generateProceedingsNumberV2()).data;
          await this.repositoryRequestHeader.save(request);
        }
        break;
      }
      case 4: {
        //Si el documento está completado pasa a estado 5
        let autoInhibitorio = await this.repositoryDocuments
          .createQueryBuilder()
          .select('documents')
          .from(Documents, 'documents')
          .where(
            'documents.id_request = :requestId AND documents.title = :title',
            { requestId: requestId, title: 'Auto Inhibitorio 1952' },
          )
          .getOne();
        if (autoInhibitorio != null && (autoInhibitorio.state === 'Completado' || autoInhibitorio.state === 'Aceptado')) {
          idRequestState = 5; //Revisar y aprobar auto inhibitorio
          await this.assignRequestToRole(requestId, 'Director de Instruccion');
        }
        break;
      }
      case 5: {
        //Si el documento está aprobado pasa a estado 6 (Comunicar quejoso) y etapa cambia a Inhibitorio
        let autoInhibitorio = await this.repositoryDocuments
          .createQueryBuilder()
          .select('documents')
          .from(Documents, 'documents')
          .where(
            'documents.id_request = :requestId AND documents.title = :title',
            { requestId: requestId, title: 'Auto Inhibitorio 1952' },
          )
          .getOne();
        if (autoInhibitorio != null && autoInhibitorio.state == 'Aceptado') {
          idRequestState = 6; //Comunicar al quejoso
          //Cambio de etapa
          await this.changeRequestStage(requestId, 2); //Paso a etapa Inhibitoria.
        }

        if (autoInhibitorio != null && autoInhibitorio.state == 'Modificar') {
          idRequestState = 4; //Devuelvo el estado a Realizar auto inhibitorio
        }
        break;
      }
      case 6: {
        //Si el memorando está Completado, se pasa al estado 7 de revisión
        let memorando = await this.repositoryDocuments
          .createQueryBuilder()
          .select('documents')
          .from(Documents, 'documents')
          .where(
            'documents.id_request = :requestId AND documents.title = :title',
            {
              requestId: requestId,
              title: 'Memorando oficio comunicación a quejoso de inhibitorio',
            },
          )
          .getOne();
        if (memorando != null && (memorando.state === 'Completado' || memorando.state === 'Aceptado')) {
          idRequestState = 7; //Revisar y aprobar memorando
          await this.assignRequestToRole(requestId, 'Director de Instruccion');
        }

        if (memorando != null && memorando.state == 'Aceptado') {
          idRequestState = 8; //Revisar y aprobar memorando
          await this.assignRequestToRole(
            requestId,
            'Secretaria Comun de Instruccion',
          );
        }
        break;
      }
      case 7: {
        //Si el memorando está Aprobado, se pasa al estado 8 de archivar documentos y se asigna a la secretaría
        let memorando = await this.repositoryDocuments
          .createQueryBuilder()
          .select('documents')
          .from(Documents, 'documents')
          .where(
            'documents.id_request = :requestId AND documents.title = :title',
            {
              requestId: requestId,
              title: 'Memorando oficio comunicación a quejoso de inhibitorio',
            },
          )
          .getOne();

        if (memorando != null && memorando.state == 'Aceptado') {
          idRequestState = 8; //Archivar Documentos al expediente
          //Cambio de etapa
          await this.changeRequestStage(requestId, 10);
          await this.assignRequestToRole(
            requestId,
            'Secretaria Comun de Instruccion',
          );
        }

        if (memorando != null && memorando.state == 'Rechazado') {
          idRequestState = 6; //Devuelvo a Comunicar al Quejoso
        }

        break;
      }

      case 8: {
        //TODO Verificar que se hayan enviado los documentos, es decir notificaciones y clic en archivar.
        idRequestState = 9; //Fin proceso
        break;
      }

      case 10: {
        let documento = await this.repositoryDocuments
          .createQueryBuilder()
          .select('documents')
          .from(Documents, 'documents')
          .where(
            'documents.id_request = :requestId AND documents.title = :title',
            {
              requestId: requestId,
              title: 'Auto inicio indagacion previa 1952',
            },
          )
          .getOne();
        if (documento != null && (documento.state === 'Completado' || documento.state === 'Aceptado')) {
          idRequestState = 11; //Revisar y aprobar auto indagación previa
          await this.assignRequestToRole(requestId, 'Director de Instruccion');
        }
        break;
      }
      case 11: {
        //Si el documento está aprobado pasa a estado 6 (Comunicar quejoso o informante) y etapa cambia a Indagación previa
        let documento = await this.repositoryDocuments
          .createQueryBuilder()
          .select('documents')
          .from(Documents, 'documents')
          .where(
            'documents.id_request = :requestId AND documents.title = :title',
            {
              requestId: requestId,
              title: 'Auto inicio indagacion previa 1952',
            },
          )
          .getOne();
        if (documento != null && documento.state == 'Aceptado') {
          idRequestState = 12; //Comunicar al quejoso o informante
          //Cambio de etapa
          await this.changeRequestStage(requestId, 3);
        }

        if (documento != null && documento.state == 'Rechazado') {
          idRequestState = 10; //Devuelvo a Realizar auto de indagación previa
        }
        break;
      }
      case 12: {
        //Si el memorando está Completado, se pasa al estado 13 de revisión y cambia a director de instrucción
        let memorando = await this.repositoryDocuments
          .createQueryBuilder()
          .select('documents')
          .from(Documents, 'documents')
          .where(
            'documents.id_request = :requestId AND documents.title = :title',
            {
              requestId: requestId,
              title: 'Memorando Oficio Comunicación Inicio Indagación Previa',
            },
          )
          .getOne();
        if (
          (memorando != null && memorando.state === 'Completado') ||
          (memorando != null && memorando.state === 'Aceptado')
        ) {
          idRequestState = 13; //Revisar y aprobar memorando
          await this.assignRequestToRole(requestId, 'Director de Instruccion');
        }
        break;
      }

      case 13: {
        //Si el memorando está Aprobado, se pasa al estado 14  solicitar, recaudar y analizar pruebas.
        let memorando = await this.repositoryDocuments
          .createQueryBuilder()
          .select('documents')
          .from(Documents, 'documents')
          .where(
            'documents.id_request = :requestId AND documents.title = :title',
            {
              requestId: requestId,
              title: 'Memorando Oficio Comunicación Inicio Indagación Previa',
            },
          )
          .getOne();

        if (memorando != null && memorando.state == 'Aceptado') {
          idRequestState = 14; //Solicitar, recaudar y analizar pruebas
        }

        if (memorando != null && memorando.state == 'Rechazado') {
          idRequestState = 12; //Devuelvo a Comunicar al quejoso o informante
        }

        break;
      }

      case 14: {
        let autoVariosOrdenarPruebas = await this.repositoryDocuments
          .createQueryBuilder()
          .select('documents')
          .from(Documents, 'documents')
          .where(
            'documents.id_request = :requestId AND documents.title = :title',
            {
              requestId: requestId,
              title: 'AUTO VARIO ORDENAR PRUEBAS_IP 1952.2',
            },
          )
          .getOne();

        let memorandoOficioPruebas = await this.repositoryDocuments
          .createQueryBuilder()
          .select('documents')
          .from(Documents, 'documents')
          .where(
            'documents.id_request = :requestId AND documents.title = :title',
            {
              requestId: requestId,
              title: 'Memorando_Oficio_Solicitud de Pruebas_IP 1952.2',
            },
          )
          .getOne();
        if (
          autoVariosOrdenarPruebas != null &&
          (autoVariosOrdenarPruebas.state === 'Completado' || autoVariosOrdenarPruebas.state === 'Aceptado') &&
          memorandoOficioPruebas != null &&
          (memorandoOficioPruebas.state === 'Completado' || memorandoOficioPruebas.state === 'Aceptado')
        ) {
          idRequestState = 15;
          await this.assignRequestToRole(requestId, 'Director de Instruccion');
          /* if (updateRequestDto.disciplanaryInvestigation == 'no') {
             idRequestState = 11; //"Elaborar auto de archivo, oficio y memorando"
           }

           if (updateRequestDto.disciplanaryInvestigation == 'yes') {
             idRequestState = 28; //"Elaborar el Auto de inicio de investigación disciplinaria, oficios y memorandos"
           }*/
        }
        break;
      }

      case 15: {
        let autoVariosOrdenarPruebas = await this.repositoryDocuments
          .createQueryBuilder()
          .select('documents')
          .from(Documents, 'documents')
          .where(
            'documents.id_request = :requestId AND documents.title = :title',
            {
              requestId: requestId,
              title: 'AUTO VARIO ORDENAR PRUEBAS_IP 1952.2',
            },
          )
          .getOne();

        let memorandoOficioPruebas = await this.repositoryDocuments
          .createQueryBuilder()
          .select('documents')
          .from(Documents, 'documents')
          .where(
            'documents.id_request = :requestId AND documents.title = :title',
            {
              requestId: requestId,
              title: 'Memorando_Oficio_Solicitud de Pruebas_IP 1952.2',
            },
          )
          .getOne();
        if (
          autoVariosOrdenarPruebas != null &&
          autoVariosOrdenarPruebas.state == 'Aceptado' &&
          memorandoOficioPruebas != null &&
          memorandoOficioPruebas.state == 'Aceptado'
        ) {
          if (updateRequestDto.disciplanaryInvestigation == 'no') {
            idRequestState = 16; //"Elaborar auto de archivo, oficio y memorando"
          }

          if (updateRequestDto.disciplanaryInvestigation == 'yes') {
            idRequestState = 29; //"Elaborar el Auto de inicio de investigación disciplinaria, oficios y memorandos"
          }
        }

        if (
          (autoVariosOrdenarPruebas != null &&
            autoVariosOrdenarPruebas.state == 'Rechazado') ||
          (memorandoOficioPruebas != null &&
            memorandoOficioPruebas.state == 'Rechazado')
        ) {
          idRequestState = 14; //Devuelvo a Solicitar, recaudar y analizar pruebas.
        }
        break;
      }

      case 16: {
        let documento = await this.repositoryDocuments
          .createQueryBuilder()
          .select('documents')
          .from(Documents, 'documents')
          .where(
            'documents.id_request = :requestId AND documents.title = :title',
            {
              requestId: requestId,
              title: 'AUTO ARCHIVO INDAGACIÓN PREVIA 1952.1',
            },
          )
          .getOne();
        if (documento != null && (documento.state === 'Completado' || documento.state === 'Aceptado')) {
          idRequestState = 17; //"Revisar y aprobar documentos de archivo de indagación previa"
          await this.assignRequestToRole(requestId, 'Director de Instruccion');
        }
        break;
      }

      case 17: {
        let documento = await this.repositoryDocuments
          .createQueryBuilder()
          .select('documents')
          .from(Documents, 'documents')
          .where(
            'documents.id_request = :requestId AND documents.title = :title',
            {
              requestId: requestId,
              title: 'AUTO ARCHIVO INDAGACIÓN PREVIA 1952.1',
            },
          )
          .getOne();
        if (documento != null && documento.state == 'Aceptado') {
          idRequestState = 18; //"Comunicar al quejoso o informante"
          //Cambio de etapa
          await this.changeRequestStage(requestId, 3);
          await this.assignRequestToRole(
            requestId,
            'Secretaria Comun de Instruccion',
          );
        }

        if (documento != null && documento.state == 'Rechazado') {
          idRequestState = 16; //Cambio a Elaborar auto de archivo oficio...
        }

        break;
      }
      case 18: {
        idRequestState = 19;
        break;
      }

      case 19: {
        //TODO Verificar si se notificó para archivar
        if (updateRequestDto.recursoApelacion == 'no') {
          idRequestState = 20; //"Realizar constancia ejecutoria"
        }

        if (updateRequestDto.recursoApelacion == 'yes') {
          await this.assignRequestToRole(requestId, 'Director de Instruccion');
          idRequestState = 22; // Recepcionar recurso de apelación
        }
        break;
      }

      case 20: {
        //TODO Revisar qué se hace con la constancia ejecutoria
        idRequestState = 21;
        break;
      }

      case 21: {
        //Fin proceso
        break;
      }

      case 22: {
        //TODO: Si el documento es aceptado asignar al 23 secretaría.
        await this.assignRequestToRole(
          requestId,
          'Secretaria Comun de Instruccion',
        );
        idRequestState = 23;
        break;
      }

      case 23: {
        if (updateRequestDto.procedeRecursoApelacion == 'no') {
          idRequestState = 24;
          break;
        }

        if (updateRequestDto.procedeRecursoApelacion == 'yes') {
          idRequestState = 26;
          break;
        }

        break;
      }

      case 24: {
        idRequestState = 25;
        break;
      }

      case 25: {
        //Fin de proceso
        break;
      }
      case 26: {
        idRequestState = 27;
        break;
      }
      case 27: {
        idRequestState = 28;
        break;
      }
      case 28: {
        //Pasa a segunda instancia para revisión recurso de apelación...
        break;
      }
      case 29: {
        await this.assignRequestToRole(requestId, 'Director de Instruccion');
        idRequestState = 36;
        break;
      }

      case 30: {
        await this.assignRequestToRole(requestId, 'Director de Instruccion');
        idRequestState = 31;
        break;
      }

      case 31: {
        let documento = await this.repositoryDocuments
          .createQueryBuilder()
          .select('documents')
          .from(Documents, 'documents')
          .where(
            'documents.id_request = :requestId AND documents.title = :title',
            {
              requestId: requestId,
              title: 'Auto cumplimiento de archivo de IP segunda instancia',
            },
          )
          .getOne();
        if (documento != null && documento.state == 'Aceptado') {
          await this.assignRequestToRole(
            requestId,
            'Secretaria Comun de Instruccion',
          );
          idRequestState = 32; // Paso a realizar constancia secretarial
        }

        if (documento != null && documento.state == 'Rechazado') {
          idRequestState = 30; //Cambio a realizar auto de cumplimiento de segunda instancia
        }
        break;
      }

      case 32: {
        idRequestState = 33;
        break;
      }

      case 33: {
        idRequestState = 34;
        break;
      }

      case 34: {
        //Fin proceso
        break;
      }

      case 35: {
        //TODO Validar el documento Auto inicio de investigación disciplinaria.
        await this.assignRequestToRole(requestId, 'Director de Instruccion');
        idRequestState = 36;
        break;
      }

      case 36: {
        await this.assignRequestToRole(
          requestId,
          'Secretaria Comun de Instruccion',
        );
        idRequestState = 37;
        break;
      }

      case 37: {
        if (updateRequestDto.confesar == 'yes') {
          //TODO: Se debe enviar de nuevo al profesional, o habilitar en el frontend a la secretaría o dejarlo que el director revise.
          await this.assignRequestToRole(requestId, 'Director de Instruccion');
          idRequestState = 38;
          break;
        }

        if (updateRequestDto.confesar == 'no') {
          //TODO: Se debe enviar de nuevo al profesional, o habilitar en el frontend a la secretaría o dejarlo que el director revise.
          await this.assignRequestToRole(requestId, 'Director de Instruccion');
          idRequestState = 45;
          break;
        }
        break;
      }

      case 38: {
        if (updateRequestDto.tieneApoderado == 'yes') {
          idRequestState = 39;
        }
        if (updateRequestDto.tieneApoderado == 'no') {
          idRequestState = 41;
        }
        break;
      }

      case 39: {
        if (updateRequestDto.procedeConfesion == 'yes') {
          idRequestState = 40;
        }
        if (updateRequestDto.procedeConfesion == 'no') {
          idRequestState = 45;
        }
        break;
      }

      case 40: {
        //TODO Inicia etapa de Juzgamiento
        // TODO Asignar a secretaría común Juzgamiento
        idRequestState = 75;
        break;
      }

      case 41: {
        await this.assignRequestToRole(requestId, 'Director de Instruccion');
        idRequestState = 42;
        break;
      }

      case 42: {
        idRequestState = 43;
        break;
      }

      case 43: {
        await this.assignRequestToRole(requestId, 'Director de Instruccion');
        idRequestState = 44;
        break;
      }

      case 44: {
        idRequestState = 39;
        break;
      }

      case 45: {
        //TODO Verificar si el documento Solicitar y recaudar pruebas esté completado.
        await this.assignRequestToRole(requestId, 'Director de Instruccion');
        idRequestState = 46;
        break;
      }

      case 46: {
        //TODO Validar si el documento Solicitar y recaudar pruebas es aprobado manda a 47 si es rechazado devuelve a 45.

        idRequestState = 47;
        break;
      }

      case 47: {
        //TODO Verificar si el documento Auto cierre de investigación y alegatos precalificatorios esté completado.
        await this.assignRequestToRole(requestId, 'Director de Instruccion');
        idRequestState = 48;
        break;
      }

      case 48: {
        //TODO Validar si el documento  Auto cierre de investigación y alegatos precalificatorios es aprobado manda a 49 a secComun si es rechazado devuelve a 47.
        await this.assignRequestToRole(
          requestId,
          'Secretaria Comun de Instruccion',
        );
        idRequestState = 49;
        break;
      }

      case 49: {
        idRequestState = 50;
        break;
      }

      case 50: {
        if (updateRequestDto.archiveDisciplanaryInvestigation == 'yes') {
          //TODO: Se debe enviar de nuevo al profesional, o habilitar en el frontend a la secretaría o dejarlo que el director revise.
          await this.assignRequestToRole(requestId, 'Director de Instruccion');
          idRequestState = 51;
          break;
        }

        if (updateRequestDto.archiveDisciplanaryInvestigation == 'no') {
          //TODO: Se debe enviar de nuevo al profesional, o habilitar en el frontend a la secretaría o dejarlo que el director revise.
          await this.assignRequestToRole(requestId, 'Director de Instruccion');
          idRequestState = 70;
          break;
        }

        break;
      }

      case 51: {
        break;
      }

      case 52: {
        break;
      }
      case 53: {
        break;
      }
      case 54: {
        break;
      }
      case 55: {
        break;
      }
      case 56: {
        break;
      }
      case 57: {
        break;
      }
      case 58: {
        break;
      }
      case 59: {
        break;
      }

      case 60: {
        break;
      }
      case 61: {
        break;
      }
      case 62: {
        break;
      }
      case 63: {
        break;
      }
      case 64: {
        break;
      }
      case 65: {
        break;
      }
      case 66: {
        break;
      }
      case 67: {
        break;
      }
      case 68: {
        break;
      }
      case 69: {
        break;
      }

      case 70: {
        break;
      }
      case 71: {
        break;
      }
      case 72: {
        break;
      }
      case 73: {
        break;
      }
      case 74: {
        break;
      }
      case 75: {
        break;
      }
      case 76: {
        break;
      }
      case 77: {
        break;
      }
      case 78: {
        break;
      }
      case 79: {
        break;
      }

      case 80: {
        break;
      }
      case 81: {
        break;
      }
      case 82: {
        break;
      }
      case 83: {
        break;
      }
      case 84: {
        break;
      }
      case 85: {
        break;
      }
      case 86: {
        break;
      }
      case 87: {
        break;
      }
      case 88: {
        break;
      }
      case 89: {
        break;
      }

      case 90: {
        break;
      }
      case 91: {
        break;
      }
      case 92: {
        break;
      }
      case 93: {
        break;
      }
      case 94: {
        break;
      }
      case 95: {
        break;
      }
      case 96: {
        break;
      }
      case 97: {
        break;
      }
      case 98: {
        break;
      }
      case 99: {
        break;
      }

      case 100: {
        break;
      }
      case 101: {
        break;
      }
      case 102: {
        break;
      }
      case 103: {
        break;
      }
      case 104: {
        break;
      }
      case 105: {
        break;
      }
      case 106: {
        break;
      }
      case 107: {
        break;
      }
      case 108: {
        break;
      }
      case 109: {
        break;
      }

      case 110: {
        break;
      }
      case 111: {
        break;
      }
      case 112: {
        break;
      }
      case 113: {
        break;
      }
      case 114: {
        break;
      }
      case 115: {
        break;
      }
      case 116: {
        break;
      }
      case 117: {
        break;
      }
      case 118: {
        break;
      }
      case 119: {
        break;
      }

      case 120: {
        break;
      }
      case 121: {
        break;
      }
      case 122: {
        break;
      }
      case 123: {
        break;
      }
      case 124: {
        break;
      }
      case 125: {
        break;
      }
      case 126: {
        break;
      }
      case 127: {
        break;
      }
      case 128: {
        break;
      }
      case 129: {
        break;
      }

      case 130: {
        break;
      }
      case 131: {
        break;
      }
      case 132: {
        break;
      }
      case 133: {
        break;
      }
      case 134: {
        break;
      }
      case 135: {
        break;
      }
      case 136: {
        break;
      }
    }

    if (recursiveCalls === 5) {
      await this.changeRequestState(requestId, idRequestState);
      return;
    } // fija un limite a los llamados recursivos
    await this.calculateActualRequestState(
      updateRequestDto,
      idRequestState,
      actualAssignedUserId,
      requestId,
      ++recursiveCalls,
    );
  }

  async changeRequestState(requestId: string, idRequestState: number) {
    let requestState = await this.repositoryRequestState.findOne({
      where: { id: idRequestState },
    });
    const currentRequest = (await this.findOne(requestId)).data;
    currentRequest.requestState = requestState;
    const { expireDate } = currentRequest;
    expireDate.setDate(
      expireDate.getDay() + requestState.days ? requestState.days : 0,
    );
    currentRequest.expireDate = expireDate;
    await this.repositoryRequestHeader.save(currentRequest);
  }

  async changeRequestStage(requestId: string, stageId: number) {
    let request = (await this.findOne(requestId)).data;
    if (request) {
      let stage = await this.repositoryRequestStage.findOne({
        where: { id: stageId },
      });
      if (stage) {
        let stages = request.requestStages;
        request.requestStages = [...stages, stage];
        await this.repositoryRequestHeader.save(request);
        await this.observationsService.logObservationOrSystemLog(
          requestId,
          'Se cambia a etapa ' + stage.stageName,
          null,
          'system',
        );
      }
    }
  }

  async assignRequestToRole(requestId: string, roleName: string) {
    let request = await this.repositoryRequestHeader.findOne({
      where: { id: requestId },
    });
    if (request) {
      let user = await this.usersService.getUserByRoleName(roleName);
      if (user.data) {
        request.agentSelected = user.data;
        await this.repositoryRequestHeader.save(request);
        await this.observationsService.logObservationOrSystemLog(
          requestId,
          'Se asigna la petición a ' + user.data.userEmail,
          null,
          'system',
        );

        await this.notificationsService.sendEmail({
          recipient: user.data.userEmail,
          templateName: 'assignationTemplate',
          data: {
            nombre: '' + user.data.userName + ' ' + user.data.userLastName,
            nombreQuejoso: request.nombreSolicitante,
          },
        });

        await this.observationsService.logObservationOrSystemLog(
          requestId,
          `Se envia email a ${user.data.userEmail}`,
          null,
          'system',
        );
      } else {
        let userRole = await this.usersService.getUserById(roleName);
        if (userRole.data) {
          request.agentSelected = userRole.data;
          await this.repositoryRequestHeader.save(request);
          await this.observationsService.logObservationOrSystemLog(
            requestId,
            'Se asigna la petición a ' + userRole.data.userEmail,
            null,
            'system',
          );

          await this.notificationsService.sendEmail({
            recipient: userRole.data.userEmail,
            templateName: 'assignationTemplate',
            data: {
              nombre:
                '' + userRole.data.userName + ' ' + userRole.data.userLastName,
              nombreQuejoso: request.nombreSolicitante,
            },
          });

          await this.observationsService.logObservationOrSystemLog(
            requestId,
            `Se envia email a ${userRole.data.userEmail}`,
            null,
            'system',
          );
        }
      }
    }
  }

  async generateProceedingsNumber() {
    try {
      const lastProceedingsNumber = (
        await this.repositoryRequestHeader
          .createQueryBuilder()
          .select('MAX(requests.expediente)')
          .from(RequestHeader, 'requests')
          .getRawOne()
      ).max;

      const proceedingsNumber = Number(lastProceedingsNumber)
        ? Number(lastProceedingsNumber) + 1
        : 6639;

      return {
        success: true,
        data: proceedingsNumber,
      };
    } catch (err) {
      return {
        success: true,
        message: err.message,
      };
    }
  }

  async generateProceedingsNumberV2() {
    try {
      const existingProceedingsNumber = await this.repositoryRequestHeader.find(
        {
          select: {
            expediente: true,
          },
          order: {
            expediente: 'ASC',
          },
        },
      );

      let newProceedingsNumber;

      for (let i = 0; i < existingProceedingsNumber.length - 1; i++) {
        const { expediente: current } = existingProceedingsNumber[i];
        const { expediente: next } = existingProceedingsNumber[i + 1];
        if (current === '0' || next === '0') continue;
        if (Number(next) - Number(current) > 1) {
          newProceedingsNumber = Number(current) + 1;
          break;
        }
      }

      if (!newProceedingsNumber) {
        newProceedingsNumber =
          Number(
            existingProceedingsNumber[existingProceedingsNumber.length - 1]
              .expediente,
          ) + 1;
      }

      return {
        success: true,
        data: newProceedingsNumber,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  async getAllProceedingsNumber() {
    try {
      const proceedingsNumber = await this.repositoryRequestHeader.find({
        select: {
          expediente: true,
        },
        where: {
          expediente: Not('0'),
        },
        order: {
          expediente: 'ASC',
        },
      });
      return {
        success: true,
        data: proceedingsNumber,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getRequestByProceedingsNumber(proceedingsNumber: string) {
    try {
      const request = await this.repositoryRequestHeader.findOne({
        relations: [
          'agentSelected',
          'requestState',
          'requestObservations',
          'requestObservations.userCreated',
          'requestStages',
          'attachments',
          'disciplined',
        ],
        where: {
          expediente: proceedingsNumber,
        },
      });
      return {
        success: true,
        data: request,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async searchDocument(searchDocumentDto: SearchDocumentDto) {
    try {
      const {
        requestFiledStatus,
        requestProceedingsNumber,
        documentType,
        requestFileNumber,
        requestPhaseName,
        requestStageName,
        requestStateName,
        consecutive,
      } = searchDocumentDto;

      let allConsecutives: number[];

      if (!consecutive) {
        allConsecutives = (
          await this.repositoryDocuments.find({
            select: {
              consecutive: true,
            },
          })
        ).map((item) => item.consecutive);
      }

      let documents = await this.repositoryDocuments.find({
        relations: ['requestId', 'requestId.requestState'],
        where: {
          requestId: {
            expediente: requestProceedingsNumber
              ? requestProceedingsNumber
              : Like('%'),
            radicado: requestFileNumber ? requestFileNumber : Like('%'),
            requestState: {
              stateName: requestStateName ? requestStateName : Like('%'),
              faseName: requestPhaseName ? requestPhaseName : Like('%'),
              stageName: requestStageName ? requestStageName : Like('%'),
            },
          },
          title: documentType ? documentType : Like('%'),
          consecutive: consecutive ? consecutive : Any(allConsecutives),
        },
      });

      const data = documents.map((doc) => {
        const { stateName, faseName, stageName } = (
          doc.requestId as RequestHeader
        ).requestState;
        const { expediente, radicado } = doc.requestId as RequestHeader;
        return {
          ...doc,
          stateName,
          faseName,
          stageName,
          expediente,
          radicado,
        };
      });
      return {
        success: true,
        data: data,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  async getGlobalConfig() {
    try {
      const globalConfig = (await this.repositoryConfig.find())[0];
      return {
        success: true,
        data: globalConfig,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  async setGlobalConfig(setGlobalConfigDto: SetGlobalConfigDto) {
    try {
      const newConfig = await this.repositoryConfig.update(
        1,
        setGlobalConfigDto,
      );
      return {
        success: true,
        data: newConfig,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  async getAllRequestStates() {
    try {
      const states = await this.repositoryRequestState.find({
        relations: ['alertRoles'],
        order: {
          id: 'ASC',
        },
      });
      return {
        success: true,
        data: states,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  async modifyRequestState(modifyExpireDateDto: ModifyExpireDateDto) {
    try {
      const {
        stateId: id,
        days,
        isBusinessDays,
        alertRoles: roles,
        previousDays,
      } = modifyExpireDateDto;
      const alertRoles = (await this.usersService.getAllRoles()).data.filter(
        (rol) => roles.includes(rol.id),
      );
      const newState = await this.repositoryRequestState.save({
        id,
        days,
        isBusinessDays: isBusinessDays ?? false,
        alertRoles,
        previousDays: previousDays ?? 0,
      });

      return {
        success: true,
        data: newState,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  async getConsecutiveAndPrefix(template: Template) {
    let consecutive, prefix;
    if (!template.isVario) {
      consecutive = template.consecutive + 1;
      prefix = template.prefix;
      await this.repositoryTemplate.update(template.id, {
        consecutive: consecutive,
      });
    } else {
      const config = await this.repositoryConfig.findOne({});
      consecutive = config.variosConsecutive + 1;
      prefix = config.prefix;

      await this.repositoryConfig.update('1', {
        variosConsecutive: consecutive,
      });
    }
    return { consecutive, prefix };
  }

  async paginate(paginateDto: PaginateDto) {
    try {
      const { requestId, attachments } = paginateDto;

      // audio -> pdf -> images -> video
      attachments.sort((att1, att2) => {
        // data:dataType/ext;base64...
        const dataTypeExt1: string = att1.base64.split(';')[0].split(':')[1];
        const dataTypeExt2: string = att2.base64.split(';')[0].split(':')[1];
        return dataTypeExt1.localeCompare(dataTypeExt2);
      });

      const folio: PDFDocument = await PDFDocument.create();

      await Promise.all(
        attachments.map(async (attachment) => {
          // data:dataType/ext;base64...
          const [dataType, ext]: string[] = attachment.base64
            .split(';')[0]
            .split(':')[1]
            .split('/');

          if (ext === 'pdf') {
            const doc: PDFDocument = await PDFDocument.load(attachment.base64);
            const pagesIndexes: number[] = Array.from(
              { length: doc.getPageCount() },
              (_, index) => index,
            );
            const pages = await folio.copyPages(doc, pagesIndexes);
            pages.forEach((page) => folio.addPage(page));
          } else if (dataType === 'image') {
            let image: PDFImage;
            switch (ext) {
              case 'jpeg':
                image = await folio.embedJpg(attachment.base64);
                break;
              case 'png':
                image = await folio.embedPng(attachment.base64);
                break;
            }

            if (image) {
              const page = await folio.addPage();
              const { width: pageWidth, height: pageHeight } = page.getSize();

              let { width: imgWidth, height: imgHeight } = image;
              const aspectRatio: number = imgWidth / imgHeight;
              while (imgHeight > pageHeight || imgWidth > pageWidth) {
                imgHeight /= 2;
                imgWidth = imgHeight * aspectRatio;
              }
              await page.drawImage(image, {
                height: imgHeight,
                width: imgWidth,
                x: 72,
                y: pageHeight - imgHeight - 72,
              });
            }
          } else {
            const page = await folio.addPage();
            await page.drawText(
              `Archivo ${attachment.fileName}, para encontrarlo, dirijase a este link ${attachment.base64}`,
            );
          }
        }),
      );

      const font = await folio.embedFont(StandardFonts.Courier);

      folio.getPages().forEach((page, index) => {
        const { width, height } = page.getSize();

        page.drawText(`${index + 1}`, {
          x: width - 72,
          y: height - 72,
          size: 12,
          font: font,
        });
      });

      const folioBase64 = await folio.saveAsBase64();
      const folioBase64Uri = `data:application/pdf;base64,${folioBase64}`;

      const req: RequestHeader = (await this.findOne(requestId)).data;

      const currentFolio = await this.repositoryFolio.findOne({
        relations: ['requestHeader'],
        where: {
          requestHeader: {
            id: requestId,
          },
        },
      });

      if (currentFolio) await this.repositoryFolio.delete(currentFolio.id);

      const savedFolio = await this.repositoryFolio.save({
        base64: folioBase64Uri,
        name: `folio ${req.radicado} ${req.expediente}`,
        requestHeader: req,
      });

      return {
        success: true,
        data: savedFolio,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  async dashboard() {
    try {
      const quejasReparto = await this.repositoryRequestHeader.find({
        where: {
          requestState: {
            stageName: 'Reparto',
          },
          documentalTypeSelected: 'Queja',
        },
      });

      const titles = [
        'Auto Inhibitorio 1952',
        'Auto inicio indagacion previa 1952',
        'AUTO ARCHIVO INDAGACIÓN PREVIA 1952.1',
        'AUTO INICIO INVESTIGACIÓN DISCIPLINARIA 1952.1',
        'AUTO ARCHIVO INVESTIGACIÓN DISCIPLINARIA 1952.1',
        'AUTO CITACION AUDIENCIA Y PLIEGO DE CARGOS 1952.3',
        'AUTO DE CONTROL PREFERENTE 5221',
      ];

      const [
        autosInhibitorios,
        autosInicioIndagacionPrevia,
        autosArchivoIndagacionPrevia,
        autosInicioInvestigacionDisciplinaria,
        autosArchivoInvestigacionDisciplinaria,
        autosCitacionAudiencia,
        autosControlPreferente,
      ]: Array<Documents[]> = await Promise.all(
        titles.map(async (title) => {
          return await this.repositoryDocuments.find({
            where: {
              title: title,
            },
          });
        }),
      );

      return {
        success: true,
        data: {
          quejasReparto,
          autosInhibitorios,
          autosInicioIndagacionPrevia,
          autosArchivoIndagacionPrevia,
          autosInicioInvestigacionDisciplinaria,
          autosArchivoInvestigacionDisciplinaria,
          autosCitacionAudiencia,
          autosControlPreferente,
        },
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  async getAllRequestStages() {
    try {
      const stages = await this.repositoryRequestStage.find();
      return {
        success: true,
        data: stages,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  async getFolio(requestId: string) {
    try {
      const folio = await this.repositoryFolio.findOne({
        where: {
          requestHeader: {
            id: requestId,
          },
        },
      });
      return {
        success: true,
        data: folio,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  async testEmail() {
    await this.notificationsService.sendWhatsapp('3156276006', 'eo');
  }

  async getVariablesForTemplate(templateId: number) {
    try {
      const template: Template = await this.repositoryTemplate.findOne({
        where: {
          id: templateId,
        },
      });

      const globalConfig = (await this.getGlobalConfig()).data;

      const requestFields = getMetadataArgsStorage()
        .columns.filter((column) => {
          if (column.target === RequestHeader) return column;
        })
        .map((column) => column.propertyName);

      const data = {
        request: requestFields,
        template: Object.keys(template).filter((key) => {
          return !!template[key];
        }),
        globalConfig,
      };

      return {
        success: true,
        data,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM, {
    timeZone: 'America/Bogota',
  })
  async alertExpiration() {
    try {
      const requests: RequestHeader[] = (await this.findAll()).data;

      for (const req of requests) {
        const daysToExpire: number = moment(req.expireDate).diff(
          moment(),
          'days',
        );
        if (daysToExpire === req.requestState.previousDays) {
          const recipients = await Promise.all(
            req.requestState.alertRoles.map(async (role) => {
              const user = await this.usersService.getUserByRoleName(
                role.roleName,
              );
              if (!user.success) return;
              return user.data;
            }),
          );

          for (const user of [...recipients, req.agentSelected]) {
            if (!user) continue;
            await this.notificationsService.sendEmail({
              recipient: user.userEmail,
              data: {
                name: user.userName,
                nombreQuejoso: req.nombreSolicitante,
                expireDate: moment(req.expireDate).format('DD/MM/YYYY'),
              },
              templateName: 'alertExpiration',
            });

            await this.observationsService.logObservationOrSystemLog(
              req.id,
              `Se envia email a ${user.userEmail}`,
              null,
              'system',
            );
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM, {
    timeZone: 'America/Bogota',
  })
  async alertState19() {
    try {
      const requests = await this.repositoryRequestHeader.find({
        where: {
          requestState: {
            id: 19,
          },
        },
      });

      const state20 = await this.repositoryRequestState.findOne({
        where: {
          id: 20,
        },
      });

      const reqsToModify: RequestHeader[] = [];
      for (const request of requests) {
        if (moment().diff(moment(request.updatedAt), 'days') === 5) {
          request.recursoApelacion = 'no';
          request.requestState = state20;
          reqsToModify.push(request);
        }
      }

      await this.repositoryRequestHeader.save(reqsToModify);
    } catch (err) {
      console.error(err);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM, {
    timeZone: 'America/Bogota',
  })
  async checkPrescription() {
    try {
      const requests: RequestHeader[] = (await this.findAll()).data;
      const modifiedRequests: RequestHeader[] = [];

      for (const req of requests) {
        if (moment().diff(moment(req.complianceFacts), 'years') >= 5) {
          req.enabled = false;
          modifiedRequests.push(req);
        }
      }

      if (modifiedRequests.length > 0)
        await this.repositoryRequestHeader.save(modifiedRequests);
    } catch (err) {
      console.error(err);
    }
  }

  async notifyDisciplined(notifyDisciplined: NotifyDisciplinedDto) {
    try {
      const { data } = notifyDisciplined;

      for (const documentInfo of data) {
        const doc = await this.repositoryDocuments.findOne({
          where: {
            id: documentInfo.documentId,
          },
        });

        // data:dataType/ext;base64...
        const attachments = await Promise.all(
          documentInfo.attachmentsId.map(async (id) => {
            return await this.repositoryAttachment.findOne({
              where: {
                id: id,
              },
            });
          }),
        );

        for (const recipient of documentInfo.recipients) {
          await this.notificationsService.sendEmail({
            recipient: recipient,
            templateName: 'notifyDisciplined',
            data: {},
            attachments: attachments.map((att) => {
              return {
                content: att.base64.split('base64,')[1],
                encoding: 'base64',
                filename: att.fileName,
              };
            }),
          });

          await this.observationsService.logObservationOrSystemLog(
            attachments?.[0]?.requestHeader?.id,
            `Se envia email a ${recipient}`,
            null,
            'system',
          );
        }

        await this.repositoryDocuments.save({
          ...doc,
          ...documentInfo,
        });
      }

      return {
        success: true,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  async handleOficioOrMemorando(request: RequestHeader) {
    for (const proceedingsNumber of request.proceedingsNumbers) {
      const reqToModify: RequestHeader = (
        await this.getRequestByProceedingsNumber(proceedingsNumber)
      ).data;
      const attachmentsToAdd: Attachment[] = request.attachments
        .filter(
          (att1) =>
            !reqToModify.attachments.find(
              (att2) => att1.fileName === att2.fileName,
            ),
        ) //Filtra para eliminar los attachments existentes
        .map((att) => {
          att.id = undefined;
          return {
            ...att,
            requestHeader: reqToModify,
          };
        });
      await this.repositoryAttachment.save(attachmentsToAdd);
      await this.observationsService.logObservationOrSystemLog(
        reqToModify.id,
        `Debido al ${request.documentalTypeSelected} ${
          request.id
        }, se han agregado los siguientes archivos: ${attachmentsToAdd
          .map((att) => att.fileName)
          .join(', ')}`,
        null,
        'system',
      );
    }
  }

  async testSms(phoneNumber: string) {
    await this.notificationsService.sendSms(
      phoneNumber,
      'Mensaje de prueba desde cid',
    );
  }

  async pendingToNotify() {
    try {
      return await this.repositoryDocuments
        .createQueryBuilder('d')
        .select('COUNT(*), d.title')
        .where(
          '(d.se_comunica_disciplinado = true AND d.fecha_comunicacion_disciplinado IS null) OR (d.se_notifica_disciplinado = true AND d.fecha_notificacion_disciplinado IS null) OR (d.se_comunica_quejoso = true AND d.fecha_comunicacion_quejoso IS null) OR (d.se_notifica_quejoso = true AND d.fecha_notificacion_quejoso IS null) OR (d.se_comunica_apoderado = true AND d.fecha_comunicacion_apoderado IS null) OR (d.se_notifica_apoderado = true AND d.fecha_notificacion_apoderado IS null)',
        )
        .groupBy('d.title')
        .getRawMany();
    } catch (err) {
      console.error(err);
    }
  }

  async communicatedOrNotified() {
    try {
      return await this.repositoryDocuments
        .createQueryBuilder('d')
        .select('COUNT(*), d.title')
        .where(
          '(d.se_comunica_disciplinado = true AND d.fecha_comunicacion_disciplinado IS not null) OR (d.se_notifica_disciplinado = true AND d.fecha_notificacion_disciplinado IS not null) OR (d.se_comunica_quejoso = true AND d.fecha_comunicacion_quejoso IS not null) OR (d.se_notifica_quejoso = true AND d.fecha_notificacion_quejoso IS not null) OR (d.se_comunica_apoderado = true AND d.fecha_comunicacion_apoderado IS not null) OR (d.se_notifica_apoderado = true AND d.fecha_notificacion_apoderado IS not null)',
        )
        .groupBy('d.title')
        .getRawMany();
    } catch (err) {
      console.error(err);
    }
  }

  async pendingToNotifyByTitle(title: string) {
    try {
      return await this.repositoryDocuments.find({
        relations: [
          'requestId',
          'requestId.disciplined',
          'requestId.disciplined.lawyer',
        ],
        where: [
          {
            title,
            seComunicaApoderado: true,
            fechaComunicacionApoderado: IsNull(),
          },
          {
            title,
            seNotificaApoderado: true,
            fechaNotificacionApoderado: IsNull(),
          },
          {
            title,
            seComunicaDisciplinado: true,
            fechaComunicacionDisciplinado: IsNull(),
          },
          {
            title,
            seNotificaDisciplinado: true,
            fechaNotificacionDisciplinado: IsNull(),
          },
          {
            title,
            seComunicaQuejoso: true,
            fechaComunicacionQuejoso: IsNull(),
          },
          {
            title,
            seNotificaQuejoso: true,
            fechaNotificacionQuejoso: IsNull(),
          },
        ],
      });
    } catch (err) {
      console.error(err);
    }
  }

  async communicatedOrNotifiedByTitle(title: string) {
    try {
      return await this.repositoryDocuments.find({
        relations: [
          'requestId',
          'requestId.disciplined',
          'requestId.disciplined.lawyer',
        ],
        where: [
          {
            title,
            seComunicaApoderado: true,
            fechaComunicacionApoderado: Not(IsNull()),
          },
          {
            title,
            seNotificaApoderado: true,
            fechaNotificacionApoderado: Not(IsNull()),
          },
          {
            title,
            seComunicaDisciplinado: true,
            fechaComunicacionDisciplinado: Not(IsNull()),
          },
          {
            title,
            seNotificaDisciplinado: true,
            fechaNotificacionDisciplinado: Not(IsNull()),
          },
          {
            title,
            seComunicaQuejoso: true,
            fechaComunicacionQuejoso: Not(IsNull()),
          },
          {
            title,
            seNotificaQuejoso: true,
            fechaNotificacionQuejoso: Not(IsNull()),
          },
        ],
      });
    } catch (err) {
      console.error(err);
    }
  }

  async attachVoucher(
    requestId: string,
    {
      base64,
      fileName,
      fileType,
      userType,
      userId,
      documentId,
      type,
      date
    }: AttachVoucherDto,
  ) {
    try {
      const req: RequestHeader = await this.repositoryRequestHeader.findOne({
        where: {
          id: requestId,
        },
      });

      const doc: Documents = await this.repositoryDocuments.findOne({
        where: {
          id: documentId,
        },
      });

      await this.repositoryAttachment.save({
        base64,
        fileName,
        fileType,
        requestHeader: req,
      });

      const dateToModify = `fecha${type[0].toUpperCase()}${type.substring(1)}Fisica`;
      if (userType === 'quejoso') {
        doc.communicationsAndNotificationsData.quejoso[dateToModify] = date;
      } else if (userType === 'disciplinado') {
        doc.communicationsAndNotificationsData.disciplinados[userId][dateToModify] = date;
      } else {
        doc.communicationsAndNotificationsData.apoderados[dateToModify] = date;
      }

      //! corregir
      if (type === 'notificacion') {
        if (userType === 'disciplinado') {
          doc.fechaNotificacionDisciplinado = new Date();
        } else if (userType === 'apoderado') {
          doc.fechaNotificacionApoderado = new Date();
        } else if (userType === 'quejoso') {
          doc.fechaNotificacionQuejoso = new Date();
        }
      } else if (type === 'comunicacion') {
        if (userType === 'disciplinado') {
          doc.fechaComunicacionDisciplinado = new Date();
        } else if (userType === 'apoderado') {
          doc.fechaComunicacionApoderado = new Date();
        } else if (userType === 'quejoso') {
          doc.fechaComunicacionQuejoso = new Date();
        }
      }
      //!

      await this.repositoryDocuments.save(doc);

      return {
        success: true,
      }
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: err.message,
      };
    }
  }

  async notifyOrCommunicateWithEmail({
    to,
    requestId,
    type,
    documentId,
    dates,
  }: NotifyOrCommunicateDto) {
    try {
      const request: RequestHeader = await this.repositoryRequestHeader.findOne(
        {
          where: {
            id: requestId,
          },
          relations: ['disciplined', 'disciplined.lawyer'],
        },
      );

      const attachments = await this.repositoryAttachment.find({
        where: {
          requestHeader: {
            id: requestId,
          },
        },
      });

      const dateToModify = `fecha${type[0].toUpperCase()}${type.substring(1)}`; // type = comunicacion o notificacion, dateToModify = fechaComunicacionEmail o fechaNotificacionEmail

      const document = await this.repositoryDocuments.findOne({
        where: {
          id: documentId,
        },
      });

      // const template = await this.notificationsService.findEmailTemplateById(templateId);

      const attachmentsToSend = attachments.map((att) => {
        return {
          content: att.base64.split('base64,')[1],
          encoding: 'base64',
          filename: att.fileName,
        };
      });

      const recipients = [];

      if (to === 'disciplinados') {
        request.disciplined.forEach((d) => {
          if (d.medioAComunicar === 'fisico' || !d.email) return;
          document.communicationsAndNotificationsData.disciplinados[d.id][
            `${dateToModify}Email`
          ] = dates[d.id];
          recipients.push({
            name: d.name,
            email: d.email,
          });
        });
      } else if (to === 'apoderados') {
        request.disciplined.forEach((d) => {
          const l = d.lawyer as Lawyers;
          if (!l || l.medioAComunicar === 'fisico' || !l.publicDefenderEmail) return;
          document.communicationsAndNotificationsData.apoderados[l.id][
            `${dateToModify}Email`
          ] = dates[l.id];
          recipients.push({
            name: l.publicDefenderName,
            email: l.publicDefenderEmail,
          });
        });
      } else if (to === 'quejoso') {
        if (!request.correo) return;
        document.communicationsAndNotificationsData.quejoso[
          `${dateToModify}Email`
        ] = dates.quejoso;
        recipients.push({
          name: request.nombreSolicitante,
          email: request.correo,
        });
      }

      for (const r of recipients) {
        await this.notificationsService.sendEmail({
          recipient: r.email,
          templateName: 'notifyDisciplined',
          data: {
            request,
            recipient: r,
            document,
            type,
          },
          attachments: attachmentsToSend,
        });
      }

      //! corregir
      if (type === 'notificacion') {
        if (to === 'disciplinados') {
          document.fechaNotificacionDisciplinado = new Date();
        } else if (to === 'apoderados') {
          document.fechaNotificacionApoderado = new Date();
        } else if (to === 'quejoso') {
          document.fechaNotificacionQuejoso = new Date();
        }
      } else if (type === 'comunicacion') {
        if (to === 'disciplinados') {
          document.fechaComunicacionDisciplinado = new Date();
        } else if (to === 'apoderados') {
          document.fechaComunicacionApoderado = new Date();
        } else if (to === 'quejoso') {
          document.fechaComunicacionQuejoso = new Date();
        }
      }
      //!

      await this.repositoryDocuments.save(document);

      return {
        success: true,
      };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: err.message,
      };
    }
  }
}
