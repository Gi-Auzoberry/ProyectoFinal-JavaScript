function Compra(carritodeCompra) {
    this.carrito = carritodeCompra
    this.total = function () {
        if (this.carrito.length > 0) {
            return this.carrito.reduce((suma, item) => suma + item.precio, 0)
        }
    }
}

const items = [
    { codigo: 1, producto: 'Cafe', precio: 2500, imagen: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { codigo: 2, producto: 'Bubble Tea', precio: 3000, imagen: "https://images.unsplash.com/photo-1558857563-b371033873b8?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { codigo: 3, producto: 'Sandwiches', precio: 4500, imagen: "https://images.unsplash.com/photo-1540713434306-58505cf1b6fc?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { codigo: 4, producto: 'Pasteles', precio: 5000, imagen: "https://images.unsplash.com/photo-1595080622896-844ff207e639?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { codigo: 5, producto: 'Helados', precio: 1500, imagen: "https://images.unsplash.com/photo-1549395156-e0c1fe6fc7a5?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { codigo: 6, producto: 'Plantas', precio: 10000, imagen: "https://images.unsplash.com/photo-1601985705806-5b9a71f6004f?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
]


let carrito = JSON.parse(localStorage.getItem("carritoGuardado")) || []

const contenido = document.querySelector("div.productosItems")
const verCarrito = document.querySelector("#bag")
const itemsEnCarrito = document.querySelector("div.carritoItems")

function crearContenido(item) {
    return `<div class="cards">
                <img src= "${item.imagen}">
                <h3> ${item.producto} </h3>
                <p> $${item.precio} </p>
                <button id="${item.codigo}" class="agregar"> Agregar </button>
            </div>`
}

function cargarContenido() {
    items.forEach((item) => contenido.innerHTML += crearContenido(item))
    comprar()
}
cargarContenido();

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

verCarrito.addEventListener("click", (e) => {
    itemsEnCarrito.innerHTML = ""
    itemsEnCarrito.style.display = "flex"

    if (carrito.length === 0) {
        itemsEnCarrito.innerHTML = `<h3>No hay nada en el carrito</h3>
                                    <button id="cerrarVacio" class="btn-cierra"> X </i> </button>`
        const cerrarVacioBoton = document.querySelector("#cerrarVacio")
        cerrarVacioBoton.addEventListener("click", (e) => {
            itemsEnCarrito.style.display = "none"
        });
    } else {
        const carritoEmergente = document.createElement("div")
        carritoEmergente.className = "emergente"
        carritoEmergente.innerHTML = `<h1> Carrito </h1>
                                      <button id="cerrar" class="btn-cierra"> X </i> </button>`
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
                                         <p> $${product.precio} </p>`
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
