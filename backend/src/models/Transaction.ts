import mongoose from 'mongoose';
import { transactionSchema } from '../schemas/transactionSchema';
import { ITransaction, ITransactionDocument, ITransactionModel } from '../types';

// Create the Transaction model
const Transaction = mongoose.model<ITransactionDocument, ITransactionModel>('Transaction', transactionSchema);

export default Transaction; 