// dyanamic send response and error handling

const sendResponse = (res, status, success, message, result) => {
    res.status(status).json({
        success : success,
        message : message,
        data : result
    });
}

const sendError = (res, status, success, message, error) => {
    res.status(status).json({
        success : success,
        message : message,
        error : error
    });
}

module.exports = {
    sendResponse,
    sendError
}
