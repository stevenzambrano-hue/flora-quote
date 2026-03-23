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

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Main Routes
app.use('/api/cotizaciones', cotizacionRoutes);

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
