import { Request, Response } from 'express';
import axios, { RawAxiosRequestHeaders } from 'axios';

const YELP_API_URL: string = 'https://api.yelp.com/v3';

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
  params: Record<string, any>,
  headers: RawAxiosRequestHeaders,
  res: Response
): Promise<void> => {
    console.log('fetchFromYelp params: ', params);
  try {
    const response = await axios.get(url, { headers, params });
    res.json(response.data);
  } catch (error) {
    const statusCode: number =
      axios.isAxiosError(error) && error.response ? error.response.status : 500;
    const errorMessage: string = getErrorMessage(error);
    console.error('Error from Yelp API:', errorMessage);
    res.status(statusCode).json({ error: errorMessage });
  }
};

// Controller methods

export const searchRestaurants = (req: Request, res: Response): void => {
  const authorization = req.headers.authorization;
  console.log('authorization in search resturants: ', authorization);
  if (typeof authorization !== 'string') {
    res
      .status(400)
      .json({ error: 'Authorization header is missing or invalid' });
    return;
  }
  fetchFromYelp(
    `${YELP_API_URL}/businesses/search`,
    { ...req.query, term: 'restaurants' },
    { Authorization: authorization},
    res
  );
};

export const getRestaurantById = (req: Request, res: Response): void => {
    const authorization = req.headers.authorization;
    if (typeof authorization !== 'string') {
        res
          .status(400)
          .json({ error: 'Authorization header is missing or invalid' });
        return;
      }
    fetchFromYelp(
    `${YELP_API_URL}/businesses/${req.params.id}`,
    {},
    { Authorization: authorization},
    res
  );
};
