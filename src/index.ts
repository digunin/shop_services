import express from 'express';
import { router } from './routes.js';

const PORT = process.env.APP_SERVER_PORT;

const app = express();
app.use('/api', router);

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
