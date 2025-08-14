import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.tsx';
import HomePage from './pages/HomePage.tsx';
import VotePage from './pages/VotePage.tsx';
import AdminLoginPage from './pages/AdminLoginPage.tsx';
import AdminDashboardPage from './pages/AdminDashboardPage.tsx';
import ReportsPage from './pages/ReportsPage.tsx';
import { useAppContext } from './hooks/useAppContext.ts';

const App: React.FC = () => {
  const { loggedInTeacher, isAdmin } = useAppContext();

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/vote" element={loggedInTeacher ? <VotePage /> : <Navigate to="/" />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/admin" element={isAdmin ? <AdminDashboardPage /> : <Navigate to="/admin-login" />} />
            <Route path="/reports" element={isAdmin ? <ReportsPage /> : <Navigate to="/admin-login" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <footer className="text-center p-4 text-sm text-slate-500 border-t border-slate-200 print-hidden">
          © {new Date().getFullYear()} Sistema de Votação de Livros Didáticos. Todos os direitos reservados.
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
