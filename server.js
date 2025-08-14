// server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const crypto = require('crypto');
const path = require('path'); // Módulo nativo do Node.js

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middlewares ---
app.use(cors({
  // Em produção, o ideal é ser mais restritivo, mas para o Render
  // como front e back estão no mesmo domínio, não é um grande problema.
  origin: '*', 
  credentials: true,
}));
app.use(bodyParser.json());
app.use(session({
    // Lê o segredo da sessão das variáveis de ambiente ou usa um valor padrão.
    secret: process.env.SESSION_SECRET || 'a-very-secret-key-for-pnld-voting-app', 
    resave: false,
    saveUninitialized: false, // Não cria sessão até que algo seja armazenado
    cookie: {
        // secure: 'auto' é uma boa opção para o Render
        secure: 'auto', 
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// --- Servir Arquivos Estáticos (Frontend) ---
// Esta linha diz ao Express para servir qualquer arquivo estático
// que ele encontrar na pasta 'public'.
app.use(express.static(path.join(__dirname, 'public')));


// --- Simulação de Banco de Dados em Memória ---
// Em uma aplicação real, isso seria substituído por uma conexão com um banco de dados como MongoDB, PostgreSQL, etc.
let teachersDB = [];

// --- Credenciais de Administrador ---
// Lendo as credenciais das variáveis de ambiente. Se não existirem, usa valores padrão.
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'diego';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'hardcore';


// --- Funções Auxiliares ---
const findTeacherById = (id) => teachersDB.find(t => t.id === id);
const findTeacherByName = (name) => teachersDB.find(t => t.name.toLowerCase() === name.toLowerCase());


// --- Rotas da API ---

// == Autenticação ==

app.post('/api/auth/login-register', (req, res) => {
    const { name, subject, eixo } = req.body;

    if (!name || !subject || !eixo) {
        return res.status(400).json({ message: 'Nome, matéria e eixo são obrigatórios.' });
    }

    let teacher = findTeacherByName(name);

    if (teacher) {
        // Professor já existe, faz o login
        console.log(`Professor(a) '${name}' encontrado. Logando...`);
    } else {
        // Professor não existe, cria um novo
        teacher = {
            id: crypto.randomUUID(),
            name: name.trim(),
            subjects: [subject], // O frontend envia uma matéria, então a envolvemos em um array
            eixo,
            vote: undefined,
        };
        teachersDB.push(teacher);
        console.log(`Novo professor(a) '${name}' criado.`);
    }

    // Cria uma sessão para o professor
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
        if (err) {
            return res.status(500).json({ message: 'Não foi possível fazer logout.' });
        }
        res.clearCookie('connect.sid'); // O nome padrão do cookie de sessão
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
        if (teacher) {
            return res.status(200).json({ isAdmin: false, teacher: teacher });
        }
    }
    // Se nenhuma sessão for encontrada
    return res.status(401).json({ message: 'Nenhuma sessão ativa.' });
});


// == Dados dos Professores ==

// Middleware para proteger rotas de administrador
const requireAdmin = (req, res, next) => {
    if (!req.session.isAdmin) {
        return res.status(403).json({ message: 'Acesso negado. Ação restrita a administradores.' });
    }
    next();
};

app.get('/api/teachers', requireAdmin, (req, res) => {
    return res.status(200).json(teachersDB);
});

// Endpoint protegido para o professor logado
app.post('/api/teachers/:id/vote', (req, res) => {
    const { id } = req.params;
    const { vote } = req.body;
    
    if (req.session.teacherId !== id) {
        return res.status(403).json({ message: 'Acesso negado. Você só pode votar por si mesmo.' });
    }

    const teacher = findTeacherById(id);
    if (!teacher) {
        return res.status(404).json({ message: 'Professor não encontrado.' });
    }

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
    teachersDB.forEach(teacher => {
        teacher.vote = undefined;
    });
    console.log('Admin reiniciou todos os votos.');
    res.status(200).json(teachersDB);
});

app.post('/api/admin/reset-all', requireAdmin, (req, res) => {
    teachersDB = [];
    console.log('Admin resetou toda a base de dados.');
    // Opcionalmente, destruir todas as sessões também
    res.status(200).json({ message: 'Todos os dados foram apagados com sucesso.' });
});

// --- Rota Catch-All para o Frontend ---
// Se nenhuma rota da API corresponder, envie o index.html.
// Isso permite que o React Router (HashRouter) controle a navegação.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// --- Iniciar Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log('--- Estado Atual do DB de Professores ---');
    console.log(teachersDB);
    console.log('---------------------------------');
});