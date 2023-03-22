const db = require('../../db/models/index');
const Order = db.orders;
const CryptoJS = require("crypto-js");

const orderPage = async (req, res) => {
    res.send("order page");
}

// add order with items
const addOrder = async (req, res) => {
    res.send("add order");
}

// get order by id
const getOrderById = async (req, res) => {
    
    // Get Order full details by Order Id
    if(!req.header('order_id')){
        return res.status(400).json({
            success : false,
            message : "Order Id is required",
        });
    }
    try{
        const order = await Order.findOne({
            where: {
                id: CryptoJS.AES.decrypt(req.header('order_id'), process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8)
            }
        });
        if(order){
            return res.status(200).json({
                success : true,
                message : "Order fetched successfully",
                result : order
            });
        }else{
            return res.status(200).json({
                success : false,
                message : "Order not found",
                result : null
            });
        }
    }catch(error){
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message ,
        });
    }
}

module.exports = {
    orderPage,
    addOrder,
    getOrderById
}