const { Schema, model } = require("mongoose")

const Document = new Schema({
  _id: String,
  data: Object,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 604800 
  }
})

module.exports = model("Document", Document)
