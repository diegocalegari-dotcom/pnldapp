import { Subject, Eixo, Book } from './types';

export const ALL_SUBJECTS: Subject[] = Object.values(Subject);

export const SUBJECT_TO_EIXO_MAP: Map<Subject, Eixo> = new Map([
  [Subject.FILOSOFIA, Eixo.HUMANAS],
  [Subject.SOCIOLOGIA, Eixo.HUMANAS],
  [Subject.HISTORIA, Eixo.HUMANAS],
  [Subject.GEOGRAFIA, Eixo.HUMANAS],
  [Subject.PROJETO_VIDA, Eixo.HUMANAS],
  [Subject.BIOLOGIA, Eixo.NATUREZA],
  [Subject.FISICA, Eixo.NATUREZA],
  [Subject.QUIMICA, Eixo.NATUREZA],
  [Subject.ARTE, Eixo.LINGUAGENS_1],
  [Subject.PORTUGUES, Eixo.LINGUAGENS_1],
  [Subject.REDACAO, Eixo.LINGUAGENS_1],
  [Subject.INGLES, Eixo.LINGUAGENS_2],
  [Subject.EDUCACAO_FISICA, Eixo.LINGUAGENS_3],
  [Subject.MATEMATICA, Eixo.MATEMATICA],
  [Subject.PROGRAMACAO, Eixo.COMPUTACAO],
  [Subject.PENSAMENTO_COMPUTACIONAL, Eixo.COMPUTACAO],
]);

const LINGUAGENS_PROJECTS: Book[] = [
    { code: '0054P260102201000', title: 'LINGUAGENS EM MOVIMENTO', publisher: 'Editora FTD S.A.' },
    { code: '0055P260102201000', title: 'HORIZONTES - LINGUAGENS', publisher: 'Editora FTD S.A.' },
    { code: '0089P260102201000', title: 'IDENTIDADE SARAIVA - Projetos Integradores', publisher: 'SARAIVA EDUCACAO S.A.' },
    { code: '0154P260102201000', title: 'Linguagens em projetos integradores', publisher: 'FENIX LIVRARIA E DISTRIBUIDORA DE LIVROS - EIRELI' },
];

export const BOOK_DATA: Record<string, { textbooks: Book[]; projects: Book[] }> = {
  [Eixo.HUMANAS]: {
    textbooks: [
        { code: '0018P260101204816', title: 'MODERNA PLUS', publisher: 'Editora Moderna Ltda' },
        { code: '0019P260101204816', title: 'MODERNA SuperAÇÃO!', publisher: 'Editora Moderna Ltda' },
        { code: '0047P260101204816', title: 'FILOSOFIA, SOCIOLOGIA, HISTÓRIA, GEOGRAFIA_POR TODA PARTE', publisher: 'Editora FTD S.A.' },
        { code: '0072P260101204816', title: 'INTERAÇÃO CIÊNCIAS HUMANAS E SOCIAIS APLICADAS', publisher: 'EDITORA DO BRASIL SA' },
        { code: '0103P260101204816', title: 'SER PROTAGONISTA CIÊNCIAS HUMANAS E SOCIAIS APLICADAS', publisher: 'EDIÇÕES SM LTDA' },
        { code: '0113P260101204816', title: 'DO SEU JEITO', publisher: 'EDITORA ATICA S.A.' },
        { code: '0165P260101204816', title: 'ESTUDOS E DEBATES EM HISTÓRIA_GEOGRAFIA_FILOSOFIA_SOCIOLOGIA', publisher: 'FOLIA DE LETRAS EDITORA E SERVICOS EDITORAIS LTDA' }
    ],
    projects: [
      { code: '0023P260102204000', title: 'MODERNA EM PROJETOS: Ciências Humanas', publisher: 'Editora Moderna Ltda' },
      { code: '0060P260102204000', title: 'HORIZONTES - CIÊNCIAS HUMANAS', publisher: 'Editora FTD S.A.' },
      { code: '0061P260102204000', title: 'CIÊNCIAS HUMANAS EM MOVIMENTO', publisher: 'Editora FTD S.A.' },
      { code: '0079P260102204000', title: 'INTERAÇÃO PROJETOS INTEGRADORES - CIÊNCIAS HUMANAS E SOCIAIS APLICADAS', publisher: 'EDITORA DO BRASIL SA' },
      { code: '0114P260102204000', title: 'DO SEU JEITO', publisher: 'EDITORA ATICA S.A.' },
    ],
  },
  [Eixo.NATUREZA]: {
    textbooks: [
        { code: '0016P260101203815', title: 'MODERNA PLUS', publisher: 'Editora Moderna Ltda' },
        { code: '0017P260101203815', title: 'MODERNA SuperAÇÃO!', publisher: 'Editora Moderna Ltda' },
        { code: '0040P260101203815', title: '360°_QUÍMICA, FÍSICA, BIOLOGIA', publisher: 'Editora FTD S.A.' },
        { code: '0041P260101203815', title: 'QUÍMICA, FÍSICA, BIOLOGIA_POR TODA PARTE', publisher: 'Editora FTD S.A.' },
        { code: '0069P260101203815', title: 'INTERAÇÃO CIÊNCIAS DA NATUREZA E SUAS TECNOLOGIAS', publisher: 'EDITORA DO BRASIL SA' },
        { code: '0080P260101203815', title: 'CIÊNCIA VIVA', publisher: 'EDITORA SCIPIONE S.A.' },
        { code: '0087P260101203815', title: 'IDENTIDADE SARAIVA', publisher: 'SARAIVA EDUCACAO S.A.' },
        { code: '0100P260101203815', title: 'SER PROTAGONISTA CIÊNCIAS DA NATUREZA E SUAS TECNOLOGIAS', publisher: 'EDIÇÕES SM LTDA' },
        { code: '0112P260101203815', title: 'DO SEU JEITO', publisher: 'EDITORA ATICA S.A.' }
    ],
    projects: [
      { code: '0022P260102203000', title: 'MODERNA EM PROJETOS: Ciências da Natureza', publisher: 'Editora Moderna Ltda' },
      { code: '0059P260102203000', title: 'CIÊNCIAS DA NATUREZA EM MOVIMENTO', publisher: 'Editora FTD S.A.' },
      { code: '0078P260102203000', title: 'INTERAÇÃO PROJETOS INTEGRADORES - CIÊNCIAS DA NATUREZA E SUAS TECNOLOGIAS', publisher: 'EDITORA DO BRASIL SA' },
      { code: '0156P260102203000', title: 'Ciências da Natureza em projetos integradores', publisher: 'FENIX LIVRARIA E DISTRIBUIDORA DE LIVROS - EIRELI' },
    ],
  },
  [Eixo.LINGUAGENS_1]: {
    textbooks: [
        { code: '0002P260101218810', title: 'MODERNA EM AÇÃO', publisher: 'Editora Moderna Ltda' },
        { code: '0003P260101218810', title: 'MODERNA SuperAÇÃO!', publisher: 'Editora Moderna Ltda' },
        { code: '0004P260101218810', title: 'MODERNA PLUS', publisher: 'Editora Moderna Ltda' },
        { code: '0024P260101218810', title: '360°_LÍNGUA PORTUGUESA, REDAÇÃO, ARTE', publisher: 'Editora FTD S.A.' },
        { code: '0025P260101218810', title: 'LÍNGUA PORTUGUESA, REDAÇÃO, ARTE_POR TODA PARTE', publisher: 'Editora FTD S.A.' },
        { code: '0062P260101218810', title: 'INTERAÇÃO LINGUAGENS E SUAS TECNOLOGIAS', publisher: 'EDITORA DO BRASIL SA' },
        { code: '0081P260101218810', title: 'IDENTIDADE SARAIVA', publisher: 'SARAIVA EDUCACAO S.A.' },
        { code: '0092P260101218810', title: 'SER PROTAGONISTA LINGUAGENS E SUAS TECNOLOGIAS', publisher: 'EDIÇÕES SM LTDA' },
        { code: '0109P260101218810', title: 'DO SEU JEITO', publisher: 'EDITORA ATICA S.A.' },
        { code: '0120P260101218810', title: 'ENTRE SABERES: LINGUAGENS E SUAS TECNOLOGias', publisher: 'PALAVRAS PROJETOS EDITORIAIS LTDA' }
    ],
    projects: LINGUAGENS_PROJECTS,
  },
  [Eixo.LINGUAGENS_2]: {
    textbooks: [
        { code: '0005P260101219811', title: 'MODERNA EM AÇÃO - Inglês', publisher: 'Editora Moderna Ltda' },
        { code: '0007P260101219811', title: 'MODERNA PLUS - Inglês', publisher: 'Editora Moderna Ltda' },
        { code: '0030P260101219811', title: 'JOY!', publisher: 'Editora FTD S.A.' },
        { code: '0031P260101219811', title: 'WAYS - ENGLISH FOR LIFE', publisher: 'Editora FTD S.A.' },
        { code: '0095P260101219811', title: 'DOME', publisher: 'EDIÇÕES SM LTDA' },
        { code: '0121P260101219811', title: 'ENTRE SABERES: LINGUAGENS E SUAS TECNOLOGIAS (INGLÊS)', publisher: 'PALAVRAS PROJETOS EDITORIAIS LTDA' },
        { code: '0140P260101219811', title: 'No Borders: English for Brazilian students', publisher: 'MVC EDITORA LTDA' }
    ],
    projects: LINGUAGENS_PROJECTS,
  },
  [Eixo.LINGUAGENS_3]: {
    textbooks: [
        { code: '0011P260101220812', title: 'MODERNA SuperAÇÃO! Educação Física', publisher: 'Editora Moderna Ltda' },
        { code: '0034P260101220812', title: '360° EDUCAÇÃO FÍSICA', publisher: 'Editora FTD S.A.' },
        { code: '0035P260101220812', title: 'EDUCAÇÃO FÍSICA POR TODA PARTE', publisher: 'Editora FTD S.A.' },
        { code: '0084P260101220812', title: 'IDENTIDADE SARAIVA', publisher: 'SARAIVA EDUCACAO S.A.' }
    ],
    projects: LINGUAGENS_PROJECTS,
  },
  [Eixo.MATEMATICA]: {
    textbooks: [
        { code: '0013P260101202814', title: 'MODERNA PLUS - Matemática Paiva', publisher: 'Editora Moderna Ltda' },
        { code: '0014P260101202814', title: 'MODERNA SuperAÇÃO! Matemática', publisher: 'Editora Moderna Ltda' },
        { code: '0015P260101202814', title: 'MODERNA EM AÇÃO - Matemática', publisher: 'Editora Moderna Ltda' },
        { code: '0038P260101202814', title: '360° MATEMÁTICA', publisher: 'Editora FTD S.A.' },
        { code: '0039P260101202814', title: 'MATEMÁTICA POR TODA PARTE', publisher: 'Editora FTD S.A.' },
        { code: '0068P260101202814', title: 'INTERAÇÃO MATEMÁTICA E SUAS TECNOLOGIAS', publisher: 'EDITORA DO BRASIL SA' },
        { code: '0086P260101202814', title: 'IDENTIDADE SARAIVA', publisher: 'SARAIVA EDUCACAO S.A.' },
        { code: '0099P260101202814', title: 'SER PROTAGONISTA MATEMÁTICA E SUAS TECNOLOGIAS', publisher: 'EDIÇÕES SM LTDA' },
        { code: '0111P260101202814', title: 'DO SEU JEITO', publisher: 'EDITORA ATICA S.A.' },
        { code: '0118P260101202814', title: 'Integrando Saberes Matemática', publisher: 'UNIVERSO DA LITERATURA EDITORA LTDA' },
        { code: '0122P260101202814', title: 'ENTRE SABERES: MATEMÁTICA E SUAS TECNOLOGIAS', publisher: 'PALAVRAS PROJETOS EDITORIAIS LTDA' },
        { code: '0131P260101202814', title: 'Nos dias de hoje', publisher: 'Editora Sei Ltda' }
    ],
    projects: [
      { code: '0021P260102202000', title: 'MODERNA EM PROJETOS: Matemática', publisher: 'Editora Moderna Ltda' },
      { code: '0077P260102202000', title: 'INTERAÇÃO PROJETOS INTEGRADORES - MATEMÁTICA E SUAS TECNOLOGIAS', publisher: 'EDITORA DO BRASIL SA' },
      { code: '0090P260102202000', title: 'IDENTIDADE SARAIVA - Projetos Integradores', publisher: 'SARAIVA EDUCACAO S.A.' },
      { code: '0150P260102202000', title: 'Projetos Integradores: Tempo Jovem', publisher: 'Kits Editora Comércio e Indústria Ltda' },
    ],
  },
 [Eixo.COMPUTACAO]: {
    textbooks: [
        { code: '0012P260101201813', title: 'MODERNA PLUS - Educação Digital', publisher: 'Editora Moderna Ltda' },
        { code: '0036P260101201813', title: 'EDUCAÇÃO DIGITAL POR TODA PARTE', publisher: 'Editora FTD S.A.' },
        { code: '0037P260101201813', title: '360° EDUCAÇÃO DIGITAL', publisher: 'Editora FTD S.A.' },
        { code: '0067P260101201813', title: 'INTERAÇÃO EDUCAÇÃO DIGITAL', publisher: 'EDITORA DO BRASIL SA' },
        { code: '0085P260101201813', title: 'IDENTIDADE SARAIVA', publisher: 'SARAIVA EDUCACAO S.A.' },
        { code: '0098P260101201813', title: 'SER PROTAGONISTA EDUCAÇÃO DIGITAL', publisher: 'EDIÇÕES SM LTDA' },
        { code: '0108P260101201813', title: 'Saberes da Educação Digital', publisher: 'Terra Sul Editora EIRELI' },
        { code: '0116P260101201813', title: 'Educação Digital: Por Dentro da Matrix', publisher: 'Editora Immanuel Kant Ltda' },
        { code: '0135P260101201813', title: 'MUNDO DIGITAL - MODO DE USAR', publisher: 'EDITORA AJS LTDA.' },
        { code: '0163P260101201813', title: 'Consciência: uma jornada pela Educação Digital', publisher: 'PROSA NOVA EDITORA DE LIVROS LTDA' },
    projects: [
      { code: '0012P260101201813', title: 'MODERNA PLUS - Educação Digital', publisher: 'Editora Moderna Ltda' },
      { code: '0036P260101201813', title: 'EDUCAÇÃO DIGITAL POR TODA PARTE', publisher: 'Editora FTD S.A.' },
      { code: '0037P260101201813', title: '360° EDUCAÇÃO DIGITAL', publisher: 'Editora FTD S.A.' },
      { code: '0067P260101201813', title: 'INTERAÇÃO EDUCAÇÃO DIGITAL', publisher: 'EDITORA DO BRASIL SA' },
      { code: '0085P260101201813', title: 'IDENTIDADE SARAIVA', publisher: 'SARAIVA EDUCACAO S.A.' },
      { code: '0098P260101201813', title: 'SER PROTAGONISTA EDUCAÇÃO DIGITAL', publisher: 'EDIÇÕES SM LTDA' },
      { code: '0108P260101201813', title: 'Saberes da Educação Digital', publisher: 'Terra Sul Editora EIRELI' },
      { code: '0116P260101201813', title: 'Educação Digital: Por Dentro da Matrix', publisher: 'Editora Immanuel Kant Ltda' },
      { code: '0135P260101201813', title: 'MUNDO DIGITAL - MODO DE USAR', publisher: 'EDITORA AJS LTDA.' },
      { code: '0163P260101201813', title: 'Consciência: uma jornada pela Educação Digital', publisher: 'PROSA NOVA EDITORA DE LIVROS LTDA' },
    ],
  },
};