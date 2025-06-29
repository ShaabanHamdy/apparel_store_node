import cart_model from "../../../db/models/cart_model.js";
import category_model from "../../../db/models/category_model.js";
import product_model from "../../../db/models/product_model.js";
import { paginate } from "../../utils/pagination.js"

export const createProduct = async (req, res, next) => {
  if (!req.files) {
    next(new Error("please select product picture", { cause: 400 }));
  }
  if (!(await category_model.findById(req.body.categoryId)))
    return next(new Error("invalid category id"));

  if (await product_model.findOne({ title: req.body.title }))
    return next(new Error("duplicated name"));

  const products = await product_model.create({
    mainImage: req.files?.mainImage.map(
      (e) => "http://localhost:5000/" + e.path
    ),
    subImages: req.files?.subImages.map(
      (e) => "http://localhost:5000/" + e.path
    ),
    // mainImage: req.files.mainImage.map((e) => e.path.slice(69).replace(/\\/g, "/")),
    // subImages: req.files.subImages.map((e) => e.path.slice(69).replace(/\\/g, "/")),
    title: req.body.title,
    categoryName: req.body.categoryName,
    description: req.body.description,
    price: req.body.price,
    discount: req.body.discount,
    priceAfterDiscount: (req.body.price / 100) * req.body.discount,
    stock: req.body.stock,
    size: req.body.size,
    ratingAverage: req.body.ratingAverage,
    ratingCount: req.body.ratingCount,
    categoryId: req.body.categoryId,
  });

  res.json({ message: "success", products });
};

// =========================================================
export const getAllProducts = async (req, res, next) => {
  const { limit, skip } = paginate(req.query.page, req.query.size);

  const data = await product_model.find().populate([
    {
      path: "categoryId",
    },
  ]);
  // .limit(limit).skip(skip)
  if (data.length == 0) {
    next(new Error("no products available"));
  }

  res.json({ message: "Done", results: data.length, data });
};
// ======================================================
export const deleteAllProducts = async (req, res, next) => {
  const product = await product_model.deleteMany();
  if (product.deletedCount < 1)
    return next(new Error("not find andy products ", { cause: 409 }));
  res
    .status(201)
    .json({ message: "success", deletedCount: product.deletedCount });
};

// =========================================================
export const deleteOneProducts = async (req, res, next) => {
  const product = await product_model.deleteOne({ _id: req.body.id });
  if (product.deletedCount < 1)
    return next(new Error("not find andy products ", { cause: 409 }));
  res
    .status(201)
    .json({ message: "success", deletedCount: product.deletedCount });
};

// ==================================================================
export const getAllProductsUsers = async (req, res, next) => {
  // const {limit,skip} = paginate(req.query.page , req.query.size)
  const data = await product_model.find().populate([
    {
      path: "categoryId",
    },
  ]);
  // .limit(limit).skip(skip)

  if (data.length == 0) {
    next(new Error("no products available"));
  }

  const carts = await cart_model.find({ userId: req.user._id });
  // const data = await cart_model.find().populate([{ path: "products.productId" }])
  const calcQuantity = parseInt(
    carts.map((e) => e.products.reduce((e, x) => e + x.quantity, 0))
  );

  res.json({ message: "Done", results: data.length, data, calcQuantity });
};
// =========================================================
export const getOneProduct = async (req, res, next) => {
  const product = await product_model
    .findOne({ _id: req.params.productId })
    .populate([
      {
        path: "categoryId",
      },
    ]);
  if (!product) {
    return next(new Error("product id fail"));
  }
  res.json({ message: "success", product });
};
