import { Router, Request, Response } from 'express';
import axios from 'axios';

const router: Router = Router();
const YELP_API_URL: string = 'https://api.yelp.com/v3';

router.use((req: Request, res: Response, next) => {
  const YELP_API_KEY = process.env.YELP_API_KEY;
  req.headers.authorization = `Bearer ${YELP_API_KEY}`;
  next();
});

router.get('/resturants/search', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${YELP_API_URL}/businesses/search`, {
      headers: {
        Authorization: req.headers.authorization,
      },
      params: {
        ...req.query,
        term: 'resturants',
      },
    });
    res.json(response.data);
  } catch (error: any) {
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data || error.message;
    console.error('Error from Yelp API:', errorMessage);
    res.status(statusCode).json({ error: errorMessage });
  }
});

router.get('/resturants/:id', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      `${YELP_API_URL}/businesses/${req.params.id}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    res.json(response.data);
  } catch (error: any) {
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data || error.message;
    res.status(statusCode).json({ error: errorMessage });
  }
});

export default router;
