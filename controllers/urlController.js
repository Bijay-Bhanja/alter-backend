const Url = require('../models/Url');
const redisClient = require('../utils/redisClient');
const shortid = require('shortid');

// Create Short URL
exports.createShortUrl = async (req, res) => {
    const { longUrl, customAlias, topic, userId } = req.body;
    const shortUrl = customAlias || shortid.generate();

    try {
        const newUrl = new Url({ longUrl, shortUrl, topic, userId });
        await newUrl.save();

        // Cache the new URL
        redisClient.set(shortUrl, longUrl);

        res.status(201).json({ shortUrl, createdAt: newUrl.createdAt });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create short URL' });
    }
};

// Redirect Short URL
exports.redirectUrl = async (req, res) => {
    const { alias } = req.params;

    // Check Redis cache first
    redisClient.get(alias, async (err, cachedUrl) => {
        if (cachedUrl) {
            res.redirect(cachedUrl);
        } else {
            try {
                const url = await Url.findOne({ shortUrl: alias });
                if (!url) {
                    return res.status(404).json({ error: 'Short URL not found' });
                }

                // Cache the URL and redirect
                redisClient.set(alias, url.longUrl);

                // Log analytics
                const analyticsData = {
                    timestamp: new Date(),
                    userAgent: req.headers['user-agent'],
                    ipAddress: req.ip,
                };
                url.analytics.push(analyticsData);
                await url.save();

                res.redirect(url.longUrl);
            } catch (error) {
                res.status(500).json({ error: 'Failed to redirect' });
            }
        }
    });
};

// Get URL Analytics
exports.getAnalytics = async (req, res) => {
    const { alias } = req.params;

    try {
        const url = await Url.findOne({ shortUrl: alias });
        if (!url) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        const totalClicks = url.analytics.length;
        const uniqueClicks = new Set(url.analytics.map(event => event.ipAddress)).size;
        const clicksByDate = url.analytics.reduce((acc, event) => {
            const date = event.timestamp.toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        const osType = {};
        const deviceType = {};

        url.analytics.forEach(event => {
            const userAgent = event.userAgent.toLowerCase();
            if (userAgent.includes('mobile')) {
                deviceType['mobile'] = (deviceType['mobile'] || 0) + 1;
            } else {
                deviceType['desktop'] = (deviceType['desktop'] || 0) + 1;
            }

            if (userAgent.includes('windows')) osType['Windows'] = (osType['Windows'] || 0) + 1;
            if (userAgent.includes('mac')) osType['macOS'] = (osType['macOS'] || 0) + 1;
            if (userAgent.includes('linux')) osType['Linux'] = (osType['Linux'] || 0) + 1;
            if (userAgent.includes('android')) osType['Android'] = (osType['Android'] || 0) + 1;
            if (userAgent.includes('iphone')) osType['iOS'] = (osType['iOS'] || 0) + 1;
        });

        res.status(200).json({ totalClicks, uniqueClicks, clicksByDate, osType, deviceType });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
};

// Get Topic-Based Analytics
exports.getTopicAnalytics = async (req, res) => {
    const { topic } = req.params;

    try {
        const urls = await Url.find({ topic });

        const totalClicks = urls.reduce((sum, url) => sum + url.analytics.length, 0);
        const uniqueClicks = new Set(
            urls.flatMap(url => url.analytics.map(event => event.ipAddress))
        ).size;

        const clicksByDate = urls.reduce((acc, url) => {
            url.analytics.forEach(event => {
                const date = event.timestamp.toISOString().split('T')[0];
                acc[date] = (acc[date] || 0) + 1;
            });
            return acc;
        }, {});

        const urlsData = urls.map(url => ({
            shortUrl: url.shortUrl,
            totalClicks: url.analytics.length,
            uniqueClicks: new Set(url.analytics.map(event => event.ipAddress)).size,
        }));

        res.status(200).json({ totalClicks, uniqueClicks, clicksByDate, urls: urlsData });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch topic-based analytics' });
    }
};

// Get Overall Analytics
exports.getOverallAnalytics = async (req, res) => {
    console.log("hi")
    const { userId } = req.body; // Assuming userId is passed in the request body
console.log(userId)
    try {
        const urls = await Url.find({ userId });

        const totalUrls = urls.length;
        const totalClicks = urls.reduce((sum, url) => sum + url.analytics.length, 0);
        const uniqueClicks = new Set(
            urls.flatMap(url => url.analytics.map(event => event.ipAddress))
        ).size;

        const clicksByDate = urls.reduce((acc, url) => {
            url.analytics.forEach(event => {
                const date = event.timestamp.toISOString().split('T')[0];
                acc[date] = (acc[date] || 0) + 1;
            });
            return acc;
        }, {});

        const osType = {};
        const deviceType = {};

        urls.flatMap(url => url.analytics).forEach(event => {
            const userAgent = event.userAgent.toLowerCase();
            if (userAgent.includes('mobile')) {
                deviceType['mobile'] = (deviceType['mobile'] || 0) + 1;
            } else {
                deviceType['desktop'] = (deviceType['desktop'] || 0) + 1;
            }

            if (userAgent.includes('windows')) osType['Windows'] = (osType['Windows'] || 0) + 1;
            if (userAgent.includes('mac')) osType['macOS'] = (osType['macOS'] || 0) + 1;
            if (userAgent.includes('linux')) osType['Linux'] = (osType['Linux'] || 0) + 1;
            if (userAgent.includes('android')) osType['Android'] = (osType['Android'] || 0) + 1;
            if (userAgent.includes('iphone')) osType['iOS'] = (osType['iOS'] || 0) + 1;
        });

        res.status(200).json({ totalUrls, totalClicks, uniqueClicks, clicksByDate, osType, deviceType });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch overall analytics' });
    }
};
