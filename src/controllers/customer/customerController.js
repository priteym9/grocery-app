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
    res.send("get customer all orders");
}

module.exports = {
    customerPage,
    addCustomer,
    addCustomerAddress,
    getCustomerAllOrders
}