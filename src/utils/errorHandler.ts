import axios from 'axios';
import { Response } from 'express';
import logger from './logger';
import { CustomError } from '../types';

// Helper function to get error message from an error object
export const getErrorDetails = (
  error: unknown
): { errorMessage: object; statusCode: number } => {
  if (axios.isAxiosError(error) && error.response) {
    const errorData = error.response.data;
    return {
      errorMessage:
        typeof errorData === 'object' && 'error' in errorData
          ? { ...errorData.error }
          : { message: errorData || error.message },
      statusCode: error.response.status,
    };
  }
  if (error instanceof Error) {
    return {
      errorMessage: { message: error.message },
      statusCode: 500,
    };
  }
  return {
    errorMessage: { message: String(error) },
    statusCode: 500,
  };
};

// Type guard to check if an error is a CustomError
const isCustomError = (error: unknown): error is CustomError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    'errorMessage' in error
  );
};

// Helper function to handle errors in controllers
export const handleControllerError = (
  error: unknown,
  res: Response,
  action: string
): void => {
  if (isCustomError(error)) {
    const { statusCode, errorMessage } = error;
    logger.error(`Error fetching ${action}`, {
      statusCode,
      error: errorMessage,
    });
    res.status(statusCode).json({ error: errorMessage });
  } else {
    logger.error(`Unexpected error fetching ${action}`, { error });
    res.status(500).json({ error: { message: 'Internal Server Error' } });
  }
};
