const db = require('../../db/models/index');
const Order = db.orders;
const CryptoJS = require('crypto-js');
const Customer = db.customers;
const Addresses = db.addresses;
const jwt = require('jsonwebtoken');


// add custmoer 
const addCustomer = async (req, res) => {
    try{
        const { first_name, last_name, primary_mobile_number, primary_email, username, password, date_of_birth, secondary_mobile_number, secondary_email } = req.body;
        const encryptedPass = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString();
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

        if(!first_name || !last_name || !primary_mobile_number || !primary_email || !username || !password || !date_of_birth || !secondary_mobile_number || !secondary_email){
            return  res.status(400).send("All fields are required");
        }else if(primary_mobile_number.length !== 10){
            return  res.status(400).send("Primary mobile number must be 10 digits");
        }else if(!regex.test(primary_email)){
            return res.status(400).send("Primary email is not valid");
        }else if(password.length < 8 || password.length > 64){
            return res.status(400).send("Password must be between 8 and 64 characters");   
        }else if(secondary_mobile_number.length !== 10){
            return res.status(400).send("Secondary mobile number must be 10 digits");
        }else if(!regex.test(secondary_email)){
            return res.status(400).send("Secondary email is not valid");
        }else{

            const findCustomer = await Customer.findOne({
                where : {
                    primary_email : primary_email,
                    primary_mobile_number : primary_mobile_number,
                    username : username,
                }
            });

            if(findCustomer){
                return res.status(400).json({
                    success : false,
                    message : "Customer already exists",
                    result : findCustomer
                })
            }else{
                const customer = await Customer.create({
                    first_name,
                    last_name,
                    primary_mobile_number,
                    primary_email,
                    username,
                    password: encryptedPass,
                    date_of_birth,
                    secondary_mobile_number,
                    secondary_email
                });
                return res.status(200).json({
                    success : true,
                    message : "Customer added successfully",
                    result : customer
                });
            }
        }
    }catch(err){
        return res.status(500).json({
            success : false,
            message : "Something went wrong",
            result : err.errors[0].message
        });
    }
}

// add custmoer address 
const addCustomerAddress = async (req, res) => {
    
    const customer_id = CryptoJS.AES.decrypt(req.header('customer_id'), process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
    console.log(customer_id);
    
    // add validationss on address
    try{

        const { address_line_1 , address_line_2 , area , city , state , country , postal_code , landmark } = req.body;

        if(!customer_id || !address_line_1 || !address_line_2 || !area || !city || !state || !country || !postal_code || !landmark){
            return res.status(400).send("All fields are required");
        }else if(postal_code.length !== 6){
            return res.status(400).send("Postal code must be 6 digits");
        }else {
            const findCustomer = await Customer.findOne({
                where : {
                    id : customer_id
                }
            });

            if(!findCustomer){
                return res.status(400).json({
                    success : false,
                    message : "Customer not found",
                    result : null
                })
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
                    landmark
                });
                res.status(200).json({
                    success : true,
                    message : "Address added successfully",
                    result : address
                });
            }
        }
    }catch(err){
        res.status(500).send(err);
    }
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

// login controller for user 

const login = async (req, res) => {
    try{
        const { username, password } = req.body;

        if(!username || !password){
            return res.status(400).send("All fields are required");
        }else{
            const findCustomer = await Customer.findOne({
                where : {
                    username : username,
                } ,
                attributes : ['id', 'first_name', 'last_name', 'username', 'password']
            });

            if(!findCustomer){
                return res.status(400).json({
                    success : false,
                    message : "Customer not found",
                    result : null
                })
            }else{
                const bytes  = CryptoJS.AES.decrypt(findCustomer.password, process.env.SECRET_KEY);
                const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
                if(originalPassword === password){
                    const token = jwt.sign({ id: findCustomer.id }, process.env.SECRET_KEY, {
                        expiresIn: 86400 // 24 hours
                    });
                    return res.status(200).json({
                        success : true,
                        message : "Customer logged in successfully",
                        data : findCustomer,
                        token : token
                    });
                }else{
                    return res.status(400).json({
                        success : false,
                        message : "Password is incorrect",
                        data : null
                    });
                }
            }
        }
    }catch(err){
        return res.status(500).json({
            success : false,
            message : "Something went wrong",
            data : err
        });
    }
}

module.exports = {
    addCustomer,
    addCustomerAddress,
    getCustomerAllOrders,
    login
}