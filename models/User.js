/**
 * Created by muyonghui on 16/3/1.
 */
var base = require('./Base');
var ObjectId = base.ObjectId;
var UserSchema = new base.Schema({
    username:String,
    password:String,
    mobile:String,
    taskid:String,
    state:String
});

UserSchema.index({mobile:1},{"background":true});

var UserEntity = base.mongoose.model('UserEntity',UserSchema,'user');

exports.UserEntity = UserEntity;