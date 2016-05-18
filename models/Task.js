/**
 * Created by muyonghui on 16/3/11.
 */
var base = require('./Base');
var ObjectId = base.ObjectId;
var TaskSchema = new base.Schema({
    tasktitle:String,
    announcer:String,
    recipient:String,
    taskcontent:String,
    publishtime:{type:Date,default:Date.now},
    finishtime:Date,
    deadline:String,
    fininshed:{type:String,default:'未完成'}
});

TaskSchema.index({announcer:1},{"background":true});

var TaskEntity = base.mongoose.model('TaskEntity',TaskSchema,'task');

exports.TaskEntity = TaskEntity;