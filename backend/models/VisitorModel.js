const mongoose = require("mongoose");

const Visitorschema = mongoose.Schema(
  {
    name: String,
    mobile: String,
    address: String,
    visitingpurpose: String,
    visitingperson: String,
    photo: String,
    checkinTime: Date,
    checkin: Boolean,
    checkouttime: Date,
    checkout: Boolean,
    status: String,
  },

  {
    timestamps: true,
  }
);

const visitorModel = mongoose.model("visitor", Visitorschema);

module.exports = visitorModel;
