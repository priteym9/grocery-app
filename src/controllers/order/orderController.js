const db = require('../../db/models/index');
const Order = db.orders;
const Addresses = db.addresses;
const paymentStatusMasters = db.paymentStatusMasters;
const APIResponseFormat = require('../../utils/APIResponseFormat');
const { _doDecrypt } = require('../../utils/encryption');
const OrderItem = db.order_items;



// add order with items
const addOrder = async (req, res) => {
    try {

        const customer_id = req.userId;
        const delivery_address_id = _doDecrypt(req.header('delivery_address_id'));
        const billing_address_id = _doDecrypt(req.header('billing_address_id'));
        const payment_status = _doDecrypt(req.header('payment_status'));
        const order_status = _doDecrypt(req.header('order_status'));

        let { order_date, special_note, estimate_delivery_date, sub_total, tax_amount, discount_amount, total_amount, paid_amount, payment_type, order_products } = req.body;

        // check customer id is not empty
        if (!customer_id) {
            return APIResponseFormat._ResMissingRequiredField(res, "customer_id");
        }
        // check headers fields are not empty
        if (!delivery_address_id || !billing_address_id || !payment_status || !order_status) {
            return APIResponseFormat._ResMissingRequiredField(res, "Headers field");
        }

        // check all fields are not empty
        if (!order_date || !special_note || !estimate_delivery_date || !sub_total || !tax_amount || !discount_amount || !total_amount || !paid_amount || !payment_type) {
            return APIResponseFormat._ResMissingRequiredField(res, "All fields");
        }

        // check order_products is not empty
        if (!order_products || order_products.length == 0) {
            return APIResponseFormat._ResMissingRequiredField(res, "order_products");
        }

        // insert order details in order table then insert order items in order_items table with order_id
        const newOrder = await Order.create({ order_date, special_note, estimate_delivery_date, sub_total, tax_amount, discount_amount, total_amount, paid_amount, payment_type, customer_id, delivery_address_id, billing_address_id, payment_status, order_status });

        if (newOrder) {
            let order_items = [];
            let { order_products } = req.body;
            // foreach  for adding order_id in order_items array
            order_products.forEach((item) => {
                order_items.push({ ...item, order_id: newOrder.id });
            });
            const newOrderItems = await OrderItem.bulkCreate(order_items);
            if (newOrderItems) {
                return APIResponseFormat._ResDataCreated(res, newOrder);
            }
        }
    } catch (error) {
        return APIResponseFormat._ResServerError(res, error);
    }
}

// get order by id
const getOrderById = async (req, res) => {

    // Get Order full details by Order Id
    if (!req.header('order_id')) {
        return APIResponseFormat._ResMissingRequiredField(res, "order_id");
    }
    try {
        const order = await Order.findOne({
            where: {
                id: _doDecrypt(req.header('order_id'))
            },
            include: [
                {
                    model: OrderItem,
                    as: 'order_items',
                    attributes: ['id' , 'order_id','product_id' , 'product_name' , 'qty' , 'product_amount' , 'discount_type' , 'discount_amount']
                } ,
                {
                    model: Addresses,
                    as: 'delivery_address',
                },
                {
                    model: Addresses,
                    as: 'billing_address',
                } ,
                {
                    model: paymentStatusMasters,
                    as: 'payment_status_masters',
                    attributes: ['id', 'title']
                }
            ]
        });
        if (order) {
            return APIResponseFormat._ResDataFound(res, order);
        } else {
            return APIResponseFormat._ResDataNotFound(res, "Order not found");
        }
    } catch (error) {
        return APIResponseFormat._ResServerError(res, error);
    }
}

module.exports = {
    addOrder,
    getOrderById
}