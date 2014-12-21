wiiu-storage
============

File storage solution (hosted on Heroku, storage on Amazon S3).

## Installation
Go to terminal, and type:
```
git pull https://github.com/jordanbuschman/wiiu-storage.git
cd wiiu-storage
sudo npm install
```
To run, type:
```
npm start
```

## Environment Variables
Add these lines to the end of /etc/bash.bashrc:
```
export DATABASE_URL=<PostgreSQL Database URL>
export AWSAccessKeyId=<AWS Access Key ID>
export AWSSecretKey=<AWS Secret Key>
```
If you want to see debug messages, also add this line:
```
export DEBUG="wiiu-storage"
```

## Redis
This system uses Redis for session info and flash messages. for local development, make sure you have a Redis server running locally on port 6379.
