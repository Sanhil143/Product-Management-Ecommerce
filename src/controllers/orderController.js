const ProductModel = require("../models/productModel")
const CartModel = require("../models/cartModel")
const OrderModel = require("../models/orderModel")


//=====================================// CREATE ORDER //==================================//

const createOrder = async function (req, res) {
      try {
            let userId = req.params.userId
            let cartId = req.body.cartId
            if (!cartId) {
                  return res.status(400).send({ status: false, message: "provide cartId in body" })
            }
            if (!validObjectId(cartId)) {
                  return res.status(400).send({ status: false, message: "invalid cartId" })
            }
            let findCart = await CartModel.findById(cartId)
            if (!findCart) {
                  return res.status(404).send({ status: false, message: "Cart dose not Exists" })
            }
            let cartUserId = findCart.userId
            if (!userId == cartUserId) {
                  return res.status(400).send({
                        status: false, message: `Please provide  user valid cartId ${findCart._id}`
                  })
            }
            if (findCart.items.length == 0) return res.status(400).send({ status: false, message: "Your cart is empty", data: findCart })

            let itemArray = findCart.items
            for (let i = 0; i < itemArray.length; i++) {
                  let product = await ProductModel.findOne({ _id: itemArray[i].productId })
                  if (product.isDeleted) {
                        findCart.totalPrice = findCart.totalPrice - (itemArray[i].quantity * product.price)
                        itemArray.splice(itemArray[i], 1)
                  }
            }

      }
      catch (err) {
            return res.status(500).send({ status: false, message: err.message })

      }
}

//=====================================// UPDATE ORDER //==================================//

const updateOrder = async function (req, res) {
      try {
            const userId = req.params.userId;
            const data = req.body;

            if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: 'Please provide Data in request body' })

            const { orderId, status } = data
            if (status != "pending" && status != "completed" && status != "canceled") {
                  return res.status(400).send({ status: false, message: "order status can only be pending,completed and canceled" })
            }
            const findOrder = await OrderModel.findById(orderId)
            if (!findOrder) return res.status(404).send({ status: false, message: "oder Not found" })

            if (findOrder.status == "completed")
                  return res.status(400).send({ status: false, message: "Can Not Update This Order, Because It's Completed Already" })

            if (findOrder.status == "canceled")
                  return res.status(400).send({ status: false, message: "Can Not Update This Order, Because It's Cancelled Already" })

            if (findOrder.userId != userId) return res.status(403).send({ status: false, message: "order is not blong to the user " })

            if (status == "canceled") {
                  // if(findOrder.cancellable==false)
                  if (!findOrder.cancellable) return res.status(400).send({ status: false, message: "This order is not cancellable" })

                  const updateOrder = await OrderModel.findOneAndUpdate({ _id: orderId }, { $set: { status: status } }, { new: true })

                  return res.status(200).send({ status: true, message: "Success", data: updateOrder })
            }
   
      } catch (err) {
            return res.status(500).send({ status: false, message: err.message })
      }

}


module.exports = { createOrder, updateOrder }