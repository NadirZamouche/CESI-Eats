const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  price: { type: Number, required: true },
  del_price: { type: Number, required: true },
  state: { type: String, required: true },
  notif_res: { type: Boolean, default: false },
  notif_cli: { type: Boolean, default: false },
  notif_del: { type: Boolean, default: false },
  Menu: [
    {
      menuId: { type: Schema.Types.ObjectId, ref: 'Menu', required: true },
      quantity: { type: Number, required: true }
    }
  ],
  Article: [
    {
      articleId: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
      quantity: { type: Number, required: true }
    }
  ],
  Client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  Restaurateur: { type: Schema.Types.ObjectId, ref: 'Restaurateur', required: true },
  Delivery: { type: Schema.Types.ObjectId, ref: 'Delivery' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
