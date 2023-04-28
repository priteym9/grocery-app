const db = require('../../db/models/index');
const Admin = db.admins;
const Customer = db.customers;
const Order = db.orders;
const OrderItem = db.order_items;
const Addresses = db.addresses;
const jwt = require('jsonwebtoken');
const APIResponseFormat = require('../../utils/APIResponseFormat');
const { _doEncrypt, _doDecrypt } = require('../../utils/encryption');

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
        return APIResponseFormat._ResAdminLoginSuccess(res, { id: admin.id, first_name: admin.first_name, last_name: admin.last_name, email: admin.email, token: authToken })

    } catch (error) {
        return APIResponseFormat._ResServerError(res, error)
    }
}

const getAdminDetails = async (req, res) => {
    try {
        let adminId = req.adminId;
        const admin = await Admin.findOne({ where: { id: adminId } });
        if (!admin) {
            return APIResponseFormat._ResAdminDoesNotExist(res)
        } else {
            return APIResponseFormat._ResAdminDetails(res, admin)
        }
    } catch (error) {
        return APIResponseFormat._ResServerError(res, error)
    }
}

const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll();
        return APIResponseFormat._ResDataFound(res, customers)
    } catch (error) {
        return APIResponseFormat._ResServerError(res, error)
    }
}

const blockCustomer = async (req, res) => {
    try {
        let customer_id = req.header('customer_id');
        if (!customer_id) {
            return APIResponseFormat._ResMissingRequiredField(res, "customer_id")
        }

        customer_id = _doDecrypt(customer_id);
        const customer = await Customer.findOne({ where: { id: customer_id } });
        if (!customer) {
            return APIResponseFormat._ResUserDoesNotExist(res)
        } else {
            const updatedCustomer = await Customer.update({ is_active: false }, { where: { id: customer_id } });
            if (updatedCustomer) {
                return APIResponseFormat._ResDataUpdated(res, updatedCustomer)
            }
        }
    } catch (error) {
        return APIResponseFormat._ResServerError(res, error)
    }
}

const unblockCustomer = async (req, res) => {
    try {
        let customer_id = req.header('customer_id');
        if (!customer_id) {
            return APIResponseFormat._ResMissingRequiredField(res, "customer_id")
        }

        customer_id = _doDecrypt(customer_id);
        const customer = await Customer.findOne({ where: { id: customer_id } });
        if (!customer) {
            return APIResponseFormat._ResUserDoesNotExist(res)
        } else {
            const updatedCustomer = await Customer.update({ is_active: true }, { where: { id: customer_id } });
            if (updatedCustomer) {
                return APIResponseFormat._ResDataUpdated(res, updatedCustomer)
            }
        }
    } catch (error) {
        return APIResponseFormat._ResServerError(res, error)
    }
}

const deleteCustomer = async (req, res) => {
    try {
        let customer_id = req.header('customer_id');
        if (!customer_id) {
            return APIResponseFormat._ResMissingRequiredField(res, "customer_id")
        }

        customer_id = _doDecrypt(customer_id);
        const customer = await Customer.findOne({ where: { id: customer_id } });
        if (!customer) {
            return APIResponseFormat._ResUserDoesNotExist(res)
        }

        // delete customer and all his/her orders and order items
        const Order_id = await Order.findAll({ where: { customer_id } });
        for (let i = 0; i < Order_id.length; i++) {
            const order_id = Order_id[i].id;
            const deleteOrderItems = await OrderItem.destroy({ where: { order_id } });
            const deleteOrder = await Order.destroy({ where: { id: order_id } });
        }

        const deleteCustomerAddress = await Addresses.destroy({ where: { customer_id } });
        const deleteCustomer = await Customer.destroy({ where: { id: customer_id } });
        if (deleteCustomer) {
            return APIResponseFormat._ResDataDeleted(res, deleteCustomer)
        }



    } catch (error) {
        return APIResponseFormat._ResServerError(res, error)
    }
}





            

module.exports = {
    register,
    login,
    getAdminDetails ,
    getAllCustomers ,
    blockCustomer ,
    unblockCustomer ,
    deleteCustomer
}