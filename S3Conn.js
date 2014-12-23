var amazonS3 = require('awssum-amazon-s3');
var crypto   = require('crypto');

function S3Conn() {
    var s3 = new amazonS3.S3({
        'accessKeyId': process.env.AWSAccessKeyId,
        'secretAccessKey' : process.env.AWSSecretKey,
        'region': amazonS3.US_WEST_1
    });

    this.listPublicFiles = function(callback) {
        var options = {
            BucketName: 'jbfilespace',
            Prefix: 'public/' 
        };

        s3.ListObjects(options, function(err, data) {
            if (err != null) {
                callback(err, null);
            }
            else {
                callback(null, data);
            }
        });
    };

    this.listPrivateFiles = function(username, callback) {
    };

    this.uploadPrivateFile = function(username, password, filename, salt, file, callback) {
        var options = {
            BucketName: 'jbfilespace',
            ObjectName: 'private/' + username + '/' + filename
        };

        var filePassword = crypto.pbkdf2(password, salt, 80000, 8, function(err, derivedKey) {
            if (err)
                return callback(err);

            derivedKey = derivedKey.toString('hex');

            var iv = new Buffer(crypto.randomBytes(16));
            var encryptedFile = crypto.createCipheriv('AES-128-CBC', derivedKey, iv).update(file, 'binary', 'hex');

            var hmacKey = crypto.randomBytes(32);
            var hmac = crypto.createHmac('SHA256', hmacKey).update(encryptedFile).update(iv.toString('hex')).digest('hex');

            var fileToSend = salt.toString('hex') + iv.toString('hex') + hmac.toString('hex') + encryptedFile.toString('hex');
            //  size(hex):         64                    32                     64                         varies 

            //Now that encryption is done, upload it to S3
            options['ContentLength'] = fileToSend.length;
            options['Body'] = fileToSend;
            options['ContentEncoding'] = 'hex';

            s3.PutObject(options, function(err, data) {
                if (err)
                    return callback(err);

                return callback(data);            
            });
        });
    };

    this.getPrivateFile = function(username, password, filename, salt, callback) {
    };
};

module.exports = S3Conn;
