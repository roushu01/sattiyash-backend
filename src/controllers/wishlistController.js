const WishList=require('../models/wishlistModel.js')
const jwt=require('jsonwebtoken')
const addToWishlist = async (req, res) => {
  try {
    console.log("Add to wishlist");

    const { productId } = req.body;
    console.log("Product ID:", productId);

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Login again please",
      });
    }

    const decode = jwt.verify(
      token,
      process.env.JWT_PRIVATE_KEY
    );

    const userID = decode.id;

    console.log("User ID:", userID);

    const existingItem = await WishList.findOne({
      productId,
      userID,
    });

    if (existingItem) {
      console.log("Already available")
      return res.status(400).json({
        
        message: "Item already in wishlist",
      });
    }

    const wishlist = await WishList.create({
      userID,
      productId,
    });

    return res.status(201).json({
      message: "Item added to wishlist successfully",
      wishlist,
    });

  } catch (error) {
    console.error("Wishlist Error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};
const getallWishlist = async (req, res) => {
  try {
    const userID = req.user.id;
    

    const items = await WishList.find({ userID })
      .populate("productId");

    console.log("Wishlist Items:", items);

    return res.status(200).json({
      item: items,
    });
  } catch (error) {
    console.log("Wishlist Error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};
const deletWishListItem = async (req, res) => {
  try {
    const { id } = req.params; // actually productId

    const userID = req.user.id;

    const item = await WishList.findOneAndDelete({
      userID,
      productId: id,
    });

    return res.status(200).json({
      message: "Item deleted from wishlist successfully",
      item,
    });
  } catch (error) {
    console.log("delete wishlist", error);
    return res.status(400).json({ error });
  }
};
module.exports={addToWishlist,getallWishlist,deletWishListItem}
