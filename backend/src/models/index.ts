import mongoose from 'mongoose';

// Import models
import User from './User';
import Transaction from './Transaction';
import Category from './Category';

// Export schemas
export { userSchema } from '../schemas/userSchema';
export { transactionSchema } from '../schemas/transactionSchema';
export { categorySchema } from '../schemas/categorySchema';

// Export models
export { User, Transaction, Category };

// Export mongoose instance
export { mongoose }; 