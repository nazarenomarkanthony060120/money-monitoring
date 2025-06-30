import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ValidationError } from '../utils/errors';

// Extend Request interface to include file upload properties
interface RequestWithFiles extends Request {
  file?: Express.Multer.File;
  files?: { [fieldname: string]: Express.Multer.File[] };
}

/**
 * Generic validation middleware using express-validator
 */
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map(error => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg,
      value: error.type === 'field' ? error.value : undefined
    }));

    throw new ValidationError('The request data is invalid', errorDetails);
  }

  next();
};

/**
 * File upload validation middleware
 */
export const validateFile = (
  fieldName: string = 'file',
  maxSize: number = 5 * 1024 * 1024, // 5MB default
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
) => {
  return (req: RequestWithFiles, res: Response, next: NextFunction): void => {
    const file = req.file || req.files?.[fieldName];

    // Check if file is required
    if (!file) {
      throw new ValidationError(`${fieldName} file is required`);
    }

    // Handle single file
    if (Array.isArray(file)) {
      if (file.length === 0) {
        throw new ValidationError(`${fieldName} file is required`);
      }

      for (const f of file) {
        if (f.size > maxSize) {
          throw new ValidationError(`${fieldName} file size exceeds ${maxSize / 1024 / 1024}MB`);
        }

        if (!allowedTypes.includes(f.mimetype)) {
          throw new ValidationError(`${fieldName} file type not allowed`);
        }
      }
    } else {
      // Handle single file
      if (file.size > maxSize) {
        throw new ValidationError(`${fieldName} file size exceeds ${maxSize / 1024 / 1024}MB`);
      }

      if (!allowedTypes.includes(file.mimetype)) {
        throw new ValidationError(`${fieldName} file type not allowed`);
      }
    }

    next();
  };
};

/**
 * Date range validation middleware
 */
export const validateDateRange = (
  startDateField: string = 'startDate',
  endDateField: string = 'endDate'
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const startDate = req.body[startDateField] || req.query[startDateField];
    const endDate = req.body[endDateField] || req.query[endDateField];

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start >= end) {
        throw new ValidationError('Start date must be before end date');
      }
    }

    next();
  };
};

/**
 * Amount range validation middleware
 */
export const validateAmountRange = (
  minAmountField: string = 'minAmount',
  maxAmountField: string = 'maxAmount'
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const minAmount = parseFloat(req.body[minAmountField] || req.query[minAmountField]);
    const maxAmount = parseFloat(req.body[maxAmountField] || req.query[maxAmountField]);

    if (!isNaN(minAmount) && !isNaN(maxAmount) && minAmount >= maxAmount) {
      throw new ValidationError('Minimum amount must be less than maximum amount');
    }

    next();
  };
};

/**
 * Pagination validation middleware
 */
export const validatePagination = (maxLimit: number = 100) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (page < 1) {
      throw new ValidationError('Page must be a positive integer');
    }

    if (limit < 1 || limit > maxLimit) {
      throw new ValidationError(`Limit must be between 1 and ${maxLimit}`);
    }

    next();
  };
};

/**
 * MongoDB ObjectId validation middleware
 */
export const validateObjectId = (fieldName: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const id = req.params[fieldName] || req.body[fieldName] || req.query[fieldName];

    if (id && !/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new ValidationError(`${fieldName} must be a valid MongoDB ObjectId`);
    }

    next();
  };
};

/**
 * Enum validation middleware
 */
export const validateEnum = (
  fieldName: string,
  allowedValues: string[]
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const value = req.body[fieldName] || req.query[fieldName];

    if (value && !allowedValues.includes(value)) {
      throw new ValidationError(`${fieldName} must be one of: ${allowedValues.join(', ')}`);
    }

    next();
  };
};

/**
 * Required field validation middleware
 */
export const validateRequired = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    for (const fieldName of fields) {
      const value = req.body[fieldName] || req.query[fieldName];

      if (!value || (typeof value === 'string' && value.trim() === '')) {
        throw new ValidationError(`${fieldName} is required`);
      }
    }

    next();
  };
};

/**
 * Required field validation middleware based on conditions
 */
export const validateRequiredIf = (fieldName: string, condition: (req: Request) => boolean) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (condition(req)) {
      const value = req.body[fieldName];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        throw new ValidationError(`${fieldName} is required`);
      }
    }

    next();
  };
}; 