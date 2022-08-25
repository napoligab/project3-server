const { Schema, model } = require("mongoose");

const userSchema = new Schema({ 
  firstName: { 
      type: String, 
      required: true,
      trim: true
    },
    lastName: { 
      type: String, 
      required: true,
      trim: true
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true
    },
    password: { 
      type: String, 
      required: true
     },
    city: { 
      type: String, 
      required: true
    },
	  fundedConcerts: [{ type: Schema.Types.ObjectId, ref:'Concert'}],
    creditCard:{ 
      type: Number, 
      required: true
    },
    profilePicture: String,
    admin: {
      type: Boolean,
      default: false
    }
  },
    {
    timestamps: true
    }
 ); 

const User = model("User", userSchema);

module.exports = User;
