var express = require('express');
var S3Conn  = require('../S3Conn');

var s3Conn = new S3Conn();
var router  = express.Router();

router.get('/', function(req, res) {
    res.redirect('/api/public');
});
router.get('/public', function(req, res) {
    s3Conn.listPublicFiles(function(e, data) {
        if (e) {
            res.json({'ERROR' : e });
        }
        else {
            res.json({ 'Contents' : data.Body.ListBucketResult.Contents });
        }
    });
});

module.exports = router;
