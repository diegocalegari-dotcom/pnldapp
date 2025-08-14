import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext.ts';
import { Eixo, Book, Teacher } from '../types.ts';
import { BOOK_DATA } from '../constants.ts';
import Card, { CardHeader } from '../components/ui/Card.tsx';
import Button from '../components/ui/Button.tsx';

type ReportType = 'consolidated' | 'individual';

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ReportType>('consolidated');
  const { fetchAllTeachers } = useAppContext();
  
  useEffect(() => {
      fetchAllTeachers();
  }, [fetchAllTeachers]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="print-hidden">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Relatórios de Votação</h2>
        <p className="text-slate-600 mb-8">Visualize os resultados consolidados por eixo ou os votos individuais de cada professor.</p>
        <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
                onClick={() => setActiveTab('consolidated')}
                className={`${
                activeTab === 'consolidated'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
                Relatório Consolidado
            </button>
            <button
                onClick={() => setActiveTab('individual')}
                className={`${
                activeTab === 'individual'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
                Relatório Individual
            </button>
            </nav>
        </div>
      </div>
      
      <div>
        {activeTab === 'consolidated' && <ConsolidatedReport />}
        {activeTab === 'individual' && <IndividualReport />}
      </div>
    </div>
  );
};

const ConsolidatedReport: React.FC = () => {
  const { teachers } = useAppContext();

  const allBooks = useMemo(() => {
    const bookMap = new Map<string, Book>();
    Object.values(BOOK_DATA).forEach(eixoData => {
        [...eixoData.textbooks, ...eixoData.projects].forEach(book => {
            bookMap.set(book.code, book);
        });
    });
    return bookMap;
  }, []);

  const reportData = useMemo(() => {
    const results: Record<Eixo, any> = {
        [Eixo.HUMANAS]: { textbook1: {}, textbook2: {}, project1: {}, project2: {} },
        [Eixo.NATUREZA]: { textbook1: {}, textbook2: {}, project1: {}, project2: {} },
        [Eixo.LINGUAGENS]: { textbook1: {}, textbook2: {}, project1: {}, project2: {} },
        [Eixo.MATEMATICA]: { textbook1: {}, textbook2: {}, project1: {}, project2: {} },
        [Eixo.COMPUTACAO]: { textbook1: {}, textbook2: {}, project1: {}, project2: {} },
    };

    teachers.forEach(teacher => {
        if (teacher.vote) {
            const eixoResult = results[teacher.eixo];
            const { textbook1, textbook2, project1, project2 } = teacher.vote;
            eixoResult.textbook1[textbook1] = (eixoResult.textbook1[textbook1] || 0) + 1;
            eixoResult.textbook2[textbook2] = (eixoResult.textbook2[textbook2] || 0) + 1;
            eixoResult.project1[project1] = (eixoResult.project1[project1] || 0) + 1;
            eixoResult.project2[project2] = (eixoResult.project2[project2] || 0) + 1;
        }
    });

    const findWinner = (votes: Record<string, number>): { book: Book | null; votes: number } => {
        const sorted = Object.entries(votes).sort((a, b) => b[1] - a[1]);
        if (sorted.length === 0) return { book: null, votes: 0 };
        const winnerCode = sorted[0][0];
        return { book: allBooks.get(winnerCode) || null, votes: sorted[0][1] };
    };

    return Object.entries(results).map(([eixo, votes]) => ({
      eixo: eixo as Eixo,
      textbook1: findWinner(votes.textbook1),
      textbook2: findWinner(votes.textbook2),
      project1: findWinner(votes.project1),
      project2: findWinner(votes.project2),
    }));
  }, [teachers, allBooks]);

  return (
    <>
      <div className="flex justify-end mb-4 print-hidden">
        <Button onClick={() => window.print()}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
            </svg>
            Imprimir Relatório
        </Button>
      </div>
      <div className="space-y-8">
        {reportData.map(({ eixo, textbook1, textbook2, project1, project2 }) => (
          <Card key={eixo} className="print-no-break print-card">
            <CardHeader>
              <h3 className="text-xl font-bold text-indigo-700">{eixo}</h3>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <ReportItem title="1ª Opção - Livro Didático" book={textbook1.book} votes={textbook1.votes} />
              <ReportItem title="2ª Opção - Livro Didático" book={textbook2.book} votes={textbook2.votes} />
              <ReportItem title="1ª Opção - Projeto Integrador" book={project1.book} votes={project1.votes} />
              <ReportItem title="2ª Opção - Projeto Integrador" book={project2.book} votes={project2.votes} />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

const ReportItem: React.FC<{ title: string; book: Book | null; votes: number }> = ({ title, book, votes }) => (
  <div>
    <h4 className="font-semibold text-slate-600">{title}</h4>
    {book ? (
      <>
        <p className="text-lg text-slate-800">{book.title}</p>
        <p className="text-sm text-slate-500">{book.publisher} - Código: {book.code}</p>
        <p className="text-sm font-bold text-indigo-600">{votes} voto(s)</p>
      </>
    ) : (
      <p className="text-slate-500">Nenhum voto registrado.</p>
    )}
  </div>
);

const IndividualReport: React.FC = () => {
    const { teachers } = useAppContext();
    const allBooks = useMemo(() => {
        const bookMap = new Map<string, Book>();
        Object.values(BOOK_DATA).forEach(eixoData => {
            [...eixoData.textbooks, ...eixoData.projects].forEach(book => {
                bookMap.set(book.code, book);
            });
        });
        return bookMap;
    }, []);

    if (teachers.length === 0) {
        return <Card><p className="text-center text-slate-500">Nenhum professor cadastrado para exibir relatórios.</p></Card>
    }

    return (
        <>
            <div className="flex justify-end mb-4 print-hidden">
                <Button onClick={() => window.print()}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                    </svg>
                    Imprimir Relatório
                </Button>
            </div>
            <div className="space-y-6">
                {teachers.map(teacher => (
                    <Card key={teacher.id} className="print-no-break print-card">
                        <CardHeader className="flex justify-between items-center">
                            <div>
                            <h3 className="text-lg font-bold text-slate-800">{teacher.name}</h3>
                            <p className="text-sm text-slate-500">{teacher.eixo}</p>
                            </div>
                            {teacher.vote ? 
                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">VOTO REGISTRADO</span> :
                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">VOTO PENDENTE</span>
                            }
                        </CardHeader>
                        {teacher.vote ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <VoteDetail title="1ª Opção - Livro Didático" book={allBooks.get(teacher.vote.textbook1)} />
                                <VoteDetail title="2ª Opção - Livro Didático" book={allBooks.get(teacher.vote.textbook2)} />
                                <VoteDetail title="1ª Opção - Projeto Integrador" book={allBooks.get(teacher.vote.project1)} />
                                <VoteDetail title="2ª Opção - Projeto Integrador" book={allBooks.get(teacher.vote.project2)} />
                            </div>
                        ) : (
                            <p className="text-center text-slate-500 py-4">Este professor ainda não registrou seu voto.</p>
                        )}
                    </Card>
                ))}
            </div>
        </>
    )
}

const VoteDetail: React.FC<{title: string, book?: Book}> = ({title, book}) => (
    <div className="bg-slate-50 p-3 rounded-md">
        <h4 className="text-sm font-semibold text-slate-600">{title}</h4>
        {book ? (
            <p className="text-slate-800">{book.title} ({book.code})</p>
        ) : (
            <p className="text-slate-500">-</p>
        )}
    </div>
);


export default ReportsPage;
