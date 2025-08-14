
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardHeader } from '../components/ui/Card';

const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginAdmin } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await loginAdmin({ username, password });
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Usuário ou senha incorreta.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Acesso Administrativo</h2>
        <p className="mt-2 text-slate-600">Insira suas credenciais para gerenciar o sistema.</p>
      </div>
      <Card>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
              Usuário
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              required
              autoComplete="username"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full justify-center" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLoginPage;