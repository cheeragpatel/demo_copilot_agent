import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import deliveryRoutes from './routes/delivery';
import orderDetailDeliveryRoutes from './routes/orderDetailDelivery';
import productRoutes from './routes/product';
import orderDetailRoutes from './routes/orderDetail';
import orderRoutes from './routes/order';
import branchRoutes from './routes/branch';
import headquartersRoutes from './routes/headquarters';
import supplierRoutes from './routes/supplier';
import authRoutes from './routes/auth';
import { initializeDatabase } from './init-db';
import { errorHandler } from './utils/errors';
import { ENV_CONFIG, validateEnvironment } from './config/environment';
import { setCSRFToken } from './utils/csrf';

// Validate environment configuration on startup
validateEnvironment();

const app = express();
const port = ENV_CONFIG.PORT;

// Parse CORS origins from environment variable if available
const corsOrigins = ENV_CONFIG.API_CORS_ORIGINS
  ? ENV_CONFIG.API_CORS_ORIGINS.split(',')
  : [
      'http://localhost:5137',
      'http://localhost:3001',
      // Allow specific Codespace domains only
      /^https:\/\/[a-zA-Z0-9-]+-5137\.app\.github\.dev$/,
    ];

console.log('Configured CORS origins:', corsOrigins);

// Security middleware - Reference: OWASP A05, Secure Coding Instructions 5
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Rate limiting - Reference: OWASP A07, Secure Coding Instructions 7
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Enable CORS for the frontend - Reference: Secure Coding Instructions 5
app.use(
  cors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow credentials
  }),
);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with Swagger',
      version: '1.0.0',
      description: 'REST API documentation using Swagger/OpenAPI',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Development server (HTTP)',
      },
      {
        url: `https://localhost:${port}`,
        description: 'Development server (HTTPS)',
      },
    ],
  },
  apis: ['./src/models/*.ts', './src/routes/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocs);
});

app.use(express.json());
app.use(cookieParser());

// CSRF protection - Reference: OWASP A01, Secure Coding Instructions 1
app.use(setCSRFToken);

app.use('/api/auth', authRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/order-detail-deliveries', orderDetailDeliveryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/order-details', orderDetailRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/headquarters', headquartersRoutes);
app.use('/api/suppliers', supplierRoutes);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Add error handling middleware
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    console.log('🚀 Initializing database...');
    await initializeDatabase(false); // Don't seed if already initialized
    console.log('✅ Database initialized successfully');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`API documentation is available at http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
