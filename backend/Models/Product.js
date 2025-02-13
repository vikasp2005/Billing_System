import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    discounts: [{
        discountPrice: Number,
        startDate: Date,
        endDate: Date
    }]
}, { timestamps: true });

export default mongoose.model('Product', productSchema);