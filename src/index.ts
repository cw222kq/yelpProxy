import express, { Request, Response } from 'express';
import dotev from 'dotenv';
import yelpRoutes from './routes/yelp';

dotev.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/yelp', yelpRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!!!!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
