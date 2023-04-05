const jwt = require('jsonwebtoken');
const APIResponseFormat = require('../utils/APIResponseFormat');
const db = require('../db/models/index');
const Customer = db.customers;

const validateUserToken = async (req, res, next) => {
    const token = req.header('token');
    if (!token) {
        return APIResponseFormat._ResMissingRequiredField(res, "Token is required");
    }
    try {
        const data = jwt.verify(token, process.env.SECRET_KEY);
        if (data) {
            // check user is customer or not
            const user = await Customer.findOne({ where: { id: data.id } });
            if (user) {
                req.userId = user.id;
            }else {
                return APIResponseFormat._ResDataNotExists(res , "User not found");
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

module.exports = validateUserToken;