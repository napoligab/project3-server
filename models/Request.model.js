const { Schema, model } = require("mongoose");

const requestSchema = new Schema(
    {
    author: {type: Schema.Types.ObjectId, ref:'User'}, 
    message:{
      type: String,
      required: true,
    },
    }, 
    {
     timestamps: true,
    }
   ); 


const Request = model("Request", requestSchema);

module.exports = Request;