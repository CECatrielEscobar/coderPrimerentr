const express = require("express");
const producto = require("./productManager");
const router = express.Router();

//Funcion para no repeter codigo! evita que el usuario ingrese elementos de mas a un producto
const checkKeys = (data) => {
  const clavesEsperadas = [
    "title",
    "description",
    "price",
    "thumbnails",
    "code",
    "stock",
    "status",
    "category",
  ];

  const clavesIngresadas = Object.keys(data);
  const noHayClavesAdicionales = clavesIngresadas.every((clave) =>
    clavesEsperadas.includes(clave)
  );
  return noHayClavesAdicionales;
};
router.get("/products", async (req, res) => {
  try {
    const products = await producto.getProducts();
    if (!products)
      return res.send({ message: "No hay productos para mostrar" });
    let limit = req.query.limit;
    limit = parseInt(limit);

    if (!limit || isNaN(limit)) {
      // chequeo si limit viene vacio o limit no es un dato de tipo "number" devuelvo en la respuesta todos los productos
      return res.send({ products });
    }

    const productsLimit = products.slice(0, limit);
    res.send({ productsLimit });
  } catch (error) {
    console.log("Ha ocurrido un error al obtener los  productos", error);
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
    //Chequea que el id ingresado sea de tipo number
    if (isNaN(id)) {
      throw new Error("El ID debe ser NUMERICO");
    }
    const producto = await producto.getProductById(id);
    //Chequea que producto sea un dato tipo "string" ya que desde el metodo "getProductById" si hay algun tipo de error retorna un texto detallando el error
    if (typeof producto === "string") throw new Error(producto);
    return res.send({ producto });
  } catch (error) {
    res.status(400).send({ Error: error.message });
  }
});

router.post("/products", async (req, res) => {
  try {
    const data = req.body;
    const keysCheck = checkKeys(data);

    if (!keysCheck) {
      throw new Error(
        "Se han proporcionado claves adicionales en la solicitud."
      );
    }

    if (!Array.isArray(data.thumbnails)) {
      //verificar si thumbnails es un array
      throw new Error("Thumbnails debe ser un array.");
    }
    const response = await producto.addProduct(data);
    console.log(response);
    if (response.respuesta !== "Producto agregado exitosamente") {
      throw new Error(response);
    }
    res.send({
      message: "Producto agregado exitosamente",
      "Titulo del producto": data.title,
    });
  } catch (error) {
    res.status(400).send({ Error: error.message });
  }
});

router.put("/products/:pid", async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
    console.log(id);
    //Chequea que el id ingresado sea de tipo number
    if (isNaN(id)) {
      throw new Error("El ID debe ser NUMERICO");
    } else if (!id) {
      throw new Error(
        "Si desea actualizar un producto Ingrese un ID distinta de 0"
      );
    }
    const data = req.body;
    const keysCheck = checkKeys(data);
    if (!keysCheck) {
      throw new Error(
        "Se han proporcionado claves adicionales en la solicitud."
      );
    }

    if (data.thumbnails) {
      if (!Array.isArray(data.thumbnails)) {
        //verificar si thumbnails es un array
        throw new Error("Thumbnails debe ser un array.");
      }
    }
    const response = await producto.updateProduct(id, data);
    if (response !== "Producto actualizado correctamente") {
      throw new Error(response);
    }
    res.send({ message: response, Actualizacion: data });
  } catch (error) {
    res.status(400).send({ Error: error.message });
  }
});

router.delete("/products/:pid", async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
    if (isNaN(id)) {
      throw new Error("El ID debe ser NUMERICO");
    } else if (!id) {
      throw new Error(
        "Si desea actualizar un producto Ingrese un ID distinta de 0"
      );
    }
    const response = await producto.deleteProduct(id);
    if (response !== "Producto eliminado exitosamente") {
      throw new Error(response);
    }
    res.send({ message: response });
  } catch (error) {
    res.status(400).send({ Error: error.message });
  }
});

module.exports = router;
