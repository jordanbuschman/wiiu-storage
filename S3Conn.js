var amazonS3 = require('awssum-amazon-s3');
var crypto   = require('crypto');
var fs       = require('fs');

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

    this.uploadPrivateFile = function(username, password, filename, salt, hmacKey, file, callback) {
        var options = {
            BucketName: 'jbfilespace',
            ObjectName: 'private/' + username + '/' + filename
        };

        crypto.pbkdf2(password, salt, 80000, 8, function(err, derivedKey) {
            if (err)
                return callback(err);

            derivedKey = derivedKey.toString('hex');

            var iv = crypto.randomBytes(8).toString('hex');
            var cipher = crypto.createCipheriv('AES-128-CBC', derivedKey, iv);
            var encryptedFile = cipher.update(file, 'binary', 'hex');
            encryptedFile += cipher.final('hex');


            var hmac = crypto.createHmac('SHA256', hmacKey);
            hmac.setEncoding('hex');
            hmac.end(iv.concat(encryptedFile), function() {
                var hmacString = hmac.read();

                console.log('SALT: ' + salt + ' (' + salt.length +')');
                console.log('IV: ' + iv + ' (' + iv.length + ')');
                console.log('HMAC: ' + hmacString + ' (' + hmacString.length + ')');
                console.log('FILE LENGTH: ' + encryptedFile.length);


                var fileToSend = salt.concat(iv, hmacString, encryptedFile);
                //  size(hex):    64         16     64           varies 
                console.log('FINAL LENGTH: ' + fileToSend.length);
                console.log('NEW SALT: ' + fileToSend.slice(0, 64));
                console.log('NEW IV: ' + fileToSend.slice(64, 80));
                console.log('NEW HMAC: ' + fileToSend.slice(80, 144));

                //Now that encryption is done, upload it to S3
                options['ContentLength'] = fileToSend.length;
                options['Body'] = fileToSend;

                s3.PutObject(options, function(err, data) {
                    if (err) {
                        console.log(err);
                        return callback(err);
                    }
                    console.log(data);
                    return callback(data);            
                });
            });
            //});
        });
    };

    this.getPrivateFile = function(username, password, filename, hmacKey, callback) {
        var options = {
            BucketName: 'jbfilespace',
            ObjectName: 'private/' + username + '/' + filename,
        };

        s3.GetObject(options, function(err, data) {
            if (err)
                return callback(err);

            //Now that you have the file, decrypt it
            var file = data.Body;
            var salt = String(file.slice(0, 64));
            var iv = String(file.slice(64, 80));
            var hmac = String(file.slice(80, 144));
            var encryptedFile = String(file.slice(144, file.length));

            console.log('SALT: ' + salt);
            console.log('IV: ' + iv);
            console.log('HMAC: ' + hmac);
            console.log('FILE LENGTH: ' + file.length);

            crypto.pbkdf2(password, salt, 80000, 8, function(err, derivedKey) {
                if (err)
                    return callback(err);

                derivedKey = derivedKey.toString('hex');

                var chmac = crypto.createHmac('SHA256', hmacKey);
                chmac.setEncoding('hex');
                chmac.end(iv.concat(encryptedFile), function() { //Check to see if files match
                    var hmacString = chmac.read();
                    if (hmacString != hmac) {
                        return callback({'StatusCode': 500, 'Body': {'Error': 'HMAC does not match.'}});
                    }

                    var decipher = crypto.createDecipheriv('AES-128-CBC', derivedKey, iv);
                    var decrypted = Buffer.concat([decipher.update(encryptedFile, 'hex'), decipher.final()]);

                    return callback({'StatusCode': 200, 'Body': decrypted });
                });
            });
        });
    };
};

module.exports = S3Conn;
