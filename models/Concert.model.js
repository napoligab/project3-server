const { Schema, model } = require("mongoose");


const concertSchema = new Schema (
    {
    artist: { type: Schema.Types.ObjectId, ref:'Artist'},
    image: { 
        type: String, 
       /*  required: true  */
    },
    date: Date,
    city: { 
        type: String, 
        required: true
    },
    venue: { 
        type: String, 
        required: true},
    budget: Number,
    deadline: Date,
    minTicket: Number,
    usersFunding: [{ type: Schema.Types.ObjectId, ref:'User'}]
    },
    {
    timestamps: true,
    }
   );


const Concert = model("Concert", concertSchema);

module.exports = Concert;