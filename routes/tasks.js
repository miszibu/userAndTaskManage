var express = require('express');
var router = express.Router();

var RestResult = require('../RestResult');


var UserEntity = require('../models/User').UserEntity;
var TaskEntity = require('../models/Task').TaskEntity;


router.get('/', function (req, res, next) {
    TaskEntity.find(function (err, tasks) {
        if (err) {
            res.error(RestResult.SERVER_EXCEPTION_ERROR_CODE, "服务器异常");
            return;
        }
        res.success(tasks);
    });
});


router.post('/add', function (req, res, next) {

    var tasktitle = req.body.tasktitle;
    var taskcontent = req.body.taskcontent;
    var deadline = req.body.deadline;

    var loginUserId = req.loginUserId;
    UserEntity.findById(loginUserId, function (err, users) {
        var registerTask = new TaskEntity({
            tasktitle: tasktitle,
            taskcontent: taskcontent,
            announcer: users.username,
            deadline: deadline
        });
        //调用实体的实例的保存方法
        registerTask.save(function (err, row) {
            if (err) {//服务器保存异常
                res.error(RestResult.SERVER_EXCEPTION_ERROR_CODE, "服务器异常");
                return;
            }
            res.success(registerTask);

        });
    });
});


router.post('/get_task', function (req, res, next) {
    var taskid = req.body.taskid;
    var loginUserId = req.loginUserId;
    UserEntity.findByIdAndUpdate(loginUserId, {$set:{taskid:taskid}}, function (err, user) {
        if (err) {//服务器保存异常
            res.error(RestResult.SERVER_EXCEPTION_ERROR_CODE, "服务器异常");
            return;
        }
        TaskEntity.findByIdAndUpdate(taskid, {$set:{recipient:user.username}}, function (err, task) {
            if (err) {//服务器保存异常
                res.error(RestResult.SERVER_EXCEPTION_ERROR_CODE, "服务器异常");
                return;
            }
            res.success({user:user,task:task})
        });
    });
});


router.post('/finish', function (req, res, next) {
    var taskid = req.body.taskid;
    var loginUserId = req.loginUserId;
    UserEntity.findByIdAndUpdate(loginUserId, {$set:{taskid:''}}, function (err, user) {
        if (err) {//服务器保存异常
            res.error(RestResult.SERVER_EXCEPTION_ERROR_CODE, "服务器异常");
            //console.log('a');
            return;
        }
        TaskEntity.findByIdAndUpdate(taskid, {$set:{fininshed:'已完成',finishtime:Date.now()}}, function (err, task) {
            if (err) {//服务器保存异常
                res.error(RestResult.SERVER_EXCEPTION_ERROR_CODE, "服务器异常");
                return;
            }
            res.success({user:user,task:task})
        });
    });


});

router.put('/:id', function (req, res, next) {
    TaskEntity.findByIdAndUpdate(req.params.id, req.body, function (err, task) {
        if (err) {
            res.error(RestResult.SERVER_EXCEPTION_ERROR_CODE, "服务器异常");
            return;
        }
        res.success(task);
    });
});


router.delete('/:id', function (req, res, next) {
    TaskEntity.findByIdAndRemove(req.params.id, req.body, function (err, task) {
        if (err) {
            res.error(RestResult.SERVER_EXCEPTION_ERROR_CODE, "服务器异常");
            return;
        }
        res.success(task);
    });
});


module.exports = router;