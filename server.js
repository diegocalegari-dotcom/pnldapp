// server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middlewares ---
app.use(cors({
  origin: '*', 
  credentials: true,
}));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'a-very-secret-key-for-pnld-voting-app', 
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: 'auto', 
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// --- Simulação de Banco de Dados em Memória ---
let teachersDB = [];

// --- Credenciais de Administrador ---
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'diego';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'hardcore';

// --- Funções Auxiliares ---
const findTeacherById = (id) => teachersDB.find(t => t.id === id);
const findTeacherByName = (name) => teachersDB.find(t => t.name.toLowerCase() === name.toLowerCase());


// --- Servir Arquivos Estáticos (Frontend da pasta 'dist') ---
// O Vite irá construir o frontend na pasta 'dist'.
app.use(express.static(path.join(__dirname, 'dist')));


// --- Rotas da API ---

// == Autenticação ==
app.post('/api/auth/login-register', (req, res) => {
    const { name, subject, eixo } = req.body;
    if (!name || !subject || !eixo) {
        return res.status(400).json({ message: 'Nome, matéria e eixo são obrigatórios.' });
    }
    let teacher = findTeacherByName(name);
    if (teacher) {
        console.log(`Professor(a) '${name}' encontrado. Logando...`);
    } else {
        teacher = {
            id: crypto.randomUUID(),
            name: name.trim(),
            subjects: [subject],
            eixo,
            vote: undefined,
        };
        teachersDB.push(teacher);
        console.log(`Novo professor(a) '${name}' criado.`);
    }
    req.session.teacherId = teacher.id;
    req.session.isAdmin = false;
    res.status(200).json(teacher);
});

app.post('/api/auth/admin-login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        req.session.isAdmin = true;
        req.session.teacherId = null;
        console.log('Admin logado com sucesso.');
        return res.status(200).json({ message: 'Login de administrador bem-sucedido.' });
    }
    console.log(`Falha no login de admin para o usuário: '${username}'`);
    return res.status(401).json({ message: 'Usuário ou senha incorreta.' });
});

app.post('/api/auth/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: 'Não foi possível fazer logout.' });
        res.clearCookie('connect.sid');
        console.log('Usuário deslogado.');
        return res.status(200).json({ message: 'Logout bem-sucedido.' });
    });
});

app.get('/api/auth/session', (req, res) => {
    if (req.session.isAdmin) {
        return res.status(200).json({ isAdmin: true, teacher: null });
    }
    if (req.session.teacherId) {
        const teacher = findTeacherById(req.session.teacherId);
        if (teacher) return res.status(200).json({ isAdmin: false, teacher: teacher });
    }
    return res.status(401).json({ message: 'Nenhuma sessão ativa.' });
});

// Middleware para proteger rotas de administrador
const requireAdmin = (req, res, next) => {
    if (!req.session.isAdmin) {
        return res.status(403).json({ message: 'Acesso negado. Ação restrita a administradores.' });
    }
    next();
};

app.get('/api/teachers', requireAdmin, (req, res) => res.status(200).json(teachersDB));

app.post('/api/teachers/:id/vote', (req, res) => {
    const { id } = req.params;
    const { vote } = req.body;
    if (req.session.teacherId !== id) {
        return res.status(403).json({ message: 'Acesso negado. Você só pode votar por si mesmo.' });
    }
    const teacher = findTeacherById(id);
    if (!teacher) return res.status(404).json({ message: 'Professor não encontrado.' });
    teacher.vote = vote;
    console.log(`Voto registrado para o ID do professor: ${id}`);
    return res.status(200).json({ message: 'Voto registrado com sucesso.' });
});

// == Ações do Administrador ==
app.delete('/api/teachers/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const initialLength = teachersDB.length;
    teachersDB = teachersDB.filter(t => t.id !== id);
    if (teachersDB.length < initialLength) {
        console.log(`Admin excluiu o professor com ID: ${id}`);
        return res.status(200).json({ message: 'Professor excluído com sucesso.' });
    }
    return res.status(404).json({ message: 'Professor não encontrado.' });
});

app.post('/api/admin/reset-votes', requireAdmin, (req, res) => {
    teachersDB.forEach(teacher => { teacher.vote = undefined; });
    console.log('Admin reiniciou todos os votos.');
    res.status(200).json(teachersDB);
});

app.post('/api/admin/reset-all', requireAdmin, (req, res) => {
    teachersDB = [];
    console.log('Admin resetou toda a base de dados.');
    res.status(200).json({ message: 'Todos os dados foram apagados com sucesso.' });
});

// --- Rota Catch-All para o Frontend ---
// Se nenhuma rota da API corresponder, envie o index.html da pasta 'dist'.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// --- Iniciar Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
