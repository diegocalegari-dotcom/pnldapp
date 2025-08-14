import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import Button from '../components/ui/Button';
import Card, { CardHeader } from '../components/ui/Card';
import { Teacher } from '../types';

const AdminDashboardPage: React.FC = () => {
  const { teachers, resetVotes, resetAll, deleteTeacher, fetchAllTeachers } = useAppContext();
  const navigate = useNavigate();
  const [confirmAction, setConfirmAction] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  useEffect(() => {
    // Garante que os dados dos professores sejam "buscados" ao carregar a página.
    fetchAllTeachers();
  }, [fetchAllTeachers]);

  const handleAction = async (action: () => Promise<void>, message: string) => {
    if (confirmAction === message) {
      setLoadingAction(message);
      try {
        await action();
      } catch (error) {
        console.error("Action failed", error);
        // Opcional: Adicionar feedback de erro para o usuário
      } finally {
        setConfirmAction(null);
        setLoadingAction(null);
      }
    } else {
      setConfirmAction(message);
    }
  };

  const teachersWithVotes = teachers.filter(t => t.vote).length;
  const totalTeachers = teachers.length;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">Painel Administrativo</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="text-center">
          <p className="text-4xl font-bold text-indigo-600">{totalTeachers}</p>
          <p className="text-slate-500">Professores Cadastrados</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-indigo-600">{teachersWithVotes}</p>
          <p className="text-slate-500">Votos Registrados</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-indigo-600">{totalTeachers > 0 ? `${Math.round((teachersWithVotes / totalTeachers) * 100)}%` : '0%'}</p>
          <p className="text-slate-500">Participação</p>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <h3 className="text-xl font-semibold">Gerenciar Professores</h3>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eixo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Votou</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teachers.length === 0 && <tr><td colSpan={4} className="text-center py-4">Nenhum professor cadastrado.</td></tr>}
              {teachers.map((teacher: Teacher) => (
                <tr key={teacher.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{teacher.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.eixo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {teacher.vote ? 
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Sim</span> :
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Não</span>
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button 
                      variant="danger" 
                      onClick={() => handleAction(() => deleteTeacher(teacher.id), `delete-${teacher.id}`)}
                      disabled={loadingAction === `delete-${teacher.id}`}
                    >
                        {loadingAction === `delete-${teacher.id}` ? 'Excluindo...' : (confirmAction === `delete-${teacher.id}` ? 'Confirmar?' : 'Excluir')}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Ações do Sistema</h3>
        </CardHeader>
        <div className="space-y-4">
          <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-md">
            <h4 className="font-semibold text-yellow-800">Reiniciar Votos</h4>
            <p className="text-sm text-yellow-700 mb-2">Esta ação irá apagar todos os votos registrados, mas manterá os cadastros dos professores. Útil para iniciar uma nova rodada de votação.</p>
            <Button 
              variant="secondary" 
              onClick={() => handleAction(resetVotes, 'reset-votes')}
              disabled={loadingAction === 'reset-votes'}
            >
              {loadingAction === 'reset-votes' ? 'Processando...' : (confirmAction === 'reset-votes' ? 'Tem certeza? Clique para confirmar.' : 'Reiniciar Votos')}
            </Button>
          </div>
          
          <div className="p-4 border border-red-300 bg-red-50 rounded-md">
            <h4 className="font-semibold text-red-800">Reset Total do Sistema</h4>
            <p className="text-sm text-red-700 mb-2">Atenção! Esta ação irá apagar TODOS os cadastros de professores e TODOS os votos. Use com cuidado.</p>
            <Button 
              variant="danger" 
              onClick={() => handleAction(resetAll, 'reset-all')}
              disabled={loadingAction === 'reset-all'}
            >
              {loadingAction === 'reset-all' ? 'Processando...' : (confirmAction === 'reset-all' ? 'Tem certeza? Clique para confirmar.' : 'Reset Total')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;