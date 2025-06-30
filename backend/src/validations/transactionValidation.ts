import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validation';

// Create transaction validation
export const validateCreateTransaction = [
  body('type')
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),

  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),

  body('currency')
    .optional()
    .isLength({ min: 3, max: 3 })
    .isUppercase()
    .withMessage('Currency must be a 3-letter uppercase code'),

  body('category')
    .isMongoId()
    .withMessage('Category must be a valid category ID'),

  body('description')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Description must be between 1 and 200 characters'),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('tags.*')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Each tag must be between 1 and 20 characters'),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),

  body('paymentMethod')
    .optional()
    .isIn(['cash', 'card', 'bank_transfer', 'digital_wallet', 'other'])
    .withMessage('Payment method must be cash, card, bank_transfer, digital_wallet, or other'),

  body('isRecurring')
    .optional()
    .isBoolean()
    .withMessage('isRecurring must be a boolean'),

  body('recurringPattern')
    .optional()
    .isIn(['daily', 'weekly', 'monthly', 'yearly'])
    .withMessage('Recurring pattern must be daily, weekly, monthly, or yearly'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),

  validate
];

// Update transaction validation
export const validateUpdateTransaction = [
  param('transactionId')
    .isMongoId()
    .withMessage('Invalid transaction ID format'),

  body('type')
    .optional()
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),

  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),

  body('currency')
    .optional()
    .isLength({ min: 3, max: 3 })
    .isUppercase()
    .withMessage('Currency must be a 3-letter uppercase code'),

  body('category')
    .optional()
    .isMongoId()
    .withMessage('Category must be a valid category ID'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Description must be between 1 and 200 characters'),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('tags.*')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Each tag must be between 1 and 20 characters'),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),

  body('paymentMethod')
    .optional()
    .isIn(['cash', 'card', 'bank_transfer', 'digital_wallet', 'other'])
    .withMessage('Payment method must be cash, card, bank_transfer, digital_wallet, or other'),

  body('isRecurring')
    .optional()
    .isBoolean()
    .withMessage('isRecurring must be a boolean'),

  body('recurringPattern')
    .optional()
    .isIn(['daily', 'weekly', 'monthly', 'yearly'])
    .withMessage('Recurring pattern must be daily, weekly, monthly, or yearly'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),

  validate
];

// Transaction ID parameter validation
export const validateTransactionId = [
  param('transactionId')
    .isMongoId()
    .withMessage('Invalid transaction ID format'),

  validate
];

// Transaction query validation
export const validateTransactionQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('type')
    .optional()
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),

  query('category')
    .optional()
    .isMongoId()
    .withMessage('Category must be a valid category ID'),

  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),

  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),

  query('tags')
    .optional()
    .isString()
    .withMessage('Tags must be a comma-separated string'),

  query('paymentMethod')
    .optional()
    .isIn(['cash', 'card', 'bank_transfer', 'digital_wallet', 'other'])
    .withMessage('Payment method must be cash, card, bank_transfer, digital_wallet, or other'),

  query('minAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum amount must be a non-negative number'),

  query('maxAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum amount must be a non-negative number'),

  query('sortBy')
    .optional()
    .isIn(['date', 'amount', 'description', 'createdAt'])
    .withMessage('Sort by must be date, amount, description, or createdAt'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),

  validate
];

// Bulk transaction validation
export const validateBulkTransactions = [
  body('transactions')
    .isArray({ min: 1, max: 100 })
    .withMessage('Transactions must be an array with 1 to 100 items'),

  body('transactions.*.type')
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),

  body('transactions.*.amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),

  body('transactions.*.category')
    .isMongoId()
    .withMessage('Category must be a valid category ID'),

  body('transactions.*.description')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Description must be between 1 and 200 characters'),

  body('transactions.*.date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),

  validate
];

// Transaction statistics validation
export const validateTransactionStats = [
  query('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),

  query('endDate')
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),

  query('groupBy')
    .optional()
    .isIn(['day', 'week', 'month', 'year', 'category'])
    .withMessage('Group by must be day, week, month, year, or category'),

  query('type')
    .optional()
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),

  validate
]; 