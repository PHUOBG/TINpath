import type { IncomingMessage, ServerResponse } from 'http';
import { handleApiRoute } from '../src/server/apiRouter.ts';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    // Extract actual request path (handles Vercel rewrite or direct path)
    const originalUrl = (req.headers['x-matched-path'] as string) || req.url || '';
    if (originalUrl && originalUrl.startsWith('/api/') && req.url !== originalUrl) {
      req.url = originalUrl;
    }

    const handled = await handleApiRoute(req, res);
    if (!handled) {
      res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        error: 'Endpoint not found',
        url: req.url,
        matchedPath: req.headers['x-matched-path'] || null,
      }));
    }
  } catch (error: any) {
    console.error('API Error in Vercel handler:', error);
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      error: 'Internal Server Error',
      message: error?.message || 'Unknown error',
    }));
  }
}
