const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/sendResponse');

const validateToken = (req, res, next) => {
    const token = req.header('token');
    if (!token) {
        return sendError(res, 400, false, "Token is required", err)
    }
    try {
        const data = jwt.verify(token, process.env.SECRET_KEY);
        if(data){
            req.id = data.id;
        }
        else{
            return sendError(res, 400, false, "Invalid token", err)
        }
        next();
    } catch (err) {
        return sendError(res, 500, false, "Something went wrong", err)
    }
}

module.exports = validateToken;