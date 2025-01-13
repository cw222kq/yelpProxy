import { Router, Request, Response, NextFunction } from 'express';
import { searchRestaurants, getRestaurantById } from '../controllers/yelp';
import logger from '../utils/logger';

const router: Router = Router();

// Middleware to set the Authorization header for Yelp API requests
router.use((req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'test') {
    return next();
  }
  const YELP_API_KEY = process.env.YELP_API_KEY;
  if (!YELP_API_KEY) {
    logger.error('Yelp API key is missing');
    res.status(500).json({ error: 'Yelp API key is missing' });
    return;
  }
  req.headers.authorization = `Bearer ${YELP_API_KEY}`;
  next();
});

// Routes
router.get('/restaurants/search', searchRestaurants);
router.get('/restaurants/:id', getRestaurantById);

export default router;
