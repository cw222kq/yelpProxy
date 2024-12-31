import { Request, Response } from 'express';
import axios, { RawAxiosRequestHeaders } from 'axios';
import { YelpResponse, YelpSearchParams } from '../types';
import winston from 'winston';

const YELP_API_URL: string = 'https://api.yelp.com/v3';

// Configure winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Helper function to get error message from an error object
const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error) && error.response) {
    return error.response.data || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

// Helper function to handle API requests and error handling
const fetchFromYelp = async (
  url: string,
  params: YelpSearchParams,
  headers: RawAxiosRequestHeaders
): Promise<YelpResponse> => {
  logger.info('Fetching data from Yelp API', { url, params });
  try {
    const response = await axios.get<YelpResponse>(url, { headers, params });
    logger.info('Data fetched successfully from Yelp API', { url, params });
    return response.data;
  } catch (error) {
    const statusCode: number =
      axios.isAxiosError(error) && error.response ? error.response.status : 500;
    const errorMessage: string = getErrorMessage(error);
    logger.error('Error fetching data from Yelp API', { url, params, errorMessage })
   throw { statusCode, errorMessage };
  }
};

// Controller methods

export const searchRestaurants = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authorization = req.headers.authorization;
  logger.info('Received request to search resturants') 
  if (typeof authorization !== 'string') {
    logger.error('Authorization header is missing or invalid');
    res
      .status(400)
      .json({ error: 'Authorization header is missing or invalid' });
    return;
  }

  const location = req.query.location;
  if (typeof location !== 'string') {
    logger.error('Location query parameter is required and must be of type string')
    res.status(400).json({
      error: 'Location query parameter is required and must be of type string',
    });
    return;
  }

  try {
    const data = await fetchFromYelp(
      `${YELP_API_URL}/businesses/search`,
      { ...req.query, term: 'restaurants' },
      { Authorization: authorization }
    );
    logger.info('Successfully fetched restaurant data', { location })
    res.json(data);
  } catch (error) {
    const { statusCode, errorMessage } = error as {
      statusCode: number;
      errorMessage: string;
    };
    logger.error('Error fetching restaurant data', { statusCode, errorMessage });
    res.status(statusCode).json({ error: errorMessage });
  }
};

export const getRestaurantById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authorization = req.headers.authorization;
  logger.info('Received request to get resturant by ID');
  if (typeof authorization !== 'string') {
    logger.error('Authorization header is missing or invalid');
    res
      .status(400)
      .json({ error: 'Authorization header is missing or invalid' });
    return;
  }

  try {
    const data = await fetchFromYelp(
      `${YELP_API_URL}/businesses/${req.params.id}`,
      {},
      { Authorization: authorization }
    );
    logger.info('Sucessfully fetched restaurant data by ID', { id: req.params.id });
    res.json(data);
  } catch (error) {
    const { statusCode, errorMessage } = error as {
      statusCode: number;
      errorMessage: string;
    };
    logger.error('Error fetching restaurant data by ID', { statusCode, errorMessage });
    res.status(statusCode).json({ error: errorMessage });
  }
};
