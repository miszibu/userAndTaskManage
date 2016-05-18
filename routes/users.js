var express = require('express');
var router = express.Router();

var RestResult = require('../RestResult');
var tokenUtils = require('../util/tokenUtils');

var UserEntity = require('../models/User').UserEntity;
var TaskEntity = require('../models/Task').TaskEntity;

router.post('/', function (req, res, next) {
    UserEntity.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/*-------------注册------------------*/
router.post('/register', function (req, res, next) {
    var mobile = req.body.mobile;
    var password = req.body.password;

    if (!mobile) {//手机号码格式校验
        if (!/1\d{10}$/.test(mobile)) {//手机号码格式校验
            res.error(RestResult.ILLEGAL_ARGUMENT_ERROR_CODE, "请填写正确的手机格式");
            return;
        }
    }

    if (!password || password.length < 6) {//密码长度校验,此处只做最短校验,不做最长校验和其他复杂度校验
        res.error(RestResult.ILLEGAL_ARGUMENT_ERROR_CODE, "密码长度不能少于6位");
        return;
    }

    UserEntity.findOne({mobile: mobile}, '_id', function (err, user) {
        if (err) {//查询异常
            res.error(RestResult.SERVER_EXCEPTION_ERROR_CODE, "服务器异常");
            return;
        }

        if (user) {//手机号已注册
            res.error(RestResult.BUSINESS_ERROR_CODE, "手机号已注册");
            return;
        }

        var registerUser = new UserEntity({
            mobile: mobile,
            password: password
        });
        //调用实体的实例的保存方法
        registerUser.save(function (err, row) {
            if (err) {//服务器保存异常
                res.error(RestResult.SERVER_EXCEPTION_ERROR_CODE, "服务器异常");
                return;
            }
            res.success();

        });

    });

});


router.get('/login', function (req, res, next) {
    res.send("login");
});

router.post('/login', function (req, res, next) {
    var mobile = req.body.mobile;
    var password = req.body.password;

    if (!mobile) {//手机号码格式校验
        if (!/1\d{10}$/.test(mobile)) {//手机号码格式校验
            res.error(RestResult.ILLEGAL_ARGUMENT_ERROR_CODE, "请填写正确的手机格式");
            return;
        }
    }
    if (!password) {
        res.error(RestResult.ILLEGAL_ARGUMENT_ERROR_CODE, "密码不能为空");
        return;
    }

    UserEntity.findOne({mobile: mobile, password: password}, {password: 0}, function (err, user) {
        if (err) {
            res.error(RestResult.SERVER_EXCEPTION_ERROR_CODE, "服务器异常");
            return;
        }

        if (!user) {
            res.error(RestResult.BUSINESS_ERROR_CODE, "用户名或密码错误");
            return;
        }

        var loginToken = tokenUtils.getLoginAutoToken(user.id, user.password);
        //返回登陆用户信息和loginToken
        res.success({user: user, loginToken: loginToken});

        //更新登陆状态
        UserEntity.update({_id: user._id}, {$set: {state: '1'}}).exec();

    });

});

router.get('/listUsers', function (req, res, next) {
    UserEntity.find(function (err, users) {
        if (err) {
            res.error(RestResult.SERVER_EXCEPTION_ERROR_CODE, "服务器异常");
            return;
        }
        res.success(users);
    });
});

router.get('/information', function (req, res, next) {
    var loginUserId = req.loginUserId;
    UserEntity.findById(loginUserId,{password:0}, function (err, user) {
        if (err) {
            res.error(RestResult.SERVER_EXCEPTION_ERROR_CODE, "服务器异常");
            return;
        }
        TaskEntity.find({_id:user.taskid}, function (err, task) {
            res.success({user:user,task:task});
        });
    });
});

router.put('/change_information', function (req, res, next) {
    var loginUserId = req.loginUserId;
    UserEntity.findByIdAndUpdate(loginUserId, req.body, function (err, user) {
        if (err) {
            res.error(RestResult.SERVER_EXCEPTION_ERROR_CODE, "服务器异常");
            return;
        }
        res.success(user);
    });
});

router.delete('/:id', function (req, res, next) {
    UserEntity.findByIdAndRemove(req.params.id, req.body, function (err, user) {
        if (err) {
            res.error(RestResult.SERVER_EXCEPTION_ERROR_CODE, "服务器异常");
            return;
        }
        res.success(user);
    });
});


router.get('/home', function (req, res) {
    res.send('home');
});

router.get('/number', function (req, res) {
    UserEntity.find({state: "1"},{password:0}, function (err, users) {
        if (err) {
            res.error(RestResult.SERVER_EXCEPTION_ERROR_CODE, "服务器异常");
            return;
        }
        res.success(users);
    })
});


router.get('/out', function (req, res) {
    var loginUserId = req.loginUserId;
    UserEntity.findById(loginUserId, '_id username', function (err, user) {
        if (err) {
            res.error(RestResult.SERVER_EXCEPTION_ERROR_CODE, "服务器异常");
            return;
        }
        UserEntity.update({_id: user._id}, {$set: {state: '0'}}, function (err) {
            if (err) {
                res.error(RestResult.SERVER_EXCEPTION_ERROR_CODE, "服务器异常");
                return;
            }
            res.redirect('/users/login');
        });
    });
});

module.exports = router;