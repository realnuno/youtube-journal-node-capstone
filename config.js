exports.DATABASE_URL = process.env.DATABASE_URL ||
    global.DATABASE_URL ||
    (process.env.NODE_ENV === 'production' ?
     'mongodb://admin:admin1234@ds161391.mlab.com:61391/youtube-journal' :
     'mongodb://admin:admin1234@ds161391.mlab.com:61391/youtube-journal');
exports.PORT = process.env.PORT || 5002;
