function Compra(carritodeCompra) {
    this.carrito = carritodeCompra
    this.total = function () {
        if (this.carrito.length > 0) {
            return this.carrito.reduce((suma, item) => suma + item.precio, 0)
        }
    }
}

const URL = "./items.json"
const items = []

let carrito = JSON.parse(localStorage.getItem("carritoGuardado")) || []

const contenido = document.querySelector("div.productosItems")
const verCarrito = document.querySelector("#bag")
const itemsEnCarrito = document.querySelector("div.carritoItems")

function crearContenido(item) {
    return `<div class="cards">
                <img src= "${item.imagen}">
                <h5> ${item.producto} </h5>
                <p> $${item.precio} </p>
                <button id="${item.codigo}" class="agregar"> Agregar </button>
            </div>`
}
function comprar() {
    const agregado = document.querySelectorAll("button.agregar")
    agregado.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const codigo = parseInt(e.target.id)
            const seleccion = items.find((item) => item.codigo === codigo)
            carrito.push(seleccion)
            localStorage.setItem("carritoGuardado", JSON.stringify(carrito))
        })
    })
}
function cargarContenido() {
    items.forEach((item) => contenido.innerHTML += crearContenido(item))
    comprar()
}
function carga2() {
    fetch(URL)
    .then((response) => response.json())
    .then((data) => items.push(...data))
    .then(() => cargarContenido())
}
carga2()

verCarrito.addEventListener("click", (e) => {
    itemsEnCarrito.innerHTML = ""
    itemsEnCarrito.style.display = "flex"

    if (carrito.length === 0) {
        itemsEnCarrito.innerHTML = `<h4>No hay productos en tu carrito</h4>
                                    <button id="cerrarVacio" class="btn-cierra"> X </button>`
        const cerrarVacioBoton = document.querySelector("#cerrarVacio")
        cerrarVacioBoton.addEventListener("click", (e) => {
            itemsEnCarrito.style.display = "none"
        });
    } else {
        const carritoEmergente = document.createElement("div")
        carritoEmergente.className = "emergente"
        carritoEmergente.innerHTML = `<h3> Carrito </h3> 
                                      <button id="cerrar" class="btn-cierra"> X </button>`
        itemsEnCarrito.append(carritoEmergente)

        const cerrarBoton = document.querySelector("#cerrar")
        cerrarBoton.addEventListener("click", (e) => {
            itemsEnCarrito.style.display = "none"
        });

        carrito.forEach((product) => {
            const interiorCarrito = document.createElement("div")
            interiorCarrito.className = "productosCarrito"
            interiorCarrito.innerHTML = `<img src= "${product.imagen}">
                                         <h3> ${product.producto} </h3>
                                         <p> $${product.precio} </p>
                                         <hr>`
            itemsEnCarrito.append(interiorCarrito)
        })

        let compra = new Compra(carrito);
        let total = compra.total();

        const totalCompra = document.createElement("div")
        totalCompra.className = "totalCompra"
        totalCompra.innerHTML = `Total a pagar: $${total}
                                <button id="finalizar" class="btn-cierra">Finalizar Compra</button>`
        itemsEnCarrito.append(totalCompra)

        const btnFin = document.querySelector("#finalizar")
        btnFin.addEventListener("click", (e) => {
            const alerta = document.querySelector(".alert")
            alerta.style.display = 'block'
            itemsEnCarrito.style.display = "none"
            window.scrollTo(0, document.body.scrollHeight)
            carrito = []
            localStorage.setItem("carritoGuardado", JSON.stringify(carrito))
        })
    }
})


