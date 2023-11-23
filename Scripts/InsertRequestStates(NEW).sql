DELETE FROM public.documents;
DELETE FROM public.attachment;
DELETE FROM public.folio;
DELETE FROM public.request_disciplined;
DELETE FROM public."requestObservations";
DELETE FROM public.request_header;
DELETE FROM public."requestState";

INSERT INTO
    public."requestState" (id, "stateName", "stageName")
VALUES (
        1,
        'Recepcionar solicitud',
        'Reparto'
    ), (
        2,
        'Recibir, verificar y asignar la solicitud',
        'Reparto'
    ), (
        3,
        'Analizar la queja, anónimo, informe y/o publicación respectiva',
        'Reparto'
    ), (
        4,
        'Realizar Auto Inhibitorio, memorando y/o oficio',
        'Reparto'
    ), (
        5,
        'Revisar y aprobar auto inhibitorio y memorando y/o oficio',
        'Reparto'
    ), (
        6,
        'Comunicar al quejoso',
        'Inhibitorio'
    ), (
        7,
        'Archivar documentos al expediente',
        'Archivo'
    ), (
        8,
        'Realizar auto y comunicado de inicio de indagación previa',
        'Reparto'
    ), (
        9,
        'Revisar y aprobar auto y comunicado de indagación previa',
        'Reparto'
    ), (
        10,
        'Comunicar al quejoso o informante',
        'Indagación previa'
    ), (
        11,
        'Solicitar, recaudar y analizar pruebas',
        'TBD'
    ), (
        12,
        'Revisar y aprobar documentos de pruebas',
        'TBD'
    ), (
        13,
        'Enviar y recibir documentos de pruebas',
        'TBD'
    ), (
        14,
        'Elaborar auto de archivo, oficio y memorando',
        'TBD'
    ), (
        15,
        'Revisar y aprobar documentos de archivo de indagación previa',
        'TBD'
    ), (
        16,
        'Comunicar al quejoso o informante',
        'TBD'
    ), (
        17,
        'Archivar, escanear e indexar los documentos al expediente',
        'TBD'
    ), (
        18,
        'Realizar constancia ejecutoria',
        'TBD'
    ), (
        19,
        'Elaborar auto de inicio de investigación disciplinaria, oficios y memorandos',
        'TBD'
    ), (
        20,
        'Revisar y aprobar documentos de inicio de investigación disciplinaria',
        'TBD'
    ), (
        21,
        'Notificar el auto de inicio y de vinculación a la investigación disciplinaria',
        'TBD'
    ), (
        22,
        'Solicitar y recaudar pruebas',
        'TBD'
    ), (
        23,
        'Revisar y aprobar documentos de pruebas',
        'TBD'
    ), (
        24,
        'Proferir auto de cierre de investigación y alegatos precalificatorios',
        'TBD'
    ), (
        25,
        'Revisar y aprobar auto de cierre de investigación y alegatos precalificatorios',
        'TBD'
    ), (
        26,
        'Notificar a sujetos procesales',
        'TBD'
    ), (
        27,
        'Realizar constancia secretarial',
        'TBD'
    ), (
        28,
        'Proferir pliego de cargos',
        'TBD'
    ), (
        29,
        'Revisar y aprobar auto de cargos',
        'TBD'
    ), (
        30,
        'Notificar al disciplinado y/o apoderado',
        'TBD'
    ), (
        31,
        'Archivar documentos al expediente',
        'TBD'
    ), (
        32,
        'Enviar auto a director de juzgamiento',
        'TBD'
    ), (
        33,
        'Recepcionar recurso de apelación',
        'TBD'
    ), (
        34,
        'Elaborar constancia secretarial',
        'TBD'
    ), (
        35,
        'Archivar documentos al expediente',
        'TBD'
    ), (
        36,
        'Elaborar auto remisorio',
        'TBD'
    ), (
        37,
        'Elaborar memorando',
        'TBD'
    ), (
        38,
        'Revisar y aprobar auto y memorando remisorio',
        'TBD'
    ), (
        39,
        'Iniciar trámite de confesión',
        'TBD'
    ), (
        40,
        'Solicitar y asignar abogado de oficio para diligencia de confesión',
        'TBD'
    ), (
        41,
        'Revisar y aprobar documentos de asignación de abogado de oficio',
        'TBD'
    ), (
        42,
        'Comparecer a la asignación',
        'TBD'
    ), (
        43,
        'Revisar y aprobar auto de reconocimiento de personería jurídica',
        'TBD'
    ), (
        44,
        'Recepcionar y valorar la confesión',
        'TBD'
    ), (
        45,
        'Enviar auto a director de juzgamiento',
        'TBD'
    ), (
        46,
        'Elaborar auto de archivo de investigación disciplinaria, oficios y memorandos',
        'TBD'
    ), (
        47,
        'Revisar y aprobar documentos de archivo de investigación disciplinaria',
        'TBD'
    ), (
        48,
        'Notificar archivo de investigación disciplinaria',
        'TBD'
    ), (
        49,
        'Archivar documentos al expediente',
        'TBD'
    ), (
        50,
        'Realizar constancia secretarial',
        'TBD'
    ), (
        51,
        'Archivar documentos al expediente',
        'TBD'
    ), (
        52,
        'Recepcionar recurso de apelación',
        'TBD'
    ), (
        53,
        'Elaborar constancia secretarial',
        'TBD'
    ), (
        54,
        'Archivar documentos al expediente',
        'TBD'
    ), (
        55,
        'Elaborar auto remisorio',
        'TBD'
    ), (
        56,
        'Elaborar memorando',
        'TBD'
    ), (
        57,
        'Revisar y aprobar auto y memorando remisorio',
        'TBD'
    ), (
        58,
        'Realizar auto de cumplimiento de segunda instancia',
        'TBD'
    ), (
        59,
        'Revisar y aprobar auto de cumplimiento de segunda instancia',
        'TBD'
    ), (
        60,
        'Realizar constancia ejecutoria',
        'TBD'
    ), (
        61,
        'Archivar documentos al expediente',
        'TBD'
    ), (
        62,
        'Realizar constancia secretarial',
        'TBD'
    );