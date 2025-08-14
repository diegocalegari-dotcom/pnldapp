
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import Button from './ui/Button';

const Header: React.FC = () => {
  const { loggedInTeacher, isAdmin, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm print-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 2h2v2h-2V5zm0 4h2v2h-2V9zm0 4h2v2h-2v-2zm-2-8h2v2H8V5zm0 4h2v2H8V9zm0 4h2v2H8v-2zm10 4H6v-2h12v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2z"/>
             </svg>
            <h1 className="text-xl font-bold text-slate-800">
              PNLD 2026: Escolha de Livros Didáticos
            </h1>
          </div>
          <nav className="flex items-center space-x-4">
            {loggedInTeacher && (
              <>
                <span className="text-slate-600">Olá, {loggedInTeacher.name.split(' ')[0]}</span>
                <Button onClick={handleLogout} variant="secondary" size="sm">
                  Sair
                </Button>
              </>
            )}
            {isAdmin && (
              <>
                <NavLink to="/admin" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>
                  Dashboard
                </NavLink>
                <NavLink to="/reports" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>
                  Relatórios
                </NavLink>
                <Button onClick={handleLogout} variant="secondary">
                  Sair
                </Button>
              </>
            )}
            {!loggedInTeacher && !isAdmin && (
                <NavLink to="/admin-login" className="text-sm font-medium text-slate-500 hover:text-indigo-600">
                    Acesso Admin
                </NavLink>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;