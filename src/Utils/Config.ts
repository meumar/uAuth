import 'dotenv/config';

export const port: any = process.env.PORT;

export const mongodb_url = process.env.MONGO_URI;

export const client_jwt_auth_secret: any = process.env.CLIENT_JWT_AUTH_SECRET;
export const client_jwt_auth_lite_time: any = process.env.CLIENT_JWT_AUTH_LIFE_TIME;

export const client_jwt_refresh_secret: any = process.env.CLIENT_JWT_REFRESH_SECRET;
export const client_jwt_refresh_lite_time: any = process.env.CLIENT_JWT_LIFE_REFRESH_TIME;


export const send_grid_key : any = process.env.SEND_GRID_KEY;
export const from_email : any = process.env.FROM_EMAIL;


export const api_url: any = process.env.API_URL;
export const app_url: any = process.env.APP_URL;


export const BODY_SIZE: number = 50 * 1024; //25kb