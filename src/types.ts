interface Business {
    id: string;
    alias: string;
    name: string;
    image_url: string;
    is_closed: boolean;
    url: string;
    review_count: number;
    categories: Category[];
    rating: number;
    coordinates: Coordinates;
    transactions: string[];
    price: string;
    location: Location;
    phone: string;
    display_phone: string;
    distance: number;
  }
  
  export interface Category {
    alias: string;
    title: string;
  }
  
  export interface Coordinates {
    latitude: number;
    longitude: number;
  }
  
  export interface Location {
    address1: string;
    address2: string;
    address3: string;
    city: string;
    zip_code: string;
    country: string;
    state: string;
    display_address: string[];
  }
  
  export interface YelpResponse {
    businesses: Business[];
    total: number;
    region: Region;
  }
  
  export interface Region {
    center: Coordinates;
  }
  
  export interface YelpSearchParams {
    location?: string;
    term?: string;
    limit?: number;
    offset?: number;
  }

  export interface CustomError {
    statusCode: number;
    errorMessage: object;
  }