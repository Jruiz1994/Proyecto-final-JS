var alimentos = [];
class Alimento {
    constructor(marca, costo, precioFinal, moneda) {
        this.marca = marca;
        this.costo = costo;
        this.precioFinal = precioFinal;
        this.moneda = moneda;
    }
};
let alimentoPrecargado1 = new Alimento("Eukanuba", 1800, 2300, "$");
let alimentoPrecargado2 = new Alimento("The taste of the wild", 5900, 6400, "$");
let alimentoPrecargado3 = new Alimento("Pro Plan", 3300, 3800, "$");
let alimentoPrecargado4 = new Alimento("Royal Canin", 5100, 5600, "$");
alimentos.push(alimentoPrecargado1);
alimentos.push(alimentoPrecargado2);
alimentos.push(alimentoPrecargado3);
alimentos.push(alimentoPrecargado4);

//CARGA TODAS LAS RACIONES EN EL DESPLEGABLE DE MARCAS PARA COMPRAR Y OBTIENE LA COTIZACION ACTUAL DEL DOLAR
window.onload = function() {
    for (let j = 0; j < alimentos.length; j++) {
        $("#marcaSelect").append("<option value=" + alimentos[j].precioFinal + ">" + alimentos[j].marca + "</option>");
    }
    getCotizacion();
}

// CODIGO PARA MOSTRAR LA COTIZACION
const urlget = "https://criptoya.com/api/dolar";
let cotizacionOficial;

function getCotizacion() {
    $.get(urlget, function(respuesta, estado) {
        if (estado === "success") {
            let misDatos = respuesta;
            $("#cotizacionChild").empty();
            $("#cotizacionChild").append(`<div> 
                    <h3>Cotización del dólar en Ars</h3>
                    <h4>Cotización Banco Nación</h4>
                    <p>${misDatos.oficial}</p>
                    <h4>Cotización Dólar con Bitcoin</h4>
                    <p>${misDatos.ccb}</p>
                    <h4>Cotización Dólar Blue</h4>
                    <p>${misDatos.blue}</p>
                    <h4>Cotización Dólar Bolsa</h4>
                    <p>${misDatos.mep}</p>
                    </div>`);
            cotizacionOficial = misDatos.oficial;
        } else {
            $("#cotizacionChild").append(`<div> 
                    <h3>Ha habido un error. Reintente luego</h3>
                    </div`);
        }
    })
}


//CODIGO DE AGREGAR MARCA NUEVA
let botonAgregar = document.getElementById("agregarMarca");
botonAgregar.addEventListener("click", agregarMarca);
botonAgregar.addEventListener("dblclick", () =>
    alert("Oye, tranquilo viejo, con un solo click alcanza :)"));

function agregarMarca() {
    let marca = $("#marcaNueva").val();
    let costo = parseInt($("#precioMarcaNueva").val());
    let precioFinal = costo * 120 / 100;
    const moneda = "$";
    if (marca != '' && costo != NaN) {
        let alimentoNuevo = new Alimento(marca, costo, precioFinal, moneda);
        alimentos.push(alimentoNuevo);
        ($("#pAgregarMarca").html("Se agregó la marca: " + alimentoNuevo.marca + ", al costo $" + alimentoNuevo.costo + " y su precio al publico es de $" + precioFinal));

        $("#marcaSelect").empty();
        for (let i = 0; i < alimentos.length; i++) {
            $("#marcaSelect").append("<option value=" + alimentos[i].precioFinal + ">" + alimentos[i].marca + "</option>");
        }
        CalcularPromedio(alimentos);
    } else {
        alert("Debe ingresar algun valor");
    }
}





/* CODIGO DE COMPRA DE ALIMENTO*/


$(document).ready(function() {
    //  CODIGO QUE MUESTRA U OCULTA CAMPO DE DIRECCION DEPENDIENDO DE SI EL CLIENTE QUIERE ENVIO O NO
    $("input[type='radio']").change(function() {

        var conEnvio = $('input[name="envio"]:checked').val();
        if (conEnvio === "Si") {
            $("#envio").show();
        } else {
            $("#envio").hide();
        }
    });

    //CODIGO DE ANIMACION DEL LOGO DEL HEADER
    $("#logo").animate({
        opacity: '0,5',
        width: '200px'
    }, "slow")

    //CODIGO DE ANIMACION ENCADENADA DEL H1 DEL HEADER
    $("h1").css("color", "black")
        .slideUp(1000)
        .slideDown(1000);
});

let botonCompra = document.getElementById("comprar");
botonCompra.addEventListener("click", calcularMonto);

function calcularMonto() {
    let descuento = $("#descuento").val();
    let precioTotal;
    let envio = enviarADomicilio();
    let costoEnvio = 250;
    let moneda = $("#monedaSelect").val();
    let alimentoSeleccionado = Number($("#marcaSelect").val());


    if (moneda === "$") {
        if (envio) {
            precioTotal = alimentoSeleccionado - (alimentoSeleccionado * descuento) / 100 + costoEnvio;
        } else {
            precioTotal = alimentoSeleccionado - (alimentoSeleccionado * descuento) / 100;
        }
    } else if (moneda === "USD") {
        if (envio) {
            precioTotal = alimentoSeleccionado / cotizacionOficial - (alimentoSeleccionado / cotizacionOficial * descuento) / 100 + costoEnvio / cotizacionOficial;
        } else {
            precioTotal = alimentoSeleccionado / cotizacionOficial - (alimentoSeleccionado / cotizacionOficial * descuento) / 100;
        }
    }

    if (alimentoSeleccionado === 0) {
        alert("Debe seleccionar una marca");
    }
    precioTotal = precioTotal.toFixed(2);



    // CODIGO GUARDA EN STORAGE LOS DATOS DE LA COMPRA
    const guardarLocal = (marca, precioTotal) => (localStorage.setItem(marca, precioTotal));
    for (let i = 0; i < alimentos.length; i++) {
        if (alimentos[i].precioFinal === alimentoSeleccionado) {
            guardarLocal(JSON.stringify(alimentos[i].marca), precioTotal);
            mostrarConfirmacionCompra(JSON.stringify(alimentos[i].marca), JSON.stringify(precioTotal), moneda);
        }
    }

}

//SI SE SOLICITO ENVIO, DEVUELVE TRUE
function enviarADomicilio() {
    var conEnvio = $('input[name="envio"]:checked').val();

    if (conEnvio == "Si") {
        conEnvio = true;
    } else {
        conEnvio = false;
    }
    return conEnvio;
}


function mostrarConfirmacionCompra(marca, precioTotal, moneda) {
    precioTotal = localStorage.getItem(marca);
    if (precioTotal !== '0.00') {
        // let parrafo = document.createElement("p");
        // let padreParrafo = document.getElementById("divComprarAlimento");
        // padreParrafo.innerHTML = "<p>Su compra se confirmó correctamente. Usted compró : " + marca + " .El monto a abonar es de " + moneda + " " + precioTotal + "</p>";
        // document.padreParrafo.append(parrafo);
        $("#divComprarAlimento").append("<p>Su compra se confirmó correctamente. Usted compró : " + marca + " .El monto a abonar es de " + moneda + " " + precioTotal + "</p>");
    }
}


//CODIGO DE GENERAR TABLA
$("#createTable").click(crearTabla);

function crearTabla() {

    let rdo = document.getElementById("resultados");


    let tabla = "<table border=1>";
    tabla =
        tabla +
        `<tr><th>Marca</th><th>Precio Consumidor</th><th>Costo</th><th>Accion</th></tr>`;

    for (const elem of alimentos) {
        tabla =
            tabla +
            `<tr><td>${elem.marca}</td><td>${elem.precioFinal}</td><td>${elem.costo}</td><td><input type="button" id="${elem.precioFinal}" onclick="eliminarAlimento(${elem.precioFinal})" value="Eliminar"></td></tr>`;
    }

    tabla = tabla + "</table>";

    rdo.innerHTML = tabla;

    $("#parrafo2").css({
        "font-weight": "bold"
    })

};


//CODIGO ELIMINAR ALIMENTO
function eliminarAlimento(idDelAlimento) {
    for (let i = 0; i < alimentos.length; i++) {
        if (idDelAlimento === alimentos[i].precioFinal) {
            alimentos.splice(i, 1);
            crearTabla();
            CalcularPromedio(alimentos);
        }
    }
}


// CODIGO DE CALCULAR PROMEDIO DE PRECIOS
function CalcularPromedio(arrayDeAlimentos) {
    let sumaDePrecios = 0;
    let promedio = 0;
    for (let i = 0; i < arrayDeAlimentos.length; i++) {
        sumaDePrecios += parseInt(arrayDeAlimentos[i].precioFinal);
    }
    promedio = sumaDePrecios / arrayDeAlimentos.length;
    promedio = promedio.toFixed(2);
    $("#parrafo2").html("El promedio de precios entre todos los alimentos es $" + promedio);
}

CalcularPromedio(alimentos);