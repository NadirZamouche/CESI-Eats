const Delivery = require('../models/Delivery');

exports.createDelivery = async (req, res) => {
  try {
    const delivery = new Delivery(req.body);
    await delivery.save();
    res.status(201).json(delivery);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getDeliverys = async (req, res) => {
  try {
    const deliverys = await Delivery.find();
    res.status(200).json(deliverys);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ID_user: req.params.id});
    if (!delivery) return res.status(404).json({ error: 'Delivery account not found' });
    res.status(200).json(delivery);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });
    res.status(200).json(delivery);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndDelete(req.params.id);
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });
    res.status(200).json({ message: 'Delivery deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
