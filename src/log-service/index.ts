import express from 'express';
import { router } from './routes.js';

const PORT = process.env.APP_SERVER_LOG_PORT;

const app = express();
app.use(express.json());
app.use(process.env.APP_LOG_API_URL as string, router);

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
