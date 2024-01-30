const router = require('express').Router();
const questionRoutes = require('./api/question')
// const apiRoutes = require('./api');

// const keys = require('../config/keys');
// const { apiURL } = keys.app;

// const api = `/${apiURL}`;

// api routes
// router.use(api, apiRoutes);


router.use('/api/v1', questionRoutes)
router.use(`/api/v1/testing`, (req, res) => res.status(200).json('Testing API route'));
router.use('/api/v1/*', (req, res) => res.status(404).json('No API route found'));

module.exports = router;
