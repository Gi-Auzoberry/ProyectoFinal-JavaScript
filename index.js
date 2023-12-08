class Compra {
    constructor(carritodeCompra) {
        this.carrito = carritodeCompra
    }
    total() {
        return this.carrito.reduce((suma, item) => suma + item.precio, 0)
    }
}

const URL = "./items.json";
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

function comprar(items) {
    document.querySelectorAll("button.agregar").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const codigo = parseInt(e.target.id)
            const seleccion = items.find((item) => item.codigo === codigo)
            carrito.push(seleccion)
            localStorage.setItem("carritoGuardado", JSON.stringify(carrito))
            Toastify({
                text: `Se agregó ${seleccion.producto} al carrito`,
                duration: 2000,
                stopOnFocus: false,
                className: "info",
                style: {background: "#9f6544"}
            }).showToast();
        })
    })
}

async function cargarContenido() {
    const response = await fetch(URL)
    const items = await response.json()
    items.forEach((item) => contenido.innerHTML += crearContenido(item))
    comprar(items)
}
cargarContenido()

verCarrito.addEventListener("click", () => {
    itemsEnCarrito.innerHTML = ""
    itemsEnCarrito.style.display = "flex"
    
    if (carrito.length === 0) {
        itemsEnCarrito.innerHTML = `<h4>No hay productos en tu carrito</h4>
                                    <button id="cerrarVacio" class="btn-cierra"> X </button>`
        document.querySelector("#cerrarVacio").addEventListener("click", () => {
            itemsEnCarrito.style.display = "none"
        })
    } else {
        itemsEnCarrito.innerHTML = `<div class="emergente">
                                        <h3> Carrito </h3> 
                                        <button id="cerrar" class="btn-cierra"> X </button>
                                    </div>`
        document.querySelector("#cerrar").addEventListener("click", () => {
            itemsEnCarrito.style.display = "none"
        })
        carrito.forEach((product) => {
            const interiorCarrito = document.createElement("div")
            interiorCarrito.className = "productosCarrito"
            interiorCarrito.innerHTML = `<img src= "${product.imagen}">
                                         <h3> ${product.producto} </h3>
                                         <p> $${product.precio} </p>
                                         <hr>`
            itemsEnCarrito.append(interiorCarrito)
        })

        let compra = new Compra(carrito)
        let total = compra.total()

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