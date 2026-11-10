const crypto = require("crypto");
const Razorpay = require("razorpay");
const Orders = require("../models/orderModel.js");
const Product = require("../models/productModel.js");
const User = require("../models/usermodel.js");

const getRazorpay = () => {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials are not configured");
  }

  return new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
};

const buildOrderProducts = async (products) => {
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error("At least one product is required");
  }

  const orderProducts = [];
  for (const item of products) {
    if (!item.productID || !Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new Error("Each product must have a valid productID and quantity");
    }

    const product = await Product.findById(item.productID);
    if (!product) {
      const error = new Error(`Product not found: ${item.productID}`);
      error.statusCode = 404;
      throw error;
    }

    orderProducts.push({
      productID: product._id,
      productName: product.name,
      price: product.Discounted_price,
      image: product.image,
      quantity: item.quantity,
      size: item.size,
    });
  }

  return orderProducts;
};

const validateAddress = (shippingAddress) => {
  const requiredFields = [
    "firstName",
    "lastName",
    "address",
    "city",
    "state",
    "country",
    "pincode",
  ];

  if (
    !shippingAddress ||
    requiredFields.some((field) => !shippingAddress[field])
  ) {
    throw new Error("A complete shipping address is required");
  }
};

const createPaymentOrder = async (req, res) => {
  try {
    const { products, shippingAddress, coins = 0 } = req.body;
    validateAddress(shippingAddress);

    if (!Number.isInteger(coins) || coins < 0) {
      return res.status(400).json({ success: false, message: "Invalid coins" });
    }

    const orderProducts = await buildOrderProducts(products);
    const subtotal = orderProducts.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const totalAmount = subtotal - coins;

    if (totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Razorpay orders must have a positive amount",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user || user.walletBalance < coins) {
      return res.status(400).json({
        success: false,
        message: "Insufficient wallet balance",
      });
    }

    const razorpayOrder = await getRazorpay().orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    const order = await Orders.create({
      userID: req.user.id,
      products: orderProducts,
      shippingAddress,
      totalAmount,
      paymentMethod: "Razorpay",
      paymentStatus: "Pending",
      orderStatus: "Pending",
      coins,
      razorpayOrderId: razorpayOrder.id,
    });

    return res.status(201).json({
      success: true,
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "Razorpay payment details are required",
      });
    }

    const order = await Orders.findOne({
      _id: req.body.orderId,
      userID: req.user.id,
      razorpayOrderId,
    });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    if (order.paymentStatus === "Paid") {
      return res.status(200).json({ success: true, order });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");
    const signaturesMatch =
      expectedSignature.length === razorpaySignature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(razorpaySignature)
      );

    if (!signaturesMatch) {
      order.paymentStatus = "Failed";
      await order.save();
      return res.status(400).json({
        success: false,
        message: "Invalid Razorpay signature",
      });
    }

    if (order.coins > 0) {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.user.id, walletBalance: { $gte: order.coins } },
        { $inc: { walletBalance: -order.coins } },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(400).json({
          success: false,
          message: "Insufficient wallet balance",
        });
      }
    }

    order.paymentStatus = "Paid";
    order.orderStatus = "Confirmed";
    order.razorpayPaymentId = razorpayPaymentId;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createPaymentOrder, verifyPayment };
