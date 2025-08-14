
export enum Eixo {
  HUMANAS = 'Ciências Humanas e Sociais Aplicadas',
  NATUREZA = 'Ciências da Natureza e suas Tecnologias',
  LINGUAGENS = 'Linguagens e suas Tecnologias',
  MATEMATICA = 'Matemática e suas Tecnologias',
  COMPUTACAO = 'Programação e Pensamento Computacional',
}

export enum Subject {
  ARTE = 'Arte',
  BIOLOGIA = 'Biologia',
  GEOGRAFIA = 'Geografia',
  HISTORIA = 'História',
  FILOSOFIA = 'Filosofia',
  SOCIOLOGIA = 'Sociologia',
  INGLES = 'Língua Inglesa',
  PORTUGUES = 'Língua Portuguesa',
  MATEMATICA = 'Matemática',
  FISICA = 'Física',
  QUIMICA = 'Química',
  PROJETO_VIDA = 'Projetos de Vida',
  PENSAMENTO_COMPUTACIONAL = 'Pensamento Computacional',
  PROGRAMACAO = 'Programação',
  EDUCACAO_FISICA = 'Educação Física',
}

export interface Book {
  code: string;
  title: string;
  publisher: string;
}

export interface Vote {
  textbook1: string; // book code
  textbook2: string; // book code
  project1: string; // book code
  project2: string; // book code
}

export interface Teacher {
  id: string;
  name: string;
  subjects: Subject[];
  eixo: Eixo;
  vote?: Vote;
}
