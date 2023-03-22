const db = require('../../db/models/index');
const Order = db.orders;
const CryptoJS = require("crypto-js");
const OrderItem = db.order_items;



// add order with items
const addOrder = async (req, res) => {
    const { customer_id, delivery_address_id, shipping_address_id, payment_status, order_status } = req.headers;
    const { order_number, order_date, special_note, estimated_delivery_date, sub_total, tax_amout, discount_amount, total_amount, paid_amount, payment_type } = req.body;

    try {
        // check headers fields are not empty
        if (!customer_id || !delivery_address_id || !shipping_address_id || !payment_status || !order_status) {
            return res.status(400).json({ success: false, message: "All headers fields are required" });
        }

        // for loop for checking all fields are not empty
        for (let key in req.body) {
            if (req.body[key] === "") return res.status(400).json({ success: false, message: `${key} is required` });
        }

        // insert order details in order table then insert order items in order_items table with order_id
        const newOrder = await Order.create({ order_number, order_date, special_note, estimated_delivery_date, sub_total, tax_amout, discount_amount, total_amount, paid_amount, payment_type, customer_id, delivery_address_id, shipping_address_id, payment_status, order_status });

        if (newOrder) {
            let order_items = [];
            let { order_products } = req.body;
            // foreach  for adding order_id in order_items array
            order_products.forEach((item) => {
                order_items.push({ ...item, order_id: newOrder.id });
            });
            const newOrderItems = await OrderItem.bulkCreate(order_items);
            if (newOrderItems) {
                return res.status(201).json({ success: true, message: "Order created successfully", data: newOrder });
            }
        }
    } catch (error) {
        return res.status(500).json({ success: true, message: "Internal server error", error: error.message });
    }
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
    addOrder,
    getOrderById
}