import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}));

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Root route
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

// Example: plug in your auth routes
// import authRoutes from './routes/auth.js';
// app.use('/api/auth', authRoutes);

// Example: other API routes
// import userRoutes from './routes/user.js';
// app.use('/api/users', userRoutes);

export default app;
