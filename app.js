var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var ejs = require('ejs');

var app = express();
var isLogin = false;
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.engine('html', ejs.__express);
app.set('view engine', 'html');
app.set('views', __dirname);
app.use(express.static(path.join(__dirname)));

app.get('/authorization', function (req, res) {
    res.set({
        'Access-Control-Allow-origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET',
        'Access-Control-Allow-Headers': 'aa'
    });
    fs.readFile('./controllers/count.txt', 'utf8', function (err, data) {
        var rid = req.query['rid'];
        data = JSON.parse(data);
        count = parseInt(data[rid], 10);
        var count = parseInt(data[rid], 10);
        if (isNaN(count)) {
            count = 4;
        }
        fs.readFile('./controllers/url.txt', 'utf8', function (err, ct) {
            var content = JSON.parse(ct);
            var hasVisited;
            if (!content) {
                hasVisited = true;
            }
            else if (content && content[rid]) {
                for (var i = 0; i < content[rid].length; i++) {
                    if (content[rid][i] === req.query['canonical_url']) {
                        hasVisited = true;
                    }
                }
            }
            if (count > 0 || hasVisited) {
                var fcf = true;
                var content = JSON.parse(ct);
                if (content[rid] && content[rid].length > 0 && content[rid][0] != req.query['canonical_url'])  {
                    res.json({
                        access: true,
                        subscriber: isLogin
                    });
                } else {
                    res.json({
                        access: true,
                        subscriber: isLogin,
                        fcf: true
                    });
                }
            } else if (isLogin) {
                res.json({
                    access: true,
                    subscriber: isLogin
                });
            } else {
                res.json({
                    access: false,
                    subscriber: isLogin
                });
            }
        });
    });
});

app.get('/pingback', function (req, res) {
    fs.readFile('./controllers/count.txt', 'utf8', function (err, data) {
        res.set({
           'Access-Control-Allow-origin': '*',
           'Access-Control-Allow-Methods': 'POST, GET',
           'Access-Control-Allow-Headers': 'aa'
        });
        var rid = req.query['rid'];
        data = JSON.parse(data);
        var count = parseInt(data[rid], 10);
        if (isNaN(count)) {
            count = 4;
        }
        if (count > 0) {
            fs.readFile('./controllers/url.txt', 'utf8', function (err, ct) {
                var canWrite = true;
                var content = JSON.parse(ct);
                var contentArray = content[rid];
                if (contentArray) {
                    for (var i = 0; i < contentArray.length; i++) {
                        if (contentArray[i] === req.query['canonical_url']) {
                            canWrite = false;
                        }
                    }
                }
                if (canWrite) {
                    count -= 1;
                    data[rid] = count;
                    fs.writeFile('./controllers/count.txt', JSON.stringify(data), function (err) {});
                    if (Object.prototype.toString.call(content[rid]) == "[object Array]") {
                        content[rid].push(req.query['canonical_url']);
                    } else {
                        content[rid] = [req.query['canonical_url']];
                    }
                    fs.writeFile('./controllers/url.txt', JSON.stringify(content), function (err) {
                        res.send();
                    });
                } else {
                    res.send();
                }
            });
        } else {
            res.send();
        }
    });
});

app.get('/dismiss', function (req, res) {
    var rid = req.query['rid'];

    fs.readFile('./controllers/url.txt', 'utf8', function (err, data) {
        var rid;
        var content = JSON.parse(data);
        if (req.query && req.query.rid) {
            rid = req.query.rid;
        }
        if (!rid) {
            return;
        }
        if (content) {
            content[rid] = [];
            fs.writeFile('./controllers/url.txt', JSON.stringify(content), function (err) {
                fs.readFile('./controllers/count.txt', 'utf8', function (err, data) {
                    var countContent = JSON.parse(data);
                    if (countContent) {
                        countContent[rid] = 4;
                        fs.writeFile('./controllers/count.txt', JSON.stringify(countContent), function (err) {
                        });
                    }
                });
            });
        }
    });

    res.send();
});

app.get('/login', function (req, res) {
    res.render('./src/views/login.html');
});

app.get('/logout', function (req, res) {
    isLogin = false;
    res.send();
});

app.get('/mip-login-done', function (req, res) {
    isLogin = true;
    // res.render('./src/js/mip-login-done/mip-login-done.html');
    res.send();
});

app.get('/list', function (req, res) {
    res.render('./src/views/list.html');
});

app.get(/\/articles\/[0-9]/, function (req, res) {
    var num = req.url.split('/');
    num = num && num.length > 0 ? num[num.length - 1] : 0;
    res.render('./src/views/articles/' + num + '.html', {
        num: parseInt(num, 10) + 1
    });
});

var server = app.listen(8391, function () {
    var host = server.address().address;
    var port = server.address().port;
});
