const db = require('../../db/models/index');
const Order = db.orders;
const CryptoJS = require("crypto-js");
const { sendError, sendSuccess } = require('../../utils/sendResponse');
const OrderItem = db.order_items;



// add order with items
const addOrder = async (req, res) => {

    const customer_id = req.userId;
    const { delivery_address_id, shipping_address_id, payment_status, order_status } = req.headers;
    const { order_number, order_date, special_note, estimated_delivery_date, sub_total, tax_amout, discount_amount, total_amount, paid_amount, payment_type } = req.body;

    try {
        // check customer id is not empty
        if (!customer_id) {
            return sendError(res, 400, false, "Customer id is required");
        }
        // check headers fields are not empty
        if (!delivery_address_id || !shipping_address_id || !payment_status || !order_status) {
            return sendError(res, 400, false, "All headers are required");
        }

        // for loop for checking all fields are not empty
        for (let key in req.body) {
            if (req.body[key] === "") return sendError(res, 400, false, `${key} is required`);
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
                return sendSuccess(res, 201, true, "Order created successfully", newOrder);
            }
        }
    } catch (error) {
        return sendError(res, 500, false, "Something went wrong", error);
    }
}

// get order by id
const getOrderById = async (req, res) => {
    
    // Get Order full details by Order Id
    if(!req.header('order_id')){
        return sendError(res, 400, false, "Order Id is required");
    }
    try{
        const order = await Order.findOne({
            where: {
                id: CryptoJS.AES.decrypt(req.header('order_id'), process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8)
            }
        });
        if(order){
            return sendSuccess(res, 200, true, "Order found", order);
        }else{
            return sendError(res, 400, false, "Order not found");
        }
    }catch(error){
        return sendError(res, 500, false, "Something went wrong", error);
    }
}

module.exports = {
    addOrder,
    getOrderById
}