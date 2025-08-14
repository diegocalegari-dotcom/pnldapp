import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext.ts';
import { BOOK_DATA } from '../constants.ts';
import BookSelectionTable from '../components/BookSelectionTable.tsx';
import Button from '../components/ui/Button.tsx';
import Card, { CardHeader } from '../components/ui/Card.tsx';

const VotePage: React.FC = () => {
  const { loggedInTeacher, submitVote } = useAppContext();
  const navigate = useNavigate();

  const [textbook1, setTextbook1] = useState<string | null>(loggedInTeacher?.vote?.textbook1 || null);
  const [textbook2, setTextbook2] = useState<string | null>(loggedInTeacher?.vote?.textbook2 || null);
  const [project1, setProject1] = useState<string | null>(loggedInTeacher?.vote?.project1 || null);
  const [project2, setProject2] = useState<string | null>(loggedInTeacher?.vote?.project2 || null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!loggedInTeacher) {
    navigate('/');
    return null;
  }
  
  const hasVoted = !!loggedInTeacher.vote;
  const eixoBooks = BOOK_DATA[loggedInTeacher.eixo];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textbook1 || !textbook2 || !project1 || !project2) {
      setMessage('Erro: Todas as quatro opções (1ª e 2ª para cada categoria) devem ser selecionadas.');
      return;
    }
    
    setIsLoading(true);
    setMessage('');

    try {
      await submitVote(loggedInTeacher.id, { textbook1, textbook2, project1, project2 });
      setMessage('Voto registrado com sucesso! Redirecionando...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setMessage('Ocorreu um erro ao salvar seu voto. Tente novamente.');
      setIsLoading(false);
    }
  };
  
  const formIsComplete = textbook1 && textbook2 && project1 && project2;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800">Página de Votação</h2>
        <p className="mt-2 text-lg text-slate-600">
          Eixo: <span className="font-semibold text-indigo-600">{loggedInTeacher.eixo}</span>
        </p>
      </div>

       {hasVoted && !isLoading && (
         <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
           <p className="font-bold">Voto já registrado!</p>
           <p>Você pode alterar suas escolhas e salvar novamente.</p>
         </div>
       )}

      <fieldset disabled={isLoading} className="contents">
        <Card>
            <CardHeader>
              <h3 className="text-xl font-bold">Escolha de Livros Didáticos e Projetos Integradores</h3>
              <p className="text-sm text-slate-500 mt-1">Selecione a 1ª e a 2ª opção para cada uma das categorias abaixo.</p>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <BookSelectionTable
                title="Livro Didático"
                books={eixoBooks.textbooks}
                selection1={textbook1}
                selection2={textbook2}
                onSelect1={setTextbook1}
                onSelect2={setTextbook2}
              />

              <BookSelectionTable
                title="Projetos Integradores"
                books={eixoBooks.projects}
                selection1={project1}
                selection2={project2}
                onSelect1={setProject1}
                onSelect2={setProject2}
              />

              {message && <p className={`text-sm ${message.includes('Erro') ? 'text-red-600' : 'text-green-600'} mb-4`}>{message}</p>}

              <div className="mt-6 flex justify-end">
                <Button type="submit" disabled={!formIsComplete || isLoading}>
                  {isLoading ? 'Salvando...' : (hasVoted ? 'Atualizar Voto' : 'Salvar Voto')}
                </Button>
              </div>
            </form>
        </Card>
      </fieldset>
    </div>
  );
};

export default VotePage;
