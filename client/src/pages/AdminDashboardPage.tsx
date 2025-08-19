import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import Button from '../components/ui/Button';
import Card, { CardHeader } from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { Teacher } from '../types';

type ModalAction = 
  | { type: 'delete-teacher'; teacherId: string }
  | { type: 'reset-votes' }
  | { type: 'reset-all' };

const AdminDashboardPage: React.FC = () => {
  const { teachers, resetVotes, resetAll, deleteTeacher, fetchAllTeachers } = useAppContext();
  const navigate = useNavigate();
  const [modalState, setModalState] = useState<{ isOpen: boolean; action: ModalAction | null }>({ isOpen: false, action: null });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAllTeachers();
  }, [fetchAllTeachers]);

  const openConfirmationModal = (action: ModalAction) => {
    setModalState({ isOpen: true, action });
  };

  const handleConfirmAction = async () => {
    if (!modalState.action) return;

    setIsLoading(true);
    try {
      switch (modalState.action.type) {
        case 'delete-teacher':
          await deleteTeacher(modalState.action.teacherId);
          break;
        case 'reset-votes':
          await resetVotes();
          break;
        case 'reset-all':
          await resetAll();
          break;
      }
    } catch (error) {
      console.error("Action failed", error);
    } finally {
      setIsLoading(false);
      setModalState({ isOpen: false, action: null });
    }
  };
  
  const getModalContent = () => {
      if (!modalState.action) return { title: '', body: '', confirmText: '' };
      switch (modalState.action.type) {
          case 'delete-teacher':
              const teacher = teachers.find(t => t.id === modalState.action.teacherId);
              return { title: 'Excluir Professor', body: `Tem certeza que deseja excluir o cadastro do professor(a) ${teacher?.name}? Esta ação não pode ser desfeita.`, confirmText: 'Sim, Excluir' };
          case 'reset-votes':
              return { title: 'Reiniciar Votos', body: 'Tem certeza que deseja apagar TODOS os votos registrados? Os cadastros dos professores serão mantidos.', confirmText: 'Sim, Reiniciar' };
          case 'reset-all':
              return { title: 'Reset Total do Sistema', body: 'ATENÇÃO: Tem certeza que deseja apagar TODOS os professores e TODOS os votos? Esta ação é irreversível.', confirmText: 'Sim, Apagar Tudo' };
          default:
              return { title: '', body: '', confirmText: ''};
      }
  }

  const teachersWithVotes = teachers.filter(t => t.vote).length;
  const totalTeachers = teachers.length;
  const { title, body, confirmText } = getModalContent();

  return (
    <>
      <Modal 
        isOpen={modalState.isOpen} 
        onClose={() => setModalState({isOpen: false, action: null})}
        title={title}
        confirmText={confirmText}
        onConfirm={handleConfirmAction}
        isConfirming={isLoading}
        isDanger={modalState.action?.type !== 'reset-votes'}
      >
        <p>{body}</p>
      </Modal>

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
                        size="sm"
                        onClick={() => openConfirmationModal({ type: 'delete-teacher', teacherId: teacher.id })}
                      >
                          Excluir
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
                onClick={() => openConfirmationModal({ type: 'reset-votes' })}
              >
                Reiniciar Votos
              </Button>
            </div>
            
            <div className="p-4 border border-red-300 bg-red-50 rounded-md">
              <h4 className="font-semibold text-red-800">Reset Total do Sistema</h4>
              <p className="text-sm text-red-700 mb-2">Atenção! Esta ação irá apagar TODOS os cadastros de professores e TODOS os votos. Use com cuidado.</p>
              <Button 
                variant="danger" 
                onClick={() => openConfirmationModal({ type: 'reset-all' })}
              >
                Reset Total
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default AdminDashboardPage;