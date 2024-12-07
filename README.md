# yelpProxy

This project is a proxy API for the Yelp API. It allows you to search for restaurants and get restaurant details using the Yelp API. The proxy API handles authentication with the Yelp API and provides endpoints for searching and retrieving restaurant details.

## Features

- Search for restaurants using the Yelp API.
- Get detailed information about a specific restaurant.
- Handles authentication with the Yelp API.

## Prerequisites

- Node.js (version 14 or higher)
- npm (version 6 or higher)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/yelp-proxy-api.git
cd yelp-proxy-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a .env file in the root of the project and add your Yelp API key:

```bash
# .env

YELP_API_KEY=your_actual_yelp_api_key_here
```

You can refer to the .env.example file for the required environment variables.

### 4. Run the Development Server

```bash
npm run dev
```

### 5. Access the API

The API will be running on http://localhost:3000. You can use tools like Postman or a web browser to test the endpoints.

## API Endpoints

### Search Restaurants

* Endpoint: /api/yelp/restaurants/search
* Method: GET
* Query Parameters:
    * location (required): The location to search for restaurants (e.g., San Francisco).

#### Example Request:

```bash
curl "http://localhost:3000/api/yelp/restaurants/search?location=Stockholm"
```

### Get Resturant Details

* Endpoint: /api/yelp/restaurants/:id
* Method: GET
* Query Parameters:
    * id (required): The Yelp ID of the restaurant.

#### Example Request:

```bash
curl "http://localhost:3000/api/yelp/restaurants/your_restaurant_id_here"
```