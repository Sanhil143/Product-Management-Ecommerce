const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const cardCreate = mongoose.Schema({
  
    userId: {type :ObjectId, ref: "userModel",required: true,trim:true},
    items: [{
      productId: {type :ObjectId, ref: "product",required: true,trim:true},
      quantity: {type :Number,required: true,trim:true}
    }],
    totalPrice: {type :Number,required: true},
    totalItems: {type :Number,required: true},
    
    deletedAt: {type :Date}, 
    isDeleted: {type:Boolean, default: false}
    
},{ timestamps: true })

module.exports =mongoose.model("carts" ,cardCreate)