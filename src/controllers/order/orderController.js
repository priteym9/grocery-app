const db = require('../../db/models/index');
const Order = db.orders;
const APIResponseFormat = require('../../utils/APIResponseFormat');
const { _doDecrypt } = require('../../utils/encryption');
const OrderItem = db.order_items;



// add order with items
const addOrder = async (req, res) => {

    const customer_id = req.userId;
    const delivery_address_id = _doDecrypt(req.headers('delivery_address_id'));
    const shipping_address_id = _doDecrypt(req.headers('shipping_address_id')); 
    const payment_status = _doDecrypt(req.headers('payment_status'));
    const order_status = _doDecrypt(req.headers('order_status'));
     
    const { order_date, special_note, estimate_delivery_date, sub_total, tax_amout, discount_amount, total_amount, paid_amount, payment_type } = req.body;

    try {
        // check customer id is not empty
        if (!customer_id) {
            return APIResponseFormat._ResMissingRequiredField(res, "customer_id is required");
        }
        // check headers fields are not empty
        if (!delivery_address_id || !shipping_address_id || !payment_status || !order_status) {
            return APIResponseFormat._ResMissingRequiredField(res, "Headers fields are required");
        }

        // for loop for checking all fields are not empty
        for (let key in req.body) {
            if (req.body[key] === "") return APIResponseFormat._ResMissingRequiredField(res, key);
        }

        // insert order details in order table then insert order items in order_items table with order_id
        const newOrder = await Order.create({  order_date, special_note, estimate_delivery_date, sub_total, tax_amout, discount_amount, total_amount, paid_amount, payment_type, customer_id, delivery_address_id, shipping_address_id, payment_status, order_status });

        if (newOrder) {
            let order_items = [];
            let { order_products } = req.body;
            // foreach  for adding order_id in order_items array
            order_products.forEach((item) => {
                order_items.push({ ...item, order_id: newOrder.id });
            });
            const newOrderItems = await OrderItem.bulkCreate(order_items);
            if (newOrderItems) {
                return APIResponseFormat._ResDataCreated(res,newOrder);
            }
        }
    } catch (error) {
        return APIResponseFormat._ResServerError(res, error);
    }
}

// get order by id
const getOrderById = async (req, res) => {
    
    // Get Order full details by Order Id
    if(!req.header('order_id')){
        return APIResponseFormat._ResMissingRequiredField(res, "order_id is required");
    }
    try{
        const order = await Order.findOne({
            where: {
                id: _doDecrypt(req.header('order_id'))
            }
        });
        if(order){
            return APIResponseFormat._ResDataFound(res, order);
        }else{
            return APIResponseFormat._ResDataNotFound(res, "Order not found");
        }
    }catch(error){
        return APIResponseFormat._ResServerError(res, error);
    }
}

module.exports = {
    addOrder,
    getOrderById
}