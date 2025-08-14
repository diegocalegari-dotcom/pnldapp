import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { Teacher, Subject, Eixo } from '../types';
import { ALL_SUBJECTS, SUBJECT_TO_EIXO_MAP } from '../constants';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Card, { CardHeader } from '../components/ui/Card';

const HomePage: React.FC = () => {
  const [name, setName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | ''>('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginOrRegisterTeacher } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !selectedSubject) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await loginOrRegisterTeacher({ name: name.trim(), subject: selectedSubject });
      navigate('/vote');
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl text-slate-800 sm:text-5xl font-normal">
          Bem-vindo(a) ao Sistema de Votação
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          <span className="font-bold">Instituto de Educação Estadual de Maringá</span>
        </p>
        <p className="mt-2 text-md text-slate-500">
          Cadastre-se e participe do processo de escolha interno do Instituto. Escolha a 1ª e 2ª opção de livros didáticos e projetos integradores. O resultado será registrado em ata e informado no sistema do PNLD 2026.
        </p>
      </div>

      <Card>
        <CardHeader>
           <h3 className="text-xl font-semibold text-slate-700">Identificação do(a) Professor(a)</h3>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
              Nome Completo
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome completo"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">
              Matéria Principal que Leciona
            </label>
            <Select
              id="subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as Subject)}
              required
              disabled={isLoading}
            >
              <option value="" disabled>Selecione uma matéria</option>
              {ALL_SUBJECTS.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </Select>
             <p className="mt-2 text-xs text-slate-500">
                Se já possui cadastro, insira seu nome completo para fazer login. Caso contrário, seus dados serão usados para o cadastro.
            </p>
          </div>
          
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="pt-2">
            <Button type="submit" className="w-full justify-center" disabled={isLoading}>
              {isLoading ? 'Processando...' : 'Entrar / Cadastrar'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default HomePage;
