const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    longUrl: String,
    shortUrl: { type: String, unique: true },
    topic: String,
    userId: String,
    createdAt: { type: Date, default: Date.now },
    analytics: [{
        timestamp: Date,
        userAgent: String,
        ipAddress: String,
    }],
});

module.exports = mongoose.model('Url', urlSchema);
