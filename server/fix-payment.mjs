import mongoose from 'mongoose';

await mongoose.connect('mongodb+srv://admin:admin123@cluster0.3tglbwn.mongodb.net/?appName=Cluster0');

const { Schema, model } = mongoose;
const Payment = model('Payment', new Schema({}, { strict: false }));
const User = model('User', new Schema({}, { strict: false }));

const payment = await Payment.findOne({ provider: 'paypack', status: 'PENDING' }).sort({ createdAt: -1 });
if (!payment) { console.log('No pending payment found'); process.exit(0); }

console.log('Found payment:', String(payment._id), 'amount:', payment.amount, 'userId:', String(payment.userId));

payment.status = 'SUCCESS';
await payment.save();
console.log('Payment updated to SUCCESS');

const user = await User.findById(payment.userId);
if (user) {
  user.isPro = true;
  await user.save();
  console.log('User upgraded to Pro:', user.username);
} else {
  console.log('User not found');
}

process.exit(0);
