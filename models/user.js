var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
      username: { type: [String], index: true}
    , password: String
});

module.exports = mongoose.model('User', UserSchema);