
'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://admin:admin1234@ds161391.mlab.com:61391/youtube-journal';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://admin:real7909@ds219672.mlab.com:19672/test-youtube-journal';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

