import { Router, Request, Response } from 'express';
import { getPostmanCollection } from '../utils/postmanCollection.ts';

const router = Router();

// GET /api/v1/postman
router.get('/', (req: Request, res: Response) => {
  const protocol = req.protocol || 'http';
  const host = req.get('host') || 'localhost:3000';
  const baseUrl = `${protocol}://${host}/api/v1`;

  const collection = getPostmanCollection(baseUrl);

  if (req.query.download === 'true') {
    res.setHeader('Content-disposition', 'attachment; filename=AgriTech_Postman_Collection.json');
    res.setHeader('Content-type', 'application/json');
  }

  res.json(collection);
});

export default router;
