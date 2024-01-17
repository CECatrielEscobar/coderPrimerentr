const express = require("express");
const router = express.Router();
const fs = require("fs");
const cartManager = require("./cartManager.js");
const cart = require("./cartManager.js");

// cartManager.addProduct().then((res) => console.log(res));

router.post("/carts", async (req, res) => {
  try {
    const response = await cartManager.addCart();
    if (response !== "Carrito de compras creado Exitosamente!") {
      throw new Error(response);
    }
    res.send({ message: response });
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const id = parseInt(req.params.cid);
    console.log(id);
    //Chequea que el id ingresado sea de tipo number
    if (isNaN(id)) {
      throw new Error("El ID debe ser NUMERICO");
    }
    const response = await cartManager.getProductsCart(id);
    if (!Array.isArray(response)) {
      throw new Error(response);
    }
    res.send({
      message: "Carrito allado exitosamente",
      productos: response,
    });
    //Primero voy a comprobar que exista el archivo y en caso de no existir devolvere un error.
  } catch (error) {
    res.status(200).send({ Error: error.message });
  }
});

router.post("/carts/:cid/products/:pid", async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    if (isNaN(cid) || isNaN(pid)) {
      throw new Error("El ID debe ser NUMERICO");
    }
    const response = await cartManager.addProduct(cid, pid);
    if (response != "Operación completada satisfactoriamente") {
      throw new Error(response);
    }

    res.send({ message: response });
  } catch (error) {
    res.status(400).send({ Error: error.message });
  }
});

module.exports = router;
