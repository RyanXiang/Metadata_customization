var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var XmlSchema = new Schema({
      content: String,
      boname: { type: [String], index: true}
});

module.exports = mongoose.model('Xml', XmlSchema);