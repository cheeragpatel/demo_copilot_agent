/**
 * Input validation utilities - Reference: OWASP A03, Secure Coding Instructions 3
 */

import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Handle validation errors
 */
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.type === 'field' ? err.path : 'unknown',
        message: err.msg
      }))
    });
    return;
  }
  next();
};

/**
 * Common validation rules
 */
export const validationRules = {
  // Product validation
  product: [
    body('name')
      .isString()
      .isLength({ min: 1, max: 255 })
      .trim()
      .escape()
      .withMessage('Product name must be a string between 1 and 255 characters'),
    body('description')
      .optional()
      .isString()
      .isLength({ max: 1000 })
      .trim()
      .escape()
      .withMessage('Description must be a string with maximum 1000 characters'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a non-negative number'),
    body('supplierId')
      .isInt({ min: 1 })
      .withMessage('Supplier ID must be a positive integer'),
  ],

  // Supplier validation
  supplier: [
    body('name')
      .isString()
      .isLength({ min: 1, max: 255 })
      .trim()
      .escape()
      .withMessage('Supplier name must be a string between 1 and 255 characters'),
    body('contactInfo')
      .optional()
      .isString()
      .isLength({ max: 500 })
      .trim()
      .escape()
      .withMessage('Contact info must be a string with maximum 500 characters'),
    body('address')
      .optional()
      .isString()
      .isLength({ max: 500 })
      .trim()
      .escape()
      .withMessage('Address must be a string with maximum 500 characters'),
  ],

  // Branch validation
  branch: [
    body('name')
      .isString()
      .isLength({ min: 1, max: 255 })
      .trim()
      .escape()
      .withMessage('Branch name must be a string between 1 and 255 characters'),
    body('location')
      .optional()
      .isString()
      .isLength({ max: 500 })
      .trim()
      .escape()
      .withMessage('Location must be a string with maximum 500 characters'),
    body('headquartersId')
      .isInt({ min: 1 })
      .withMessage('Headquarters ID must be a positive integer'),
  ],

  // Order validation
  order: [
    body('branchId')
      .isInt({ min: 1 })
      .withMessage('Branch ID must be a positive integer'),
    body('orderDate')
      .isISO8601()
      .withMessage('Order date must be a valid ISO 8601 date'),
    body('status')
      .optional()
      .isString()
      .isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
      .withMessage('Status must be one of: pending, confirmed, shipped, delivered, cancelled'),
  ],

  // Common ID parameter validation
  idParam: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID must be a positive integer'),
  ],

  // Search query validation
  searchQuery: [
    body('query')
      .optional()
      .isString()
      .isLength({ min: 1, max: 100 })
      .trim()
      .escape()
      .withMessage('Search query must be a string between 1 and 100 characters'),
  ],
};

/**
 * Sanitize file paths to prevent directory traversal
 * Reference: OWASP A01, Secure Coding Instructions 1
 */
export const sanitizeFilePath = (filePath: string): string => {
  // Remove any path traversal attempts
  const cleaned = filePath.replace(/\.\./g, '').replace(/\\/g, '/');
  
  // Remove leading slashes and ensure it's a relative path
  return cleaned.replace(/^\/+/, '');
};

/**
 * Validate file upload parameters
 * Reference: OWASP A01, Secure Coding Instructions 1
 */
export const validateFileUpload = [
  body('fileName')
    .isString()
    .isLength({ min: 1, max: 255 })
    .matches(/^[a-zA-Z0-9._-]+$/)
    .withMessage('File name must contain only alphanumeric characters, dots, underscores, and hyphens'),
  body('fileSize')
    .optional()
    .isInt({ min: 0, max: 10485760 }) // 10MB max
    .withMessage('File size must be between 0 and 10MB'),
  body('contentType')
    .optional()
    .isString()
    .isIn(['image/jpeg', 'image/png', 'image/gif', 'text/plain', 'application/pdf'])
    .withMessage('Content type must be one of the allowed types'),
];