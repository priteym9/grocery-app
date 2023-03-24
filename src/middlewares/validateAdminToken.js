const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/sendResponse');
const db = require('../db/models/index');
const Admin = db.admins;

const validateAdminToken = async (req, res, next) => {
    const token = req.header('token');
    if (!token) {
        return sendError(res, 400, false, "Token is required")
    }
    try {
        const data = jwt.verify(token, process.env.SECRET_KEY);
        if (data) {
            // check user is admin or not
            const admin = await Admin.findOne({ where: { id: data.id } });
            if (admin) {
                req.adminId = data.id;
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

module.exports = validateAdminToken;