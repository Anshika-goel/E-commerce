const ProductModel = require("../models/product.model");
const UserModel = require("../models/user.model");
exports.GetAllProducts = async (req, res, next) => {
    try {
      const products = await ProductModel.find();
      return res.status(200).json({
        success: true,
        products,
      });
    } catch (err) {
      console.log("ERROR");
      console.log(err);
      return res.status(400).json({
        success: false,
        message: "UNKNOWN_SERVER_ERROR",
      });
    }
  };

  exports.GetAllProductsByUser = async (req, res, next) => {
    try {
      const { uid } = res.locals;
      const products = await ProductModel.find({ seller: uid });
      return res.status(200).json({
        success: true,
        products,
      });
    } catch (err) {
      console.log("error");
      console.log(err);
      return res.status(400).json({
        success: false,
        message: "UNKNOWN SERVER ERROR",
      });
    }
  };
  
  exports.GetAllProductsBySeller = async (req, res, next) => {
    try {
      const { seller } = req.params;
      const products = await ProductModel.find({ seller });
      return res.status(200).json({
        success: true,
        products,
      });
    } catch (err) {
      console.log("error");
      console.log(err);
      return res.status(400).json({
        success: false,
        message: "UNKNOWN SERVER ERROR",
      });
    }
  };

  exports.GetProductDetails = async (req, res, next) => {
    try {
      const { _id } = req.params;
      const product = await ProductModel.findOne({ _id });
      return res.status(200).json(product);
    } catch (err) {
      console.log("error");
      console.log(err);
      return res.status(400).json({
        success: false,
        message: "UNKNOWN SERVER ERROR",
      });
    }
  };

  exports.AddProduct = async (req, res, next) => {
    try {
      const { name, price, image } = req.body;
      const product = new ProductModel({
        name,
        image,
        price,
      });
      await product.save();
      return res.status(200).json({
        success: true,
        product,
      });
    } catch (err) {
      console.log("error");
      console.log(err);
      return res.status(400).json({
        success: false,
        message: "UNKNOWN SERVER ERROR",
      });
    }
  };

  exports.SellProduct = async (req, res, next) => {
    try {
      const { _id, transaction } = req.body;
      const product = await ProductModel.findOne({ _id });
      product.sales += 1;
      await new TransactionModel(transaction);
      return res.status(200).json({
        success: true,
        product,
        transaction,
      });
    } catch (err) {
      console.log("ERROR");
      console.log(err);
      return res.status(400).json({
        success: false,
        message: "UNKNOWN SERVER ERROR",
      });
    }
  };

  exports.FilterProducts = async (req, res, next) => {
    try {
      const { query } = req.query;
      const products = await ProductModel.aggregate([
        { $match: { name: { $regex: query, $options: "i" } } },
        {
          $addFields: {
            score: {
              $indexOfCP: [{ $toLower: "$name" }, { $toLower: query }],
            },
          },
        },
        { $sort: { score: 1 } },
      ]);
      return res.status(200).json({
        success: true,
        products,
      });
    } catch (err) {
      console.log("ERROR");
      console.log(err);
      return res.status(400).json({
        success: false,
        message: "UNKNOWN SERVER ERROR",
      });
    }
  };

  
