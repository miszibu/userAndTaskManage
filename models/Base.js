/**
 * Created by muyonghui on 16/3/1.
 */

var mongodb = require('../config/config');
var mongoose = mongodb.mongoose;
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

exports.mongodb = mongodb;
exports.mongoose = mongoose;
exports.Schema = Schema;
exports.ObjectId = ObjectId;
exports.Mixed = Schema.Types.Mixed;