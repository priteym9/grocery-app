const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/sendResponse');
const db = require('../db/models/index');
const Customer = db.customers;

const validateUserToken = async (req, res, next) => {
    const token = req.header('token');
    if (!token) {
        return sendError(res, 400, false, "Token is required")
    }
    try {
        const data = jwt.verify(token, process.env.SECRET_KEY);
        if (data) {
            // check user is customer or not
            const user = await Customer.findOne({ where: { id: data.id } });
            if (user) {
                req.userId = user.id;
            }
        }
        else {
            return sendError(res, 400, false, "Invalid token")
        }
        next();
    } catch (err) {
        return sendError(res, 500, false, "Something went wrong", err)
    }
}

module.exports = validateUserToken;