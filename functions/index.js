const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

const db = admin.firestore();

// Meneer Taxi (ChIJ format for Places API)
const PLACE_ID = process.env.GOOGLE_PLACE_ID || 'ChIJ1WvOIgbPxUcRPSeO_9gQfQ0';

// Cache document: reviews/cache. Refresh from Google only when older than this (days).
const CACHE_MAX_AGE_DAYS = 15;

function isCacheExpired(updatedAt) {
  if (!updatedAt) return true;
  const now = Date.now();
  const ageMs = (updatedAt.toMillis ? updatedAt.toMillis() : updatedAt) || 0;
  return (now - ageMs) > CACHE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
}

async function fetchFromGoogle() {
  const apiKey = process.env.GOOGLE_API_KEY || functions.config().google?.apikey;
  if (!apiKey) throw new Error('Google API key not set. Set GOOGLE_API_KEY in Cloud Console (Functions → getGoogleReviews → Edit → Environment variables) or use firebase functions:config:set google.apikey="YOUR_KEY"');
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating,user_ratings_total&key=${apiKey}`;
  const response = await axios.get(url);
  if (response.data.status !== 'OK' || !response.data.result) throw new Error(`Google API: ${response.data.status}`);
  return {
    reviews: response.data.result.reviews || [],
    rating: response.data.result.rating || 5.0,
    totalRatings: response.data.result.user_ratings_total || 0
  };
}

async function getCached() {
  const snap = await db.collection('reviews').doc('cache').get();
  if (!snap.exists) return null;
  return snap.data();
}

async function setCached(data) {
  await db.collection('reviews').doc('cache').set({
    ...data,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
}

/**
 * HTTP: always returns cached reviews. Uses Google API only if cache is missing or older than 15 days.
 * So Google is called at most once per 15 days (or once on first request).
 */
exports.getGoogleReviews = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    let cached = await getCached();
    if (!cached || isCacheExpired(cached.updatedAt)) {
      const data = await fetchFromGoogle();
      await setCached(data);
      cached = { ...data, updatedAt: { toMillis: () => Date.now() } };
    }
    res.json({
      reviews: cached.reviews || [],
      rating: cached.rating != null ? cached.rating : 5.0,
      totalRatings: cached.totalRatings != null ? cached.totalRatings : 0
    });
  } catch (error) {
    console.error('getGoogleReviews error:', error);
    const fallback = await getCached();
    if (fallback && fallback.reviews) {
      res.json({
        reviews: fallback.reviews,
        rating: fallback.rating != null ? fallback.rating : 5.0,
        totalRatings: fallback.totalRatings != null ? fallback.totalRatings : 0
      });
      return;
    }
    res.status(500).json({
      error: 'Failed to fetch reviews',
      message: error.message
    });
  }
});

// Планировщик не нужен: кэш обновляется при первом заходе на сайт после 15 дней.
