import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validation';

// Create category validation
export const validateCreateCategory = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage('Category name can only contain letters, numbers, spaces, hyphens, and underscores'),

  body('icon')
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage('Icon must be between 1 and 10 characters'),

  body('color')
    .trim()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color (e.g., #FF5733)'),

  body('type')
    .isIn(['income', 'expense', 'both'])
    .withMessage('Type must be income, expense, or both'),

  body('isDefault')
    .optional()
    .isBoolean()
    .withMessage('isDefault must be a boolean'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),

  body('parentCategory')
    .optional()
    .isMongoId()
    .withMessage('Parent category must be a valid category ID'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),

  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer'),

  validate
];

// Update category validation
export const validateUpdateCategory = [
  param('categoryId')
    .isMongoId()
    .withMessage('Invalid category ID format'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage('Category name can only contain letters, numbers, spaces, hyphens, and underscores'),

  body('icon')
    .optional()
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage('Icon must be between 1 and 10 characters'),

  body('color')
    .optional()
    .trim()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color (e.g., #FF5733)'),

  body('type')
    .optional()
    .isIn(['income', 'expense', 'both'])
    .withMessage('Type must be income, expense, or both'),

  body('isDefault')
    .optional()
    .isBoolean()
    .withMessage('isDefault must be a boolean'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),

  body('parentCategory')
    .optional()
    .isMongoId()
    .withMessage('Parent category must be a valid category ID'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),

  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer'),

  validate
];

// Category ID parameter validation
export const validateCategoryId = [
  param('categoryId')
    .isMongoId()
    .withMessage('Invalid category ID format'),

  validate
];

// Category query validation
export const validateCategoryQuery = [
  query('type')
    .optional()
    .isIn(['income', 'expense', 'both'])
    .withMessage('Type must be income, expense, or both'),

  query('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),

  query('isDefault')
    .optional()
    .isBoolean()
    .withMessage('isDefault must be a boolean'),

  query('parentCategory')
    .optional()
    .isMongoId()
    .withMessage('Parent category must be a valid category ID'),

  query('includeSubcategories')
    .optional()
    .isBoolean()
    .withMessage('includeSubcategories must be a boolean'),

  query('sortBy')
    .optional()
    .isIn(['name', 'sortOrder', 'createdAt', 'transactionCount'])
    .withMessage('Sort by must be name, sortOrder, createdAt, or transactionCount'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),

  validate
];

// Bulk category operations validation
export const validateBulkCategoryOperations = [
  body('categoryIds')
    .isArray({ min: 1, max: 50 })
    .withMessage('Category IDs must be an array with 1 to 50 items'),

  body('categoryIds.*')
    .isMongoId()
    .withMessage('Each category ID must be a valid MongoDB ObjectId'),

  body('operation')
    .isIn(['activate', 'deactivate', 'delete'])
    .withMessage('Operation must be activate, deactivate, or delete'),

  validate
];

// Category reorder validation
export const validateCategoryReorder = [
  body('categories')
    .isArray({ min: 1 })
    .withMessage('Categories must be an array with at least 1 item'),

  body('categories.*.id')
    .isMongoId()
    .withMessage('Each category ID must be a valid MongoDB ObjectId'),

  body('categories.*.sortOrder')
    .isInt({ min: 0 })
    .withMessage('Each sort order must be a non-negative integer'),

  validate
];

// Category statistics validation
export const validateCategoryStats = [
  query('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),

  query('endDate')
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),

  query('type')
    .optional()
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),

  query('includeSubcategories')
    .optional()
    .isBoolean()
    .withMessage('includeSubcategories must be a boolean'),

  validate
];

// Category import validation
export const validateCategoryImport = [
  body('categories')
    .isArray({ min: 1, max: 100 })
    .withMessage('Categories must be an array with 1 to 100 items'),

  body('categories.*.name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters'),

  body('categories.*.icon')
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage('Icon must be between 1 and 10 characters'),

  body('categories.*.color')
    .trim()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color'),

  body('categories.*.type')
    .isIn(['income', 'expense', 'both'])
    .withMessage('Type must be income, expense, or both'),

  body('categories.*.description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),

  body('categories.*.sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer'),

  body('overwrite')
    .optional()
    .isBoolean()
    .withMessage('overwrite must be a boolean'),

  validate
]; 