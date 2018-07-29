const AWS = require('aws-sdk');
const params = {
  Bucket: 'kw-syllabus',
  ACL: 'public-read',
  Bucket: 'kw-syllabus',
  ContentType: "application/json; charset=utf-8;",
};
AWS.config.loadFromPath('/Users/soonoo/dev/syllabus-parser/config.json');

const s3 = new AWS.S3({apiVersion: '2006-03-01'});

const upload = (key, body) => new Promise((resolve, reject) => {
  s3.putObject({...params, Key: key, Body: body}, (err,data) => {
    if(err) reject(err);
    else resolve(data);
  });
})

module.exports = upload;

