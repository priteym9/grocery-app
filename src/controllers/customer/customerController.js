const db = require('../../db/models/index');
const Customer = db.customers;
const Order = db.orders;

const CryptoJS = require("crypto-js");

const customerPage = async (req, res) => {
    res.send("customer page");
}

// add custmoer 
const addCustomer = async (req, res) => {
    res.send("add customer");
}

// add custmoer address 
const addCustomerAddress = async (req, res) => {
    res.send("add customer address");
}

// get customers all order by customer id
const getCustomerAllOrders = async (req, res) => {
    // Get Customer's all orders by Customer Id
    if(!req.header('customer_id')){
        return res.status(400).json({
            success : false,
            message : "Customer Id is required",
        });
    }
    try{
         // Get Customer's all orders by Customer Id using sequelize
        const customer = await Customer.findOne({
            where: {
                id: CryptoJS.AES.decrypt(req.header('customer_id'), process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8)
            },
            include: [
                {
                    model: Order,
                    as: "orders",
                }
            ]
        });
        if(customer){
            return res.status(200).json({
                success : true,
                message : "Customer's all orders fetched successfully",
                result : customer
            });
        }else{
            return res.status(200).json({
                success : false,
                message : "Customer not found",
                result : null
            });
        }

            
     }
     catch(error){
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message ,
        });
    }

}

module.exports = {
    customerPage,
    addCustomer,
    addCustomerAddress,
    getCustomerAllOrders
}