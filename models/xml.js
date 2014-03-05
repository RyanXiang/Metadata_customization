var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var XmlSchema = new Schema({
      header: Object
});

module.exports = mongoose.model('Xml', XmlSchema);