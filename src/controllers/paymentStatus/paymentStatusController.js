const db = require('../../db/models/index');
const Payment_Status_Master = db.paymentStatusMaster
const APIResponseFormat = require('../../utils/APIResponseFormat');


// Create API to get master data from the payment master

const getMasterData = async (req, res) => {
    try {
        const paymentMaster = await Payment_Status_Master.findAll({
            attributes: ['id', 'title']
        });
        if(paymentMaster.length > 0){
            return APIResponseFormat._ResDataFound(res, paymentMaster)
        } else {
            return APIResponseFormat._ResDataNotFound(res)
        }
    } catch (error) {
        return APIResponseFormat._ResServerError(res, error)
    }
}

module.exports = {
    getMasterData
}
