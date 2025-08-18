// server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const crypto = require('crypto');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Configuração do Banco de Dados PostgreSQL ---
// Conecta ao banco de dados usando a URL fornecida pela variável de ambiente (configurada no Render).
// Isso garante que os dados sejam persistentes.
const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

(async () => {
    try {
        await db.connect();
        // Cria a tabela de professores se ela não existir
        await db.query(`
            CREATE TABLE IF NOT EXISTS teachers (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                subjects TEXT NOT NULL,
                eixo TEXT NOT NULL,
                vote TEXT
            )
        `);
        console.log(`Banco de dados PostgreSQL conectado e tabela 'teachers' garantida.`);
    } catch (err) {
        console.error('Falha crítica ao inicializar o banco de dados PostgreSQL:', err);
        process.exit(1); // Encerra a aplicação se não for possível conectar ao DB
    }
})();


// --- Middlewares ---
app.use(cors({
  origin: '*', 
  credentials: true,
}));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'a-very-secret-key-for-local-development', 
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: 'auto', 
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// --- Servir Arquivos Estáticos (Frontend) ---
// Em produção, servimos os arquivos otimizados da pasta 'dist'
const buildPath = path.join(__dirname, 'dist');
app.use(express.static(buildPath));


// --- Rotas da API (Atualizadas para usar PostgreSQL) ---

// == Autenticação ==

app.post('/api/auth/login-register', async (req, res) => {
    const { name, subject, eixo } = req.body;

    if (!name || !subject || !eixo) {
        return res.status(400).json({ message: 'Nome, matéria e eixo são obrigatórios.' });
    }

    try {
        // Procura por nome, ignorando maiúsculas/minúsculas
        const result = await db.query('SELECT * FROM teachers WHERE lower(name) = lower($1)', [name.trim()]);
        let teacher = result.rows[0];

        if (teacher) {
            console.log(`Professor(a) '${name}' encontrado. Logando...`);
        } else {
            teacher = {
                id: crypto.randomUUID(),
                name: name.trim(),
                subjects: JSON.stringify([subject]), // Armazena como string JSON
                eixo,
                vote: null,
            };
            await db.query(
                'INSERT INTO teachers (id, name, subjects, eixo, vote) VALUES ($1, $2, $3, $4, $5)',
                [teacher.id, teacher.name, teacher.subjects, teacher.eixo, teacher.vote]
            );
            console.log(`Novo professor(a) '${name}' criado.`);
        }

        // Deserializa os campos JSON antes de enviar para o frontend
        const teacherResponse = {
            ...teacher,
            subjects: JSON.parse(teacher.subjects),
            vote: teacher.vote ? JSON.parse(teacher.vote) : undefined
        };
        
        req.session.teacherId = teacher.id;
        req.session.isAdmin = false;
        
        res.status(200).json(teacherResponse);

    } catch (err) {
        console.error('Erro no login/registro:', err);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

app.post('/api/auth/admin-login', (req, res) => {
    // Credenciais de administrador a partir de variáveis de ambiente
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'diego';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'hardcore';

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
        res.clearCookie('connect.sid');
        console.log('Usuário deslogado.');
        return res.status(200).json({ message: 'Logout bem-sucedido.' });
    });
});

app.get('/api/auth/session', async (req, res) => {
    if (req.session.isAdmin) {
        return res.status(200).json({ isAdmin: true, teacher: null });
    }
    if (req.session.teacherId) {
        const result = await db.query('SELECT * FROM teachers WHERE id = $1', [req.session.teacherId]);
        const teacher = result.rows[0];
        if (teacher) {
             const teacherResponse = {
                ...teacher,
                subjects: JSON.parse(teacher.subjects),
                vote: teacher.vote ? JSON.parse(teacher.vote) : undefined
            };
            return res.status(200).json({ isAdmin: false, teacher: teacherResponse });
        }
    }
    return res.status(401).json({ message: 'Nenhuma sessão ativa.' });
});


// == Dados dos Professores ==

const requireAdmin = (req, res, next) => {
    if (!req.session.isAdmin) {
        return res.status(403).json({ message: 'Acesso negado. Ação restrita a administradores.' });
    }
    next();
};

app.get('/api/teachers', requireAdmin, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM teachers ORDER BY name');
        const teachersRaw = result.rows;
        // Deserializa os campos JSON para cada professor
        const teachers = teachersRaw.map(t => ({
            ...t,
            subjects: JSON.parse(t.subjects),
            vote: t.vote ? JSON.parse(t.vote) : undefined
        }));
        return res.status(200).json(teachers);
    } catch(err) {
        console.error('Erro ao buscar professores:', err);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

app.post('/api/teachers/:id/vote', async (req, res) => {
    const { id } = req.params;
    const { vote } = req.body;
    
    // Um admin pode votar? Por enquanto não, mas um professor só pode votar por si.
    if (!req.session.isAdmin && req.session.teacherId !== id) {
        return res.status(403).json({ message: 'Acesso negado. Você só pode votar por si mesmo.' });
    }

    try {
        await db.query('UPDATE teachers SET vote = $1 WHERE id = $2', [JSON.stringify(vote), id]);
        console.log(`Voto registrado para o ID do professor: ${id}`);
        return res.status(200).json({ message: 'Voto registrado com sucesso.' });
    } catch (err) {
        console.error('Erro ao registrar voto:', err);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});


// == Ações do Administrador ==

app.delete('/api/teachers/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM teachers WHERE id = $1', [id]);
        if (result.rowCount > 0) {
            console.log(`Admin excluiu o professor com ID: ${id}`);
            return res.status(200).json({ message: 'Professor excluído com sucesso.' });
        }
        return res.status(404).json({ message: 'Professor não encontrado.' });
    } catch(err) {
        console.error('Erro ao excluir professor:', err);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

app.post('/api/admin/reset-votes', requireAdmin, async (req, res) => {
    try {
        await db.query('UPDATE teachers SET vote = NULL');
        console.log('Admin reiniciou todos os votos.');
        const result = await db.query('SELECT * FROM teachers ORDER BY name');
        const teachersRaw = result.rows;
        const teachers = teachersRaw.map(t => ({
            ...t,
            subjects: JSON.parse(t.subjects),
            vote: undefined
        }));
        res.status(200).json(teachers);
    } catch(err) {
        console.error('Erro ao reiniciar votos:', err);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

app.post('/api/admin/reset-all', requireAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM teachers');
        console.log('Admin resetou toda a base de dados.');
        res.status(200).json({ message: 'Todos os dados foram apagados com sucesso.' });
    } catch(err) {
        console.error('Erro no reset total:', err);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// --- Rota Catch-All para o Frontend ---
// Esta rota garante que qualquer requisição que não seja para a API sirva o app React.
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

// --- Iniciar Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});