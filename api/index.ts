import type { IncomingMessage, ServerResponse } from 'http';
import { handleApiRoute } from '../src/server/apiRouter';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const handled = await handleApiRoute(req, res);
  if (!handled) {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  }
}
