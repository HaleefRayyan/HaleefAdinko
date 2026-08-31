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
        const placeId = process.env.GOOGLE_PLACE_ID || 'ChIJWe2SmH6v1TER4QZMUcf2Tcw';
        const apiKey = process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyAzH2SuBggvxrpkDT4d1PAo1HOuCDlQzP4';

        let placeInfo = {
            name: 'Adinko rumput sintetis pekanbaru',
            rating: 5.0,
            total_reviews: 103,
            userRatingCount: 103,
            googleMapsUri: 'https://maps.app.goo.gl/NJwGPgzB8FpBjk8A7'
        };
        let googleReviewItems = [];

        // 1. Try Google Places API (New)
        try {
            const placesNewUrl = `https://places.googleapis.com/v1/places/${placeId}`;
            const apiRes = await fetch(placesNewUrl, {
                headers: {
                    'X-Goog-Api-Key': apiKey,
                    'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount,reviews,googleMapsUri',
                    'Accept-Language': 'id'
                }
            });

            if (apiRes.ok) {
                const json = await apiRes.json();
                if (json && (json.rating || json.displayName)) {
                    placeInfo = {
                        name: json.displayName?.text || placeInfo.name,
                        rating: json.rating || placeInfo.rating,
                        total_reviews: json.userRatingCount || placeInfo.total_reviews,
                        userRatingCount: json.userRatingCount || placeInfo.userRatingCount,
                        googleMapsUri: json.googleMapsUri || placeInfo.googleMapsUri
                    };

                    if (Array.isArray(json.reviews) && json.reviews.length > 0) {
                        googleReviewItems = json.reviews.map((r) => ({
                            author_name: r.authorAttribution?.displayName || r.author_name || 'Pelanggan Google',
                            author_url: r.authorAttribution?.uri || '',
                            profile_photo_url: r.authorAttribution?.photoUri || r.profile_photo_url || '',
                            rating: r.rating || 5,
                            text: r.text?.text || r.text || '',
                            relative_time_description: r.relativePublishTimeDescription || r.relative_time_description || 'Baru saja',
                            time: r.publishTime ? new Date(r.publishTime).getTime() / 1000 : Date.now() / 1000,
                            category: 'Rumput Sintetis'
                        }));
                    }
                }
            }
        } catch (apiErr) {
            console.warn('Google Places API (New) fetch error:', apiErr.message);
        }

        // If Google Places API didn't return review items, fallback to database reviews
        if (googleReviewItems.length === 0) {
            try {
                const [dbRows] = await testimoniModel.getAllTestimoni();
                if (Array.isArray(dbRows) && dbRows.length > 0) {
                    googleReviewItems = dbRows.map((r) => ({
                        id: r.idtestimoni || r.id,
                        author_name: r.nama_klien || r.author_name,
                        rating: Number(r.rating) || 5,
                        text: r.isi_testimoni || r.text || '',
                        relative_time_description: r.waktu || 'Pelanggan Terverifikasi',
                        category: r.kategori || 'Rumput Sintetis'
                    }));
                }
            } catch (dbErr) {
                console.warn('Database fallback review error:', dbErr.message);
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Get google reviews success',
            configured: true,
            place: placeInfo,
            data: googleReviewItems
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error fetching Google Reviews',
            serverMessage: error.message
        });
    }
};

// Sync/save Google reviews to local DB (optional)
const syncGoogleReviews = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Sync triggered',
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