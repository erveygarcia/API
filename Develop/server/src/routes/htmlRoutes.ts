import path from 'path';
import { Router, Request, Response } from 'express';

const router = Router();

// TODO: Define route to serve index.html
router.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, '../../client/dist/index.html'));
});

export default router;
