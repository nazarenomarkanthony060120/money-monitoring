import mongoose from 'mongoose';
import { categorySchema } from '../schemas/categorySchema';
import { ICategory, ICategoryDocument, ICategoryModel } from '../types';

// Create the Category model
const Category = mongoose.model<ICategoryDocument, ICategoryModel>('Category', categorySchema);

export default Category; 