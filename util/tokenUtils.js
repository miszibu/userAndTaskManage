var crypto = require('crypto');
var key = '0123456789abcd0123456789';
var iv = '12345678';

var encrypt = function (text) {
    var cipher = crypto.createCipheriv('des3', new Buffer(key), new Buffer(iv));
    var ciph = cipher.update(text, 'utf8', 'base64');
    ciph += cipher.final('base64');
    return ciph;
};


var decrypt = function (text) {
    var decipher = crypto.createDecipheriv('des3', new Buffer(key), new Buffer(iv));
    var planTxt = decipher.update(text, 'base64', 'utf8');
    planTxt += decipher.final('utf8');
    return planTxt;
};


exports.encryptText = encrypt;
exports.decrypt = decrypt;


/**
 * 生成登陆token
 * @param id
 */
exports.getLoginAutoToken = function (id) {
    var planTxt = 'ABC-' + id + '-' + new Date().getTime();
    return encrypt(planTxt);
};

/**
 * 解析登陆token
 * @param token
 * @returns {*}
 */
exports.parseLoginAutoToken = function (token) {
    var planTxt = decrypt(token);
    var arr = planTxt.split('-');
    if (arr.length != 3 || arr[0] != 'ABC') {
        return null;
    }
    var result = {};
    result.userId = arr[1];
    result.timestamp = parseInt(arr[2]);
    return result;
};







