const db = require('../../db/models/index');
const Admin = db.admins;
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const { sendError, sendSuccess } = require('../../utils/sendResponse');

const register = async (req, res) => {
    // admin registration logic    
    try {
        let { first_name, last_name, email, password } = req.body;
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        // check if all fields are provided for each loop
        for (let key in req.body) {
            if (!req.body[key]) {
                return sendError(res, 400, false, `${key} is required`)
            }
        }
        // check if email is valid
        if (!regex.test(email)) {
            return sendError(res, 400, false, "Email is not valid")
        }
        // check if user already exists
        const admin = await Admin.findOne({ where: { email } });
        if (admin) {
            return sendError(res, 400, false, "Admin already exists")
        } else {
            // encrypt password
            const encryptedPass = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString();
            // create admin
            const newAdmin = await Admin.create({ first_name, last_name, email, password: encryptedPass });
            if (newAdmin) {
                return sendSuccess(res, 201, true, "Admin created successfully", newAdmin)
            }
        }
    } catch (err) {
        return sendError(res, 500, false, "Something went wrong", err)
    }
}

const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        // check if all fields are provided for each loop
        for (let key in req.body) {
            if (!req.body[key]) {
                return sendError(res, 400, false, `${key} is required`)
            }
        }
        // check if email is valid
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!regex.test(email)) {
            return sendError(res, 400, false, "Email is not valid")
        }
        // check if user exists
        const admin = await Admin.findOne({ where: { email } });
        if (!admin) {
            return sendError(res, 400, false, "Admin does not exist")
        }
        // decrypt password
        const bytes = CryptoJS.AES.decrypt(admin.password, process.env.SECRET_KEY);
        const originalPass = bytes.toString(CryptoJS.enc.Utf8);
        // check if password is correct
        if (originalPass !== password) {
            return sendError(res, 400, false, "Password is incorrect")
        }
        // mapping user id with token
        const adminData = { id: admin.id }
        // create token
        const authToken = jwt.sign(adminData, process.env.SECRET_KEY, { expiresIn: "12h" });
        return sendSuccess(res, 200, true, "Admin logged in successfully", authToken)
    } catch (error) {
        return sendError(res, 500, false, "Something went wrong", error)
    }
}

module.exports = {
    register,
    login
}