import express from 'express';
import path from 'path';
import 'dotenv/config';
import { handleApiRoute } from './src/server/apiRouter';

const app = express();
const PORT = process.env.PORT || 3000;

// API routes middleware
app.use(async (req, res, next) => {
  if (req.url && req.url.startsWith('/api/')) {
    const handled = await handleApiRoute(req, res);
    if (handled) return;
  }
  next();
});

// Serve static assets from built Vite client in production
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`TinPath production server running on port ${PORT}`);
});
