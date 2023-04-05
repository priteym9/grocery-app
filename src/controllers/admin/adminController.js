const db = require('../../db/models/index');
const Admin = db.admins;
const jwt = require('jsonwebtoken');
const APIResponseFormat = require('../../utils/APIResponseFormat');
const { _doEncrypt , _doDecrypt } = require('../../utils/encryption');

const register = async (req, res) => {
    // admin registration logic    
    try {
        let { first_name, last_name, email, password } = req.body;
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        // check if all fields are provided for each loop
        for (let key in req.body) {
            if (!req.body[key]) {
                return APIResponseFormat._ResMissingRequiredField(res, key)
            }
        }
        // check if email is valid
        if (!regex.test(email)) {
            return APIResponseFormat._ResInvalidEmail(res)
        }
        // check if user already exists
        const admin = await Admin.findOne({ where: { email } });
        if (admin) {
            return APIResponseFormat._ResAdminAlreadyExists(res)
        } else {
            // encrypt password
            const encryptedPass = _doEncrypt(password);
            // create admin
            const newAdmin = await Admin.create({ first_name, last_name, email, password: encryptedPass });
            if (newAdmin) {
                return APIResponseFormat._ResAdminRegisterSuccess(res, newAdmin)
            }
        }
    } catch (err) {
        return APIResponseFormat._ResServerError(res, err)
    }
}

const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        // check if all parameters are provided
        if (!email || !password) {
            return APIResponseFormat._ResMissingRequiredField(res, "email or password")
        }

        // check if email is valid
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!regex.test(email)) {
            return APIResponseFormat._ResInvalidEmail(res)
        }
        // check if user exists
        const admin = await Admin.findOne({ where: { email } });
        if (!admin) {
            return APIResponseFormat._ResAdminDoesNotExist(res)
        }
        // decrypt password
        const originalPass = _doDecrypt(admin.password);
        // check if password is correct
        if (originalPass !== password) {
            return APIResponseFormat._ResPasswordIncorrect(res)
        }
        // mapping user id with token
        const adminData = { id: admin.id }
        // create token
        const authToken = jwt.sign(adminData, process.env.SECRET_KEY, { expiresIn: "12h" });
        return APIResponseFormat._ResAdminLoginSuccess(res, {admin , authToken })

    } catch (error) {
        return APIResponseFormat._ResServerError(res, error)
    }
}

const getAdminDetails = async (req, res) => {
    try {
        let adminId = req.adminId;
        const admin = await Admin.findOne({ where: { id: adminId } } );
        if (!admin) {
            return APIResponseFormat._ResAdminDoesNotExist(res)
        }else{
            return APIResponseFormat._ResAdminDetails(res, admin)
        }        
    } catch (error) {
        return APIResponseFormat._ResServerError(res, error)       
    }
}

module.exports = {
    register,
    login,
    getAdminDetails
}