const CryptoJS = require('crypto-js');

const _doEncrypt = (id) => {
     let _key = CryptoJS.SHA256(process.env.SECRET_KEY);
     let _iv = CryptoJS.enc.Base64.parse(" ");

     let _encrypted = CryptoJS.AES.encrypt(id, _key, {
            keySize: 32,
            iv: _iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
     });

    return _encrypted.toString();
};

const _doDecrypt = (id) => {
    let _key = CryptoJS.SHA256(process.env.SECRET_KEY);
    let _iv = CryptoJS.enc.Base64.parse(" ");

    // console.log(_key, _iv);

    let _decrypted = CryptoJS.AES.decrypt(id, _key, {
            keySize: 32,
            iv: _iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);

    console.log(_decrypted);

    return _decrypted;
};

module.exports = {
     _doEncrypt,
     _doDecrypt
};