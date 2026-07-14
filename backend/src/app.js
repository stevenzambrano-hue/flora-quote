import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// Route Imports
import cotizacionRoutes from './routes/cotizacion.routes.js';
import floresRoutes from './routes/flores.routes.js';
import cajasRoutes from './routes/cajas.routes.js';
import coloresRoutes from './routes/colores.routes.js';
import insumosRoutes from './routes/insumos.routes.js';
import complementosRoutes from './routes/complementos.routes.js';
import rendimientoRoutes from './routes/rendimiento.routes.js';

const app = express();

// Middlewares
const allowedOrigins = [
  'http://localhost:4200',
  'https://flora-quote.vercel.app',      // dominio por defecto de Vercel
  /^https:\/\/flora-quote.*\.vercel\.app$/ // previews de Vercel (PR deploys)
];
app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (Postman, curl, etc.)
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    if (allowed) callback(null, true);
    else callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());

// Main Routes
app.use('/api/cotizaciones', cotizacionRoutes);
app.use('/api/rendimientos', rendimientoRoutes);

// Catalog Routes (v1)
app.use('/api/v1/flores', floresRoutes);
app.use('/api/v1/cajas', cajasRoutes);
app.use('/api/v1/colores', coloresRoutes);
app.use('/api/v1/insumos', insumosRoutes);
app.use('/api/v1/complementos', complementosRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'FloraQuote API is running' });
});

export default app;
