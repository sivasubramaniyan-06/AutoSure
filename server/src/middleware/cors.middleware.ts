/**
 * AUTOSURE — CORS Middleware
 */

import cors from 'cors';
import { corsOptions } from '../config/cors.config';

export const corsMiddleware = cors(corsOptions);
