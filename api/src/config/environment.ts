/**
 * Environment configuration and secrets management
 * Reference: OWASP A02, Secure Coding Instruction 2
 */

/**
 * Validate and retrieve required environment variables
 */
function getRequiredEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue;
  
  if (!value) {
    console.error(`❌ Required environment variable ${name} is not set`);
    process.exit(1);
  }
  
  return value;
}

/**
 * Get optional environment variable with default
 */
function getOptionalEnvVar(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

/**
 * Environment configuration
 */
export const ENV_CONFIG = {
  // Server configuration
  PORT: parseInt(getOptionalEnvVar('PORT', '3000')),
  NODE_ENV: getOptionalEnvVar('NODE_ENV', 'development'),
  
  // Security configuration
  SESSION_SECRET: getRequiredEnvVar('SESSION_SECRET', 
    process.env.NODE_ENV === 'production' ? undefined : 'dev-secret-change-in-production'
  ),
  
  // CORS configuration
  API_CORS_ORIGINS: getOptionalEnvVar('API_CORS_ORIGINS', ''),
  
  // Database configuration
  DB_FILE: getOptionalEnvVar('DB_FILE', './data/app.db'),
  DB_ENGINE: getOptionalEnvVar('DB_ENGINE', 'sqlite'),
  DB_ENABLE_WAL: getOptionalEnvVar('DB_ENABLE_WAL', 'true') !== 'false',
  DB_TIMEOUT: parseInt(getOptionalEnvVar('DB_TIMEOUT', '30000')),
  DB_FOREIGN_KEYS: getOptionalEnvVar('DB_FOREIGN_KEYS', 'true') !== 'false',
};

/**
 * Validate configuration on startup
 */
export function validateEnvironment(): void {
  console.log('🔍 Validating environment configuration...');
  
  // Check for production-specific requirements
  if (ENV_CONFIG.NODE_ENV === 'production') {
    // In production, SESSION_SECRET must be provided
    if (!process.env.SESSION_SECRET) {
      console.error('❌ SESSION_SECRET must be set in production');
      process.exit(1);
    }
    
    // Warn about other production considerations
    if (!process.env.API_CORS_ORIGINS) {
      console.warn('⚠️  API_CORS_ORIGINS not set - using defaults may be too permissive for production');
    }
  }
  
  console.log('✅ Environment configuration validated');
}