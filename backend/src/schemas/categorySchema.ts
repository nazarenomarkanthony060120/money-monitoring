import mongoose, { Schema } from 'mongoose';

// Category Schema Definition
export const categorySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [50, 'Category name cannot be more than 50 characters']
  },
  icon: {
    type: String,
    required: [true, 'Icon is required'],
    trim: true
  },
  color: {
    type: String,
    required: [true, 'Color is required'],
    trim: true,
    match: [/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color']
  },
  type: {
    type: String,
    enum: ['income', 'expense', 'both'],
    required: [true, 'Category type is required']
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
categorySchema.index({ user: 1, type: 1 });
categorySchema.index({ user: 1, isActive: 1 });
categorySchema.index({ user: 1, isDefault: 1 });
categorySchema.index({ user: 1, parentCategory: 1 });
categorySchema.index({ user: 1, sortOrder: 1 });

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategory'
});

// Virtual for transaction count
categorySchema.virtual('transactionCount', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// Static method to get user's categories
categorySchema.statics.findByUser = function (userId: string, options: any = {}) {
  const { type, isActive, includeSubcategories = true } = options;

  let query: any = { user: userId };

  if (type) query.type = { $in: [type, 'both'] };
  if (isActive !== undefined) query.isActive = isActive;

  let pipeline = this.find(query).sort({ sortOrder: 1, name: 1 });

  if (includeSubcategories) {
    pipeline = pipeline.populate({
      path: 'subcategories',
      match: { isActive: true },
      options: { sort: { sortOrder: 1, name: 1 } }
    });
  }

  return pipeline;
};

// Static method to get default categories
categorySchema.statics.getDefaultCategories = function () {
  return this.find({ isDefault: true }).sort({ type: 1, sortOrder: 1, name: 1 });
};

// Static method to create default categories for a user
categorySchema.statics.createDefaultCategories = async function (userId: string) {
  const defaultCategories = [
    // Income categories
    { name: 'Salary', icon: '💰', color: '#10B981', type: 'income', isDefault: true },
    { name: 'Freelance', icon: '💼', color: '#3B82F6', type: 'income', isDefault: true },
    { name: 'Investment', icon: '📈', color: '#8B5CF6', type: 'income', isDefault: true },
    { name: 'Business', icon: '🏢', color: '#F59E0B', type: 'income', isDefault: true },
    { name: 'Other Income', icon: '🎁', color: '#EF4444', type: 'income', isDefault: true },

    // Expense categories
    { name: 'Food & Dining', icon: '🍽️', color: '#EF4444', type: 'expense', isDefault: true },
    { name: 'Transportation', icon: '🚗', color: '#3B82F6', type: 'expense', isDefault: true },
    { name: 'Shopping', icon: '🛍️', color: '#8B5CF6', type: 'expense', isDefault: true },
    { name: 'Entertainment', icon: '🎬', color: '#F59E0B', type: 'expense', isDefault: true },
    { name: 'Healthcare', icon: '🏥', color: '#10B981', type: 'expense', isDefault: true },
    { name: 'Education', icon: '📚', color: '#6366F1', type: 'expense', isDefault: true },
    { name: 'Housing', icon: '🏠', color: '#EC4899', type: 'expense', isDefault: true },
    { name: 'Utilities', icon: '⚡', color: '#F97316', type: 'expense', isDefault: true },
    { name: 'Insurance', icon: '🛡️', color: '#06B6D4', type: 'expense', isDefault: true },
    { name: 'Other Expenses', icon: '💸', color: '#6B7280', type: 'expense', isDefault: true }
  ];

  const categories = defaultCategories.map((cat: { name: string; icon: string; color: string; type: string; isDefault: boolean }) => ({
    ...cat,
    user: userId,
    isDefault: false // Set to false for user-specific categories
  }));

  return this.insertMany(categories);
};

// Static method to get category statistics
categorySchema.statics.getUserStats = async function (userId: string, period: {
  startDate: Date;
  endDate: Date;
}) {
  const stats = await this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        isActive: true
      }
    },
    {
      $lookup: {
        from: 'transactions',
        localField: '_id',
        foreignField: 'category',
        as: 'transactions'
      }
    },
    {
      $project: {
        name: 1,
        icon: 1,
        color: 1,
        type: 1,
        transactionCount: { $size: '$transactions' },
        totalIncome: {
          $sum: {
            $map: {
              input: {
                $filter: {
                  input: '$transactions',
                  cond: { $and: [{ $eq: ['$$this.type', 'income'] }, { $gte: ['$$this.date', period.startDate] }, { $lte: ['$$this.date', period.endDate] }] }
                }
              },
              as: 'income',
              in: '$$income.amount'
            }
          }
        },
        totalExpense: {
          $sum: {
            $map: {
              input: {
                $filter: {
                  input: '$transactions',
                  cond: { $and: [{ $eq: ['$$this.type', 'expense'] }, { $gte: ['$$this.date', period.startDate] }, { $lte: ['$$this.date', period.endDate] }] }
                }
              },
              as: 'expense',
              in: '$$expense.amount'
            }
          }
        }
      }
    },
    {
      $sort: { transactionCount: -1 }
    }
  ]);

  return stats;
};

// Static method to bulk update categories
categorySchema.statics.bulkUpdate = async function (userId: string, updates: Array<{
  id: string;
  name?: string;
  icon?: string;
  color?: string;
  type?: 'income' | 'expense' | 'both';
  isActive?: boolean;
  sortOrder?: number;
}>) {
  const bulkOps = updates.map(update => ({
    updateOne: {
      filter: { _id: update.id, user: userId },
      update: { $set: update }
    }
  }));

  return this.bulkWrite(bulkOps);
};

// Static method to reorder categories
categorySchema.statics.reorder = async function (userId: string, categoryOrders: Array<{
  id: string;
  sortOrder: number;
}>) {
  const bulkOps = categoryOrders.map(order => ({
    updateOne: {
      filter: { _id: order.id, user: userId },
      update: { $set: { sortOrder: order.sortOrder } }
    }
  }));

  return this.bulkWrite(bulkOps);
};

// Static method to get category hierarchy
categorySchema.statics.getHierarchy = async function (userId: string) {
  const categories = await this.find({ user: userId, isActive: true })
    .populate({
      path: 'subcategories',
      match: { isActive: true },
      options: { sort: { sortOrder: 1, name: 1 } }
    })
    .sort({ sortOrder: 1, name: 1 });

  return categories.filter((cat: any) => !cat.parentCategory);
};

// Static method to validate category name uniqueness
categorySchema.statics.validateNameUniqueness = async function (userId: string, name: string, excludeId?: string) {
  const query: any = { user: userId, name: { $regex: new RegExp(`^${name}$`, 'i') } };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const existing = await this.findOne(query);
  return !existing;
};

// Static method to get category suggestions
categorySchema.statics.getSuggestions = async function (userId: string, query: string, limit: number = 5) {
  return this.find({
    user: userId,
    isActive: true,
    name: { $regex: query, $options: 'i' }
  })
    .select('name icon color type')
    .limit(limit)
    .sort({ transactionCount: -1, name: 1 });
}; 