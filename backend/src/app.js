import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import clientesRoutes from './routes/clientesRoutes.js';
import prospectosRoutes from './routes/prospectosRoutes.js';
import claudeRoutes from './routes/claudeRoutes.js';
import marcaRoutes from './routes/marcaRoutes.js';
import skillsRoutes from './routes/skillsRoutes.js';
import openaiRoutes from './routes/openaiRoutes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' })); // base64 images para Claude Vision

// Routes
app.use('/api/clientes', clientesRoutes);
app.use('/api/prospectos', prospectosRoutes);
app.use('/api/claude', claudeRoutes);
app.use('/api/marca', marcaRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/openai', openaiRoutes);

// Healthcheck route para Docker Swarm
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'API funcionando correctamente' });
});

// Configuración puerto (se usará el 5050 en docker-compose)
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
    console.log(`[PITERLABS] Backend operando en el puerto ${PORT}`);
});

// Manejo de errores no capturados para evitar que el contenedor quede bloqueado (Zombie)
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1); // Falla rápido para que Docker Swarm lo reinicie
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception thrown:', error);
    process.exit(1); // Falla rápido para que Docker Swarm lo reinicie
});
