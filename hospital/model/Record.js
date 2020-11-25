const mongoose = require("mongoose");

const recordSchema = mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    heartRate: {
        type: Number,
        required: true
      },
    respirationRate: {
        type: Number,
        required: true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  });
  
  // export model user with UserSchema
  module.exports = mongoose.model("record", recordSchema);