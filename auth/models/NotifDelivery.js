const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotifDeliverySchema = new Schema({
  Livreur: { type: Schema.Types.ObjectId, ref: 'Livreur', required: true },
  Commande: { type: Schema.Types.ObjectId, ref: 'Commande', required: true },
  notif_liv: { type: Boolean, required: true }
}, { timestamps: true });

module.exports = mongoose.model('NotifDelivery', NotifDeliverySchema);
