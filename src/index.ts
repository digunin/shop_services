import express from 'express';
import { db } from './db.js';

const PORT = process.env.SERVER_PORT;

const app = express();
app.get('/', async (req, res) => {
  const response = await db.query("INSERT INTO person (person_name) values ('testuser') returning *");
  res.send(response.rows[0]);
});

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
