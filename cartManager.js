const fs = require("fs");
class CartManager {
  #idInicial = 1;

  async addCart() {
    try {
      let currentCarts;
      try {
        currentCarts = await fs.promises.readFile(`./carritos.json`, "utf-8");
        if (currentCarts == "") {
          await fs.promises.writeFile(
            "./carritos.json",
            JSON.stringify([
              {
                id: this.#idInicial,
                products: [],
              },
            ])
          );
          return "Carrito de compras creado Exitosamente!";
        }
      } catch (readError) {
        if (readError.code === "ENOENT") {
          // Si el archivo no existe, crea uno con un carrito inicial
          await fs.promises.writeFile(
            "./carritos.json",
            JSON.stringify([
              {
                id: this.#idInicial,
                products: [],
              },
            ])
          );
          return "Carrito de compras creado Exitosamente!";
        } else {
          throw readError; // Reenviar el error si no es ENOENT
        }
      }

      // Si el archivo existe, agrega un nuevo carrito
      const currentCartsParsed = JSON.parse(currentCarts);
      const lastCartId = currentCartsParsed.slice(-1)[0].id;
      const newCart = {
        id: lastCartId + 1,
        products: [],
      };
      await fs.promises.writeFile(
        "./carritos.json",
        JSON.stringify([...currentCartsParsed, newCart])
      );

      return "Carrito de compras creado Exitosamente!";
    } catch (error) {
      return "Error al procesar la solicitud.";
    }
  }

  async getProductsCart(id) {
    let data;
    try {
      data = await fs.promises.readFile("./carritos.json", "utf-8");
      if (data !== "") {
        const dataParsed = JSON.parse(data);
        const carritoSelect = dataParsed.find((carrito) => carrito.id === id);
        console.log("carrito select", carritoSelect);
        if (!carritoSelect) {
          return "No hay un carrito registrado con ese ID";
        } else if (carritoSelect.products.length === 0) {
          return "Se encontro el carrito pero hay productos registrados ";
        }
        return carritoSelect.products;
      }

      return "No hay carritos para mostrar";
    } catch (error) {
      if (error.code == "ENOENT") {
        return "No existe ningun Carrito.";
      }
    }
  }

  async addProduct(cid, pid) {
    const newProduct = {
      id: pid,
      quantity: 1,
    };

    let data;
    try {
      data = await fs.promises.readFile("./carritos.json", "utf-8");
      console.log("estoy en await data", data);
      if (data !== "") {
        const dataParsed = JSON.parse(data);
        const indexCarrito = dataParsed.findIndex((data) => data.id === cid);
        //   const carritoSelect = dataParsed.find((carrito) => carrito.id === cid);
        if (indexCarrito === -1) {
          return "No hay un carrito registrado con ese ID";
        }
        const indexProducto = dataParsed[indexCarrito].products.findIndex(
          (product) => product.id === pid
        );
        if (indexProducto === -1) {
          dataParsed[indexCarrito].products.push(newProduct);
        } else {
          // El producto ya existe, aumentamos la cantidad
          dataParsed[carritoSelectIndex].products[
            existingProductIndex
          ].quantity += newProduct.quantity;
        }
        console.log(dataParsed);
        await fs.promises.writeFile(
          "./carritos.json",
          JSON.stringify(dataParsed)
        );

        return "Operación completada satisfactoriamente";
      }
      // en caso que data == a "" devuelvo esto
      return "No hay carritos para mostrar";
    } catch (error) {
      if (error.code == "ENOENT") {
        return "No existe ningun Carrito.";
      }
    }
  }
}

const cart = new CartManager();
module.exports = cart;

// cart.addProduct().then((res) => console.log(res));
