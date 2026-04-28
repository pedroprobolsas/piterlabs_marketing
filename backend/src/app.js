import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import clientesRoutes from './routes/clientesRoutes.js';
import prospectosRoutes from './routes/prospectosRoutes.js';
import claudeRoutes from './routes/claudeRoutes.js';
import marcaRoutes from './routes/marcaRoutes.js';
import skillsRoutes from './routes/skillsRoutes.js';

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

// Configuración puerto (se usará el 5050 en docker-compose)
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
    console.log(`[PITERLABS] Backend operando en el puerto ${PORT}`);
});
