/**
 * Created by muyonghui on 16/3/1.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/my_app_3');

//mongoose.connection.on('open');

exports.mongoose = mongoose;


exports.isNotNeedLoginUrlRegs = [
    /^(\/)+users(\/)+login/,
    /^(\/)+users(\/)+register/,
];

