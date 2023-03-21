const express = require('express');

const router = express.Router();

const getAllRoutes = (app) => {
    app.use(router);
};

module.exports = getAllRoutes;