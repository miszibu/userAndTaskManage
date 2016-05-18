/**
 * Created by yong_pliang on 15/7/22.
 */
//Array 工具 start
var ArrayUtils = {};
ArrayUtils.each = function (arr, fn) {
    if (!arr || !arr.length) {
        return;
    }
    var count = arr.length;
    for (var i = 0; i < count; i++) {
        var b = fn(arr[i], i);
        if (b === false) {//返回false表示接受数组的遍历
            return;
        }
    }
};

ArrayUtils.contains = function (arr, e) {
    var retVal = false;
    ArrayUtils.each(arr, function (e1) {
        if (e1 == e) {
            retVal = true;
            return false;
        }
    });
    return retVal;
};

exports.ArrayUtils = ArrayUtils;
//Array 工具 end

//String 工具 start
var StringUtils = {};


StringUtils.isNotEmpty = function (str) {
    if (str) {
        return str.length ? true : false;
    }
    return false;
};

StringUtils.isEmpty = function (str) {
    return !StringUtils.isNotEmpty(str);
};

StringUtils.trim = function (str) {
    return str ? str.trim() : str;

};

exports.StringUtils = StringUtils;
//String 工具 end


