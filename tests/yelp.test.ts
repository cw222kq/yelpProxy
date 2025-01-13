import request from 'supertest';
import express, { Application } from 'express';
import yelpRoutes from '../src/routes/yelp';
import dotenv from 'dotenv';
import nock from 'nock';

dotenv.config();

const app: Application = express();
app.use(express.json());
app.use('/api/yelp', yelpRoutes);

describe('Yelp Api Proxy', () => {
  beforeAll(() => {
    // Mock the Yelp API response for the search endpoint
    nock('https://api.yelp.com')
      .get('/v3/businesses/search')
      .query({ location: 'Stockholm', term: 'restaurants' })
      .reply(200, {
        businesses: [
          {
            id: 'test-restaurant-id',
            name: 'Test Restaurant',
            location: { adress1: '123 Test Street', city: 'Stockholm' },
          },
        ],
      });

    // Mock the Yelp API response for the details endpoint
    nock('https://api.yelp.com')
      .get('/v3/businesses/test-restaurant-id')
      .reply(200, {
        id: 'test-restaurant-id',
        name: 'Test Restaurant',
        location: { adress1: '123 Test Street', city: 'Stockholm' },
      });

    // Mock the Yelp API response for an invalid restaurant ID
    nock('https://api.yelp.com')
      .get('/v3/businesses/invalid-restaurant-id')
      .reply(404, {
        error: {
          code: 'BUSINESS_NOT_FOUND',
          description: 'The requested business could not be found.',
        },
      });
  });

  it('should search for restaurants', async () => {
    const response = await request(app)
      .get('/api/yelp/restaurants/search')
      .query({ location: 'Stockholm' })
      .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('businesses');
    expect(response.body.businesses).toHaveLength(1);
    expect(response.body.businesses[0]).toHaveProperty(
      'id',
      'test-restaurant-id'
    );
  });

  it('should get resturant details by ID', async () => {
    const response = await request(app)
      .get('/api/yelp/restaurants/test-restaurant-id')
      .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 'test-restaurant-id');
    expect(response.body).toHaveProperty('name', 'Test Restaurant');
  });

  it('should return a 404 error for an invalid resturant ID', async () => {
    const response = await request(app)
      .get('/api/yelp/restaurants/invalid-restaurant-id')
      .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toHaveProperty('code', 'BUSINESS_NOT_FOUND');
    expect(response.body.error).toHaveProperty(
      'description',
      'The requested business could not be found.'
    );
  });

  it('should return a 400 for missing authorization header', async () => {
    // Simulate missing authorization header by not setting it
    const response = await request(app)
      .get('/api/yelp/restaurants/search')
      .query({ location: 'Stockholm' });

    expect(response.status).toBe(400); // Bad Request
    expect(response.body).toHaveProperty('error', 'Authorization header is missing or invalid');
  });

  it('should return a 400 for missing location query parameter', async () => {
    const response = await request(app)
      .get('/api/yelp/restaurants/search')
      .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`);

    expect(response.status).toBe(400); // Bad Request
    expect(response.body).toHaveProperty(
      'error',
      'Location query parameter is required and must be of type string'
    );
  });
});
