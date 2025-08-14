import React, { createContext, useReducer, ReactNode, useCallback, useEffect } from 'react';
import { Teacher, Vote, Subject, Eixo } from '../types';
import { SUBJECT_TO_EIXO_MAP } from '../constants';

// Como o frontend e o backend estarão no mesmo servidor, 
// podemos usar um caminho relativo. O navegador completará o domínio.
const API_BASE_URL = '/api';

interface AppState {
  teachers: Teacher[];
  loggedInTeacher: Teacher | null;
  isAdmin: boolean;
  isInitialized: boolean; // Para saber se o estado inicial foi carregado
}

type Action =
  | { type: 'LOGIN_TEACHER_SUCCESS'; payload: Teacher }
  | { type: 'LOGIN_ADMIN_SUCCESS' }
  | { type: 'LOGOUT_SUCCESS' }
  | { type: 'SET_TEACHERS'; payload: Teacher[] }
  | { type: 'UPDATE_TEACHER_VOTE'; payload: { teacherId: string; vote: Vote } }
  | { type: 'DELETE_TEACHER_SUCCESS'; payload: string }
  | { type: 'RESET_VOTES_SUCCESS'; payload: Teacher[] }
  | { type: 'RESET_ALL_SUCCESS' }
  | { type: 'INITIALIZE'; payload: { isAdmin: boolean; loggedInTeacher: Teacher | null } };


interface AppContextProps extends AppState {
  loginOrRegisterTeacher: (credentials: { name: string; subject: Subject }) => Promise<Teacher>;
  logout: () => Promise<void>;
  loginAdmin: (credentials: {username: string, password: string}) => Promise<void>;
  submitVote: (teacherId: string, vote: Vote) => Promise<void>;
  deleteTeacher: (teacherId: string) => Promise<void>;
  resetVotes: () => Promise<void>;
  resetAll: () => Promise<void>;
  fetchAllTeachers: () => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// O Reducer agora simplesmente atualiza o estado com base nas ações de sucesso da API
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'INITIALIZE':
      return { ...state, ...action.payload, isInitialized: true };
    case 'LOGIN_TEACHER_SUCCESS':
      return { ...state, loggedInTeacher: action.payload, isAdmin: false };
    case 'LOGIN_ADMIN_SUCCESS':
        return { ...state, loggedInTeacher: null, isAdmin: true };
    case 'LOGOUT_SUCCESS':
      return { ...state, loggedInTeacher: null, isAdmin: false };
    case 'SET_TEACHERS':
      return { ...state, teachers: action.payload };
    case 'UPDATE_TEACHER_VOTE':
      const updatedTeachers = state.teachers.map((t) =>
        t.id === action.payload.teacherId ? { ...t, vote: action.payload.vote } : t
      );
      const updatedLoggedInTeacher = state.loggedInTeacher && state.loggedInTeacher.id === action.payload.teacherId
        ? { ...state.loggedInTeacher, vote: action.payload.vote }
        : state.loggedInTeacher;
      return { ...state, teachers: updatedTeachers, loggedInTeacher: updatedLoggedInTeacher };
    case 'DELETE_TEACHER_SUCCESS':
      return { ...state, teachers: state.teachers.filter(t => t.id !== action.payload) };
    case 'RESET_VOTES_SUCCESS':
        return { ...state, teachers: action.payload };
    case 'RESET_ALL_SUCCESS':
        return { ...state, teachers: [], loggedInTeacher: null, isAdmin: false };
    default:
      return state;
  }
};

const initialState: AppState = {
  teachers: [],
  loggedInTeacher: null,
  isAdmin: false,
  isInitialized: false,
};

// Função auxiliar para chamadas fetch
async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || 'Ocorreu um erro na comunicação com o servidor.');
    }
    // Retorna a resposta para que possa ser processada (ex: .json())
    return response;
}


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Tenta restaurar a sessão ao carregar a aplicação
    const restoreSession = async () => {
        try {
            const response = await apiFetch('/auth/session');
            const data = await response.json();
            dispatch({ type: 'INITIALIZE', payload: { isAdmin: data.isAdmin, loggedInTeacher: data.teacher } });
        } catch (error) {
            // Se não houver sessão, apenas inicializa o estado padrão
            dispatch({ type: 'INITIALIZE', payload: { isAdmin: false, loggedInTeacher: null } });
        }
    };
    restoreSession();
  }, []);

  const loginOrRegisterTeacher = async (credentials: { name: string; subject: Subject }): Promise<Teacher> => {
    const eixo = SUBJECT_TO_EIXO_MAP.get(credentials.subject);
    if (!eixo) throw new Error('Matéria selecionada não pertence a um eixo definido.');

    const response = await apiFetch('/auth/login-register', {
        method: 'POST',
        body: JSON.stringify({ name: credentials.name.trim(), subject: credentials.subject, eixo }),
    });
    const teacher = await response.json();
    dispatch({ type: 'LOGIN_TEACHER_SUCCESS', payload: teacher });
    return teacher;
  };

  const loginAdmin = async (credentials: {username: string, password: string}) => {
    await apiFetch('/auth/admin-login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
    dispatch({ type: 'LOGIN_ADMIN_SUCCESS' });
  };
  
  const logout = async () => {
    await apiFetch('/auth/logout', { method: 'POST' });
    dispatch({ type: 'LOGOUT_SUCCESS' });
  };

  const submitVote = async (teacherId: string, vote: Vote) => {
    await apiFetch(`/teachers/${teacherId}/vote`, {
        method: 'POST',
        body: JSON.stringify({ vote }),
    });
    dispatch({ type: 'UPDATE_TEACHER_VOTE', payload: { teacherId, vote } });
  };
  
  const fetchAllTeachers = useCallback(async () => {
      const response = await apiFetch('/teachers');
      const teachers: Teacher[] = await response.json();
      dispatch({ type: 'SET_TEACHERS', payload: teachers });
  }, []);
  
  const deleteTeacher = async (teacherId: string) => {
      await apiFetch(`/teachers/${teacherId}`, { method: 'DELETE' });
      dispatch({ type: 'DELETE_TEACHER_SUCCESS', payload: teacherId });
  };

  const resetVotes = async () => {
      const response = await apiFetch('/admin/reset-votes', { method: 'POST' });
      const updatedTeachers = await response.json();
      dispatch({ type: 'RESET_VOTES_SUCCESS', payload: updatedTeachers });
  };
  
  const resetAll = async () => {
      await apiFetch('/admin/reset-all', { method: 'POST' });
      dispatch({ type: 'RESET_ALL_SUCCESS' });
  };

  if (!state.isInitialized) {
      return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }

  return (
    <AppContext.Provider value={{ ...state, loginOrRegisterTeacher, logout, loginAdmin, submitVote, deleteTeacher, resetVotes, resetAll, fetchAllTeachers }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext };