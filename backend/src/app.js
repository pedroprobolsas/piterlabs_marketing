import express from 'express';
import cors from 'cors';
import clientesRoutes from './routes/clientesRoutes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/clientes', clientesRoutes);

// Configuración puerto (se usará el 5050 en docker-compose)
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
    console.log(`[PITERLABS] Backend operando en el puerto ${PORT}`);
});
