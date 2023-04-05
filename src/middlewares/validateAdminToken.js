const jwt = require('jsonwebtoken');
const APIResponseFormat = require('../utils/APIResponseFormat');
const db = require('../db/models/index');
const Admin = db.admins;

const validateAdminToken = async (req, res, next) => {
    const token = req.header('token');
    if (!token) {
        return APIResponseFormat._ResMissingRequiredField(res, "Token is required");
    }
    try {
        const data = jwt.verify(token, process.env.SECRET_KEY);
        if (data) {
            // check user is admin or not
            const admin = await Admin.findOne({ where: { id: data.id } });
            if (admin) {
                req.adminId = data.id;
            }else {
                return APIResponseFormat._ResDataNotExists(res , "Admin not found");
            }
        }
        else {
            return APIResponseFormat._ResInvalidCredentials(res);
        }
        next();
    } catch (err) {
        return APIResponseFormat._ResServerError(res, err);
    }
}

module.exports = validateAdminToken;