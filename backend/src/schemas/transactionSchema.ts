import mongoose, { Schema } from 'mongoose';

// Transaction Schema Definition
export const transactionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    index: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Transaction type is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true,
    trim: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  location: {
    type: String,
    trim: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'digital_wallet', 'other'],
    default: 'other'
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly']
  },
  attachments: [{
    filename: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    mimetype: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    }
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, type: 1 });
transactionSchema.index({ user: 1, category: 1 });
transactionSchema.index({ user: 1, tags: 1 });
transactionSchema.index({ user: 1, paymentMethod: 1 });

// Virtual for formatted amount
transactionSchema.virtual('formattedAmount').get(function () {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency
  }).format(this.amount);
});

// Virtual for formatted date
transactionSchema.virtual('formattedDate').get(function () {
  return this.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Static method to get user's transactions with pagination
transactionSchema.statics.findByUser = function (userId: string, options: any = {}) {
  const {
    page = 1,
    limit = 20,
    type,
    category,
    startDate,
    endDate,
    tags,
    paymentMethod
  } = options;

  const query: any = { user: userId };

  if (type) query.type = type;
  if (category) query.category = category;
  if (paymentMethod) query.paymentMethod = paymentMethod;
  if (tags && tags.length > 0) query.tags = { $in: tags };

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = startDate;
    if (endDate) query.date.$lte = endDate;
  }

  return this.find(query)
    .populate('category', 'name icon color')
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

// Static method to get transaction statistics
transactionSchema.statics.getUserStats = async function (userId: string, period: {
  startDate: Date;
  endDate: Date;
}) {
  const stats = await this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        date: { $gte: period.startDate, $lte: period.endDate }
      }
    },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  const result = {
    income: { total: 0, count: 0 },
    expense: { total: 0, count: 0 }
  };

  stats.forEach(stat => {
    result[stat._id as 'income' | 'expense'] = {
      total: stat.total,
      count: stat.count
    };
  });

  return result;
};

// Static method to get category-wise statistics
transactionSchema.statics.getCategoryStats = async function (
  userId: string,
  type: 'income' | 'expense',
  period: { startDate: Date; endDate: Date }
) {
  return this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        type,
        date: { $gte: period.startDate, $lte: period.endDate }
      }
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category'
      }
    },
    {
      $unwind: '$category'
    },
    {
      $project: {
        category: {
          _id: 1,
          name: 1,
          icon: 1,
          color: 1
        },
        total: 1,
        count: 1
      }
    },
    {
      $sort: { total: -1 }
    }
  ]);
}; 