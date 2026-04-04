import express from 'express';
import apiRouter from '../src/api-router.ts';

const app = express();
app.use(express.json());

// Mount the API router at /api
app.use('/api', apiRouter);

export default app;
