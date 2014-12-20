var amazonS3 = require('awssum-amazon-s3');

function S3Conn() {
    var s3 = new amazonS3.S3({
        'accessKeyId': process.env.AWSAccessKeyId,
        'secretAccessKey' : process.env.AWSSecretKey,
        'region': amazonS3.US_WEST_1
    });

    var options = {
        BucketName: 'jbfilespace',
    };

    this.listPublicFiles = function(callback) {
        options['Prefix'] = 'public/'; 
        s3.ListObjects(options, function(err, data) {
            if (err != null) {
                callback(err, null);
            }
            else {
                callback(null, data);
            }
        });
    };
};

module.exports = S3Conn;
