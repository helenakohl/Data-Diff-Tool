/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as path from 'path';

import cors from 'cors';
import express = require('express');

import { getTableData } from './dataBaseService';

const app = express();
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to server!' });
});

app.get('/data1', (req, res) => {
  try {
    const data = getTableData('trainstops1.sqlite', 'trainstops');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.get('/data2', (req, res) => {
  try {
    const data = getTableData('trainstops2.sqlite', 'trainstops');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.get('/data3', (req, res) => {
  try {
    const data = getTableData('trainstops3.sqlite', 'trainstops');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.get('/data4', (req, res) => {
  try {
    const data = getTableData('trainstops4.sqlite', 'trainstops');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

const port = process.env.PORT ?? 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
