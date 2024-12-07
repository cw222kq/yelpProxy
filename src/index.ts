import express, { Request, Response, Application } from 'express';
import dotev from 'dotenv';
import yelpRoutes from './routes/yelp';

dotev.config();

const app: Application = express();
const PORT: number | string = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/yelp', yelpRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
