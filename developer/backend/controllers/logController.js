const Log = require('../models/Log');

exports.createLog = async (req, res) => {
  try {
    const log = new Log(req.body);
    await log.save();
    res.status(201).json({ message: "The download is upcoming" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
