const db = require('../../db/models/index');
const APIResponseFormat = require('../../utils/APIResponseFormat');
const Order = db.orders;
const Customer = db.customers;
const Addresses = db.addresses;
const OrderItems = db.order_items;
const Product = db.products;
const {Op} = require("sequelize"); 
const jwt = require('jsonwebtoken');
const { _doEncrypt , _doDecrypt } = require('../../utils/encryption');


const updateCustomer = async (req, res) => {
    try{
        const customer_id = req.userId;
        const { first_name, last_name,  date_of_birth, secondary_mobile_number, secondary_email } = req.body;
        if(!customer_id){
            return APIResponseFormat._ResMissingRequiredField(res, "Customer id");
        }else if(!first_name || !last_name || !date_of_birth || !secondary_mobile_number || !secondary_email){
            return APIResponseFormat._ResMissingRequiredField(res, "All fields");
        }else if(secondary_mobile_number.length !== 10){
            return APIResponseFormat._ResMissingRequiredField(res, "Secondary mobile number must be 10 digits");
        }else if(secondary_email.length < 8 || secondary_email.length > 64){
            return APIResponseFormat._ResMissingRequiredField(res, "Secondary email must be between 8 and 64 characters");
        }else{
            const findCustomer = await Customer.findOne({
                where : {
                    id : customer_id
                }
            });
            if(findCustomer){
                const customer = await Customer.update({
                    first_name : first_name,
                    last_name : last_name,
                    date_of_birth : date_of_birth,
                    secondary_mobile_number : secondary_mobile_number,
                    secondary_email : secondary_email
                }, {
                    where : {
                        id : customer_id
                    }
                });
                return APIResponseFormat._ResDataUpdated(res, customer);
            }else{
                return APIResponseFormat._ResUserDoesNotExist(res);
            }
        }
    }catch(err){
        return APIResponseFormat._ResServerError(res, err);
    }   
}


// add custmoer address 
const addCustomerAddress = async (req, res) => {
    // add validationss on address
    try{
        const customer_id = req.userId;
        const { address_line_1 , address_line_2 , area , city , state , country , postal_code , landmark, tag } = req.body;

        if(!customer_id || !address_line_1 || !address_line_2 || !area || !city || !state || !country || !postal_code || !landmark){
            return APIResponseFormat._ResMissingRequiredField(res, "All fields");
        }else if(postal_code.length !== 6){
            return APIResponseFormat._ResMissingRequiredField(res, "Postal code must be 6 digits");
        }else {
            const findCustomer = await Customer.findOne({
                where : {
                    id : customer_id
                }
            });

            if(!findCustomer){
                return APIResponseFormat._ResUserDoesNotExist(res);
            }else{
                const address = await Addresses.create({
                    customer_id,
                    address_line_1,
                    address_line_2,
                    area,
                    city,
                    state,
                    country,
                    postal_code,
                    landmark,
                    tag
                });
                return APIResponseFormat._ResDataCreated(res, address);
            }
        }
    }catch(error){
        return APIResponseFormat._ResServerError(res, error);
    }
}

const updateCustomerAddress = async (req, res) => {
    try{
        const customer_id = req.userId;
        let address_id = req.header('address_id');
        address_id = _doDecrypt(address_id);
        if(!address_id){
            return APIResponseFormat._ResMissingRequiredField(res, "Address id");
        }
        const { address_line_1 , address_line_2 , area , city , state , country , postal_code , landmark, tag } = req.body;
        if(!customer_id || !address_id || !address_line_1 || !address_line_2 || !area || !city || !state || !country || !postal_code || !landmark){
            return APIResponseFormat._ResMissingRequiredField(res, "All fields");
        }else if(postal_code.length !== 6){
            return APIResponseFormat._ResMissingRequiredField(res, "Postal code must be 6 digits");
        }else {
            const findCustomer = await Customer.findOne({
                where : {
                    id : customer_id
                }
            });
            if(!findCustomer){
                return APIResponseFormat._ResUserDoesNotExist(res);
            }else{
                // check if address belongs to customer
                const findAddress = await Addresses.findOne({
                    where : {
                        [Op.and] : [
                            { id : address_id },
                            { customer_id : customer_id }
                        ]
                    }
                });
                if(!findAddress){
                    return APIResponseFormat._ResDataNotExists(res, "Address id does not belong to this customer");
                }else{
                    const address = await Addresses.update({
                        address_line_1,
                        address_line_2,
                        area,
                        city,
                        state,
                        country,
                        postal_code,
                        landmark,
                        tag
                    }, {
                        where : {
                            id : address_id
                        }
                    });
                    return APIResponseFormat._ResDataUpdated(res, address);
                }
            }
        }
    }catch(error){
        return APIResponseFormat._ResServerError(res, error);
    }
}


const deleteAddress = async (req, res) => {
    try{
        const customer_id = req.userId;
        const address_id  = _doDecrypt(req.header('address_id'));
        if(!customer_id || !address_id){
            return APIResponseFormat._ResMissingRequiredField(res, "All fields");
        }else{
            const findCustomer = await Customer.findOne({
                where : {
                    id : customer_id
                }
            });
            if(!findCustomer){
                return APIResponseFormat._ResUserDoesNotExist(res);
            }else{
                const findAddress = await Addresses.findOne({
                    where : {
                        id : address_id
                    }
                });
                if(!findAddress){
                    return APIResponseFormat._ResDataNotFound(res);
                }else{
                    const address = await Addresses.destroy({
                        where : {
                            id : address_id
                        }
                    });
                    return APIResponseFormat._ResDataDeleted(res, address);
                }
            }
        }
    }catch(error){
        return APIResponseFormat._ResServerError(res, error);
    }
}


// get customers all order by customer id
const getCustomerAllOrders = async (req, res) => {
    try{
        const customer_id = req.userId;
         // Get Customer's all orders by Customer Id using sequelize
        const customer = await Customer.findOne({
            where: {
                id: customer_id
            },
            // Order Details with Order Items
            include: [
                {
                    model: Order ,
                    as: 'orders',
                    include: [
                        {
                            model: OrderItems,
                            as: 'order_items',
                            include: [
                                {
                                    model: Product,
                                    as: 'product',
                                }
                            ]
                        }
                    ]
                }
            ]
            
        });
        if(customer){
            return APIResponseFormat._ResDataFound(res, customer);
        }else{
            return APIResponseFormat._ResUserDoesNotExist(res);
        }           
     }
     catch(error){
        return APIResponseFormat._ResServerError(res, error);
    }

}

const login = async (req, res) => {
    try{
        const { username, password } = req.body;

        if(!username || !password){
            return APIResponseFormat._ResMissingRequiredField(res, "All fields");
        }else{
            const findCustomer = await Customer.findOne({
                where : {
                    username : username,
                } ,
            });
            if(!findCustomer){
                return APIResponseFormat._ResUserDoesNotExist(res);
            }else{
                const originalPassword = _doDecrypt(findCustomer.password);
                if(originalPassword === password){
                    const token = jwt.sign({ id: findCustomer.id }, process.env.SECRET_KEY, {
                        expiresIn: 86400 // 24 hours
                    });
                    return APIResponseFormat._ResLoginSuccess(res, {
                        user : {
                            first_name : findCustomer.first_name,
                            last_name : findCustomer.last_name,
                            username : findCustomer.username
                        },
                        token : token
                    });
                }else{
                    return APIResponseFormat._ResPasswordIncorrect(res);
                }
            }
        }
    }catch(error){
        return APIResponseFormat._ResServerError(res, error);

    }
}


const register = async (req , res) => {
    try {
        const { first_name , last_name , primary_mobile_number , primary_email , username , password  } = req.body;
        const encryptedPass = _doEncrypt(password);
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if(!first_name || !last_name || !primary_mobile_number || !primary_email || !username || !password){
            return APIResponseFormat._ResMissingRequiredField(res, "All fields");
        }else if(primary_mobile_number.length !== 10){
            return APIResponseFormat._ResMissingRequiredField(res, "Primary mobile number must be 10 digits");
        }else if(!regex.test(primary_email)){
            return APIResponseFormat._ResInvalidEmail(res);
        }else{
            const findCustomer = await Customer.findOne({
               where :{
                   [Op.or] : [
                          { primary_mobile_number : primary_mobile_number },
                            { primary_email : primary_email },
                            { username : username }
                   ]
               }
            });
            if(findCustomer){
                return APIResponseFormat._ResUserAlreadyExists(res);
            }else{
                const customer = await Customer.create({
                    first_name,
                    last_name,
                    primary_mobile_number,
                    primary_email,
                    username,
                    password : encryptedPass
                });
                return APIResponseFormat._ResRegisterSuccess(res, customer);
            }
        }

    }catch(error) {
        return APIResponseFormat._ResServerError(res, error);
    }

}

const getUserDetails = async (req, res) => {
    try {
        let userId = req.userId;
        const user = await Customer.findOne({
            where: {
                id: userId
            },
            include: [
                {
                    model: Addresses,
                    as: "addresses",
                }
            ]
        });
        // console.log(user);
        if (!user) {
            return APIResponseFormat._ResUserDoesNotExist(res);
        }else{
            return APIResponseFormat._ResDataFound(res, user);
        }        
    } catch (error) {
        return APIResponseFormat._ResServerError(res, error);        
    }
}

// change password 

const changePassword = async (req , res) => {
    try{
        let userId = req.userId;
        const { oldPassword , newPassword } = req.body;
        const findCustomer = await Customer.findOne({
            where : {
                id : userId
            }
        });
        if(!findCustomer){
            return APIResponseFormat._ResDataNotExists(res, "Customer not found");
        }else{
            const originalPassword = _doDecrypt(findCustomer.password);
            if(originalPassword === oldPassword){
                const newPass = _doEncrypt(newPassword);
                const user = await Customer.update({
                    password : newPass
                },{
                    where : {
                        id : userId
                    }
                });
                return APIResponseFormat._ResDataUpdated(res, user);
            }else{
                return APIResponseFormat._ResPasswordIncorrect(res);
            }
        }

    }catch(err){
        return APIResponseFormat._ResServerError(res, err);
    }
}


module.exports = {
    addCustomerAddress,
    getCustomerAllOrders,
    login,
    register,
    getUserDetails,
    updateCustomer,
    changePassword ,
    updateCustomerAddress ,
    deleteAddress
    
}