export class DisciplinedDto {
  resultado: string;
  mensaje: string;
  empleado: EmpleadoDto;
}

export class AcumuladoPagadoDto {}

export class PeriodosVacacionalesDto {}

export class EmpleadoDto {
  codigo: string;
  cedula: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  planilla: string;
  gradoNombre: string;
  fechaIngreso: string;
  tipoVinculacion: string;
  tipoContrato: string;
  sueldoMensual: number;
  direccionResid: string;
  ciudadResid: string;
  codCiudadResid: number;
  codDptoResid: number;
  nombreDptoResid: string;
  telefonos: number;
  email: string;
  codSociedad: number;
  nombreSociedad: string;
  codConvencion: number;
  nombreConvencion: string;
  codEmpresa: number;
  codEstDos: number;
  codEstTres: number;
  codEstCuatro: number;
  codEstCinco: number;
  codEstSeis: number;
  codCentroCostos: number;
  periodosVacacionales: PeriodosVacacionalesDto[];
  acumuladosPagados: AcumuladoPagadoDto[];
}
