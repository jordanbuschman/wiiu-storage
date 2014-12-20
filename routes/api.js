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

module.exports = router;
