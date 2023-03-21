const orderPage = async (req, res) => {
    res.send("order page");
}

// add order with items
const addOrder = async (req, res) => {
    res.send("add order");
}

// get order by id
const getOrderById = async (req, res) => {
    res.send("get order by id");
}

module.exports = {
    orderPage,
    addOrder,
    getOrderById
}