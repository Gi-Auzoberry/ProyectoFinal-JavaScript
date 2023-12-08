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

function mensajito(mensaje, tiempo, estilo) {
    Toastify({
        text: mensaje,
        duration: tiempo,
        backgroundColor: estilo,
        className: "info"
    }).showToast();
}

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
            mensajito(`Se agregó ${seleccion.producto} al carrito`, 2000, "linear-gradient(to right, #9f6544b9, #9f6544)")

        })
    })
}

async function cargarContenido() {
    const response = await fetch(URL)
    const items = await response.json()
    items.forEach((item) => contenido.innerHTML += crearContenido(item))
    comprar(items)
    const campoBusqueda = document.getElementById('busqueda')
    campoBusqueda.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            const busqueda = this.value
            const resultados = items.filter(item => item.producto.toLowerCase().includes(busqueda.toLowerCase()))
            contenido.innerHTML = ''
            if (resultados.length > 0) {
                resultados.forEach((item) => contenido.innerHTML += crearContenido(item))
                comprar(resultados)
            } else {
                mensajito(`Disculpa! No contamos con ${busqueda}`, 3000, "#1b3e36")
                items.forEach((item) => contenido.innerHTML += crearContenido(item))
                comprar(items)
            }
        }
    })
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
            mensajito("Un momento! Estamos procesando tu compra...", 3000, "linear-gradient(to right, #9f6544b9, #9f6544)")
            setTimeout(() => {
                const alerta = document.querySelector(".alert")
                alerta.style.display = 'block'
                itemsEnCarrito.style.display = "none"
                window.scrollTo(0, document.body.scrollHeight)
                carrito = [];
                localStorage.setItem("carritoGuardado", JSON.stringify(carrito))
            }, 3500)
        })
    }
})