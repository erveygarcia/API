import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// TODO: Fix missing dependency error for CORS (install with npm install cors)
import weatherRoutes from './routes/api/weatherRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// TODO: Fix '__dirname is not defined' issue for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: Implement middleware to connect the routes
app.use('/api/weather', weatherRoutes);

// TODO: Serve frontend static files
app.use(express.static(path.resolve(__dirname, '../../client/dist')));

// TODO: Fix missing index.html serving logic
app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client/dist/index.html'));
  });

// TODO: Start the server and confirm it's running
app.listen(PORT, () => {
  console.log(`🌍 Server running at http://localhost:${PORT}`);
});
