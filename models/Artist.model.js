const { Schema, model } = require("mongoose");

const artistSchema = new Schema(
    {
    name: { 
      type: String, 
      required: true
    },
    concerts: [{ type: Schema.Types.ObjectId, ref:'Concert'}]
    }, 
    {
     timestamps: true,
    }
   ); 


const Artist = model("Artist", artistSchema);

module.exports = Artist;