const db = require("../db/models");

class APIResponseFormat {
    constructor(status, success , message, data , error) {
        this.status = status;
        this.success = success;
        this.message = message;
        this.data = data;
        this.error = error;
    }
}

const _ResMissingRequiredField = (res, field) => {
    res.status(400).json(new APIResponseFormat(400, false, `${field} required`));
}

const _ResInvalidEmail = (res) => {
    res.status(400).json(new APIResponseFormat(400, false, "Email is not valid"));
}

const _ResUserAlreadyExists = (res) => {
    res.status(400).json(new APIResponseFormat(400, false, "User already exists"));
}

const _ResUserDoesNotExist = (res) => {
    res.status(400).json(new APIResponseFormat(400, false, "Customer does not exist"));
}

const _ResAdminAlreadyExists = (res) => {
    res.status(400).json(new APIResponseFormat(400, false, "Admin already exists"));
}

const _ResAdminDoesNotExist = (res) => {
    res.status(400).json(new APIResponseFormat(400, false, "Admin does not exist"));
}

const _ResAdminDetails = (res, admin) => {
    res.status(200).json(new APIResponseFormat(200, true, "Admin details", admin));
}


const _ResPasswordIncorrect = (res) => {
    res.status(400).json(new APIResponseFormat(400, false, "Password is incorrect"));
}

const _ResServerError = (res, err) => {
    res.status(500).json(new APIResponseFormat(500, false, "Internal server error", null, err));
}

const _ResInvalidCredentials = (res) => {
    res.status(401).json(new APIResponseFormat(401, false, "Invalid credentials"));
}



const _ResLoginSuccess = (res, user) => {
    res.status(200).json(new APIResponseFormat(200, true, "Login successful", user));
}

const _ResRegisterSuccess = (res, user) => {
    res.status(201).json(new APIResponseFormat(201, true, "Register successful", user));
}

const _ResDataNotFound = (res) => {
    res.status(404).json(new APIResponseFormat(404, false, "Data not found"));
}

const _ResDataFound = (res, data) => {
    res.status(200).json(new APIResponseFormat(200, true, "Data found", data));
}

const _ResDataCreated = (res, data) => {
    res.status(201).json(new APIResponseFormat(201, true, "Data created", data));
}

const _ResDataUpdated = (res, data) => {
    res.status(200).json(new APIResponseFormat(200, true, "Data updated", data));
}


const _ResDataAlreadyExists = (res) => {
    res.status(400).json(new APIResponseFormat(400, false, "Data already exists"));
}

const _ResDataNotExists = (res , message) => {
    res.status(400).json(new APIResponseFormat(400, false, message));
}

const _ResAdminLoginSuccess = (res, admin) => {
    res.status(200).json(new APIResponseFormat(200, true, "Admin Login successful", admin));
}

const _ResAdminRegisterSuccess = (res, admin) => {
    res.status(201).json(new APIResponseFormat(201, true, "Admin Register successful", admin));
}


const _ResRouteNotFound = (res) => {
    res.status(404).json(new APIResponseFormat(404, false, "Route not found"));
}

const _ResDataDeleted = (res , data) => {
    res.status(200).json(new APIResponseFormat(200, true, "Data deleted" , data));
}








module.exports = {
    _ResMissingRequiredField,
    _ResInvalidEmail,
    _ResUserAlreadyExists,
    _ResUserDoesNotExist,
    _ResPasswordIncorrect,
    _ResServerError,
    _ResInvalidCredentials,
    _ResLoginSuccess,
    _ResRegisterSuccess,
    _ResDataNotFound,
    _ResDataFound,
    _ResDataCreated,
    _ResDataUpdated,
    _ResDataAlreadyExists,
    _ResAdminAlreadyExists,
    _ResAdminDoesNotExist ,
    _ResAdminDetails ,
    _ResDataNotExists ,
    _ResAdminLoginSuccess ,
    _ResRouteNotFound ,
    _ResAdminRegisterSuccess,
    _ResDataDeleted

}


