var express = require('express');
var S3Conn  = require('../S3Conn');
var DBConn  = require('../DBConn');

var s3Conn = new S3Conn();
var dbConn = new DBConn();
var router = express.Router();

router.get('/', function(req, res) {
    res.redirect('/api/public');
});
router.get('/public', function(req, res) {
    s3Conn.listPublicFiles(function(e, data) {
        if (e) {
            res.json({'ERROR' : e });
        }
        else {
            var contents = data.Body.ListBucketResult.Contents;
            var trimmedContents = [];
            contents.forEach(function(listing, index) {
                if (index != 0) {
                    trimmedContents[index - 1] = {
                        Key: listing.Key,
                        LastModified: listing.LastModified,
                        Size: listing.Size,
                    };
                }
            });

            res.json({ 'Contents' : trimmedContents });
        }
    });
});

router.get('/public/:file', function(req, res) {
    var file = decodeURI(req.params.file);
    file = file.replace(/^\/|[\?<>\\:\*\|":\x00-\x1f\x80-\x9f]/g, '');
    res.json(file);
});

router.get('/private/:user', function(req, res) {
    var user = decodeURI(req.params.user);
    dbConn.authenticateUser(user, 'PASSWORD HERE', function(result) {
        console.log(result);
        res.json({'result': result});
    });
});

module.exports = router;
