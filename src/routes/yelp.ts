import { Router, Request, Response, NextFunction } from 'express';
import { searchRestaurants, getRestaurantById } from '../controllers/yelp';

const router: Router = Router();

// Middleware to set the Authorization header for Yelp API requests
const authorization = router.use((req: Request, res: Response, next: NextFunction) => {
  const YELP_API_KEY = process.env.YELP_API_KEY;
  req.headers.authorization = `Bearer ${YELP_API_KEY}`;
  next();
});

// Routes
router.get('/restaurants/search', searchRestaurants);
router.get('/restaurants/:id', getRestaurantById);

export default router;
