const testimoniModel = require('../models/testimoniModel');

const getAllTestimoni = async (req, res) => {
    try {
        const [data] = await testimoniModel.getAllTestimoni();
        res.status(200).json({
            message: "Get all testimoni success",
            data: data
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            serverMessage: error,
        });
    }
}

const createNewTestimoni = async (req, res) => {
    const { body } = req;
    try {
        await testimoniModel.createNewTestimoni(body);
        res.status(201).json({
            message: "Create new testimoni success",
            data: body
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            serverMessage: error,
        });
    }
}

const updateTestimoni = async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    try {
        await testimoniModel.updateTestimoni(body, id);
        res.status(200).json({
            message: "Update testimoni success",
            data: {
                id: id,
                ...body
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            serverMessage: error,
        });
    }
}

const deleteTestimoni = async (req, res) => {
    const { id } = req.params;
    try {
        await testimoniModel.deleteTestimoni(id);
        res.status(200).json({
            message: "Delete testimoni success",
            data: null
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            serverMessage: error,
        });
    }
}

// Fetch Google Reviews via backend (proxied to avoid CORS + hide API key)
const getGoogleReviews = async (req, res) => {
    try {
        const placeId = process.env.GOOGLE_PLACE_ID;
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;

        if (!placeId || !apiKey) {
            return res.status(200).json({
                message: "Google Reviews not configured",
                data: [],
                configured: false
            });
        }

        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,user_ratings_total&reviews_sort=newest&key=${apiKey}`;
        const response = await fetch(url);
        const json = await response.json();

        if (json.status !== 'OK') {
            return res.status(200).json({
                message: "Google Places API error: " + json.status,
                data: [],
                configured: true,
                apiStatus: json.status
            });
        }

        const result = json.result || {};
        return res.status(200).json({
            message: "Get google reviews success",
            configured: true,
            data: {
                name: result.name,
                rating: result.rating,
                user_ratings_total: result.user_ratings_total,
                reviews: (result.reviews || []).map((r) => ({
                    author_name: r.author_name,
                    rating: r.rating,
                    text: r.text,
                    time: r.time,
                    profile_photo_url: r.profile_photo_url,
                    relative_time_description: r.relative_time_description
                }))
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server Error fetching Google Reviews",
            serverMessage: error.message,
        });
    }
};

// Sync/save Google reviews to local DB (optional, for caching)
const syncGoogleReviews = async (req, res) => {
    return res.status(200).json({
        message: "Sync triggered (no-op in this version)",
        data: null
    });
};

module.exports = {
    getAllTestimoni,
    createNewTestimoni,
    updateTestimoni,
    deleteTestimoni,
    getGoogleReviews,
    syncGoogleReviews,
}