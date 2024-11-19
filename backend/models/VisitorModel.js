const mongoose = require("mongoose");

const Visitorschema = mongoose.Schema(
  {
    name: String,
    Mobile: Number,
    address: String,
    visitingpurpose: String,
    visitingperson: String,
    photo: String,
    checkinTime: Date,
    checkin: Boolean,
    checkouttime: Date,
    checkout: Boolean,
  },

  {
    timestamps: true,
  }
);

const visitorModel = mongoose.model("visitor", Visitorschema);

module.exports = visitorModel;
