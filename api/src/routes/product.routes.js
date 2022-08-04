const express= require("express");
const controller = require("../controllers/product.controller");
const router = express.Router();

router.get("/get-all-by-user",controller.GetAllProductsByUser);
router.get("/get-all-by-seller",controller.GetAllProductsBySeller);
router.get("get-all",controller.GetAllProducts);
router.post("/add",controller.AddProduct);
router.get("/query", controller.FilterProducts);
router.get("/get-details/:_id", controller.GetProductDetails);

module.exports = router;