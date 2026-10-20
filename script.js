/* ==========================================================================
   ITO 3D · Comportamiento de todas las páginas
   Cada bloque revisa si su elemento existe, así el mismo archivo sirve
   para index.html, producto.html y cotiza.html.
   Los productos salen de catalogo.js.
   ========================================================================== */

(function () {
  "use strict";

  /* Número de WhatsApp Business con código de país, sin + ni espacios */
  var WHATSAPP_NUMBER = "573142155358";

  var CLAVE_CARRITO = "ito3d-carrito";
  var CATALOGO = window.ITO_CATALOGO || { categorias: [], productos: [] };
  var CLASE_COLOR = { "Carbón": "carbon", "Hueso": "hueso", "Arena": "arena", "Bermellón": "bermellon", "Gris": "gris" };
  var PESOS = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

  // Marca la página como "con JS" para que el menú del celular arranque cerrado
  document.documentElement.classList.add("js");

  /* Utilidades --------------------------------------------------------- */

  function crear(tag, clase, texto) {
    var n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto !== undefined && texto !== null) n.textContent = texto;
    return n;
  }

  function waLink(texto) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(texto);
  }

  function precioTexto(precio) {
    return precio === null || precio === undefined ? "[PRECIO]" : PESOS.format(precio);
  }

  function productoPorId(id) {
    for (var i = 0; i < CATALOGO.productos.length; i++) {
      if (CATALOGO.productos[i].id === id) return CATALOGO.productos[i];
    }
    return null;
  }

  function categoriaPorId(id) {
    for (var i = 0; i < CATALOGO.categorias.length; i++) {
      if (CATALOGO.categorias[i].id === id) return CATALOGO.categorias[i];
    }
    return null;
  }

  function puntosDeColor(colores) {
    var cont = crear("span", "dots");
    cont.setAttribute("aria-label", "Colores disponibles");
    (colores || []).forEach(function (c) {
      cont.appendChild(crear("span", "dot dot--" + (CLASE_COLOR[c] || "carbon")));
    });
    return cont;
  }

  function avisar(texto) {
    var zona = document.getElementById("aviso-global");
    if (zona) zona.textContent = texto;
  }

  /* 1. Ventanas (catálogo y carrito) ----------------------------------- */

  function abrirVentana(dialogo) {
    if (!dialogo || dialogo.open) return;
    if (typeof dialogo.showModal === "function") {
      dialogo.showModal();
    } else {
      dialogo.setAttribute("open", "");
    }
  }

  function cerrarVentanas() {
    document.querySelectorAll("dialog[open]").forEach(function (d) {
      if (typeof d.close === "function") d.close();
      else d.removeAttribute("open");
    });
  }

  function setupVentanas() {
    document.querySelectorAll("dialog.modal").forEach(function (d) {
      // Clic fuera de la caja cierra la ventana
      d.addEventListener("click", function (e) {
        if (e.target === d) d.close();
      });
    });

    document.addEventListener("click", function (e) {
      var cerrar = e.target.closest("[data-cerrar]");
      if (cerrar) {
        var d = cerrar.closest("dialog");
        if (d) d.close();
        return;
      }

      var cat = e.target.closest("[data-catalogo]");
      if (cat) {
        e.preventDefault();
        cerrarVentanas();
        abrirCatalogo(cat.getAttribute("data-catalogo"));
        return;
      }

      if (e.target.closest("[data-buscar]")) {
        e.preventDefault();
        cerrarVentanas();
        abrirCatalogo("todo", true);
        return;
      }

      if (e.target.closest("[data-abrir-carrito]")) {
        e.preventDefault();
        cerrarVentanas();
        abrirVentana(document.getElementById("carrito-panel"));
        return;
      }

      var agregar = e.target.closest("[data-agregar]");
      if (agregar) {
        var p = productoPorId(agregar.getAttribute("data-agregar"));
        if (p) {
          agregarAlCarrito(p.id, p.colores[0], "", 1);
          agregar.textContent = "Agregado";
          window.setTimeout(function () {
            agregar.textContent = "Agregar";
          }, 1400);
        }
      }
    });
  }

  /* 2. Catálogo --------------------------------------------------------- */

  var estadoCatalogo = { categoria: "todo", texto: "" };

  function abrirCatalogo(categoria, enfocarBusqueda) {
    var dialogo = document.getElementById("catalogo");
    if (!dialogo) return;
    estadoCatalogo.categoria = categoriaPorId(categoria) ? categoria : "todo";
    estadoCatalogo.texto = "";
    var buscar = document.getElementById("catalogo-buscar");
    if (buscar) buscar.value = "";
    dibujarCatalogo();
    abrirVentana(dialogo);
    if (enfocarBusqueda && buscar) buscar.focus();
  }

  function dibujarCatalogo() {
    var titulo = document.getElementById("catalogo-titulo");
    var frase = document.getElementById("catalogo-frase");
    var chips = document.getElementById("catalogo-chips");
    var lista = document.getElementById("catalogo-lista");
    var vacio = document.getElementById("catalogo-vacio");
    if (!lista) return;

    var cat = categoriaPorId(estadoCatalogo.categoria);
    titulo.textContent = cat ? cat.nombre : "Tienda";
    frase.textContent = cat ? cat.frase : "Todo lo que fabricamos, hecho a pedido.";

    // Botones de categoría
    chips.textContent = "";
    [{ id: "todo", nombre: "Todo" }].concat(CATALOGO.categorias).forEach(function (c) {
      var b = crear("button", "chip", c.nombre);
      b.type = "button";
      var activo = c.id === estadoCatalogo.categoria;
      b.setAttribute("aria-pressed", String(activo));
      if (activo) b.classList.add("is-active");
      b.addEventListener("click", function () {
        estadoCatalogo.categoria = c.id;
        dibujarCatalogo();
      });
      chips.appendChild(b);
    });

    // Productos
    var texto = estadoCatalogo.texto.trim().toLowerCase();
    var productos = CATALOGO.productos.filter(function (p) {
      var okCat = estadoCatalogo.categoria === "todo" || p.categoria === estadoCatalogo.categoria;
      var okTexto = !texto || p.nombre.toLowerCase().indexOf(texto) !== -1;
      return okCat && okTexto;
    });

    lista.textContent = "";
    vacio.hidden = productos.length > 0;
    productos.forEach(function (p) {
      var item = crear("article", "cat-item");
      var enlace = crear("a", "cat-item__link");
      enlace.href = "producto.html?id=" + encodeURIComponent(p.id);
      enlace.appendChild(crear("div", "ph ph--" + p.categoria, "Foto del producto"));
      enlace.appendChild(crear("h3", "cat-item__name", p.nombre));
      item.appendChild(enlace);

      var fila = crear("div", "cat-item__row");
      fila.appendChild(crear("span", "cat-item__price", precioTexto(p.precio)));
      fila.appendChild(puntosDeColor(p.colores));
      item.appendChild(fila);

      var boton = crear("button", "btn btn--primary btn--sm", "Agregar");
      boton.type = "button";
      boton.setAttribute("data-agregar", p.id);
      boton.setAttribute("aria-label", "Agregar " + p.nombre + " al carrito");
      item.appendChild(boton);
      lista.appendChild(item);
    });
  }

  function setupCatalogo() {
    var buscar = document.getElementById("catalogo-buscar");
    if (buscar) {
      buscar.addEventListener("input", function () {
        estadoCatalogo.texto = buscar.value;
        dibujarCatalogo();
      });
    }
    // Entrar con #tienda abre el catálogo completo
    if (window.location.hash === "#tienda") abrirCatalogo("todo");
  }

  /* 3. Carrito ---------------------------------------------------------- */

  var carrito = [];

  function leerCarrito() {
    try {
      var guardado = JSON.parse(window.localStorage.getItem(CLAVE_CARRITO) || "[]");
      if (Array.isArray(guardado)) {
        carrito = guardado.filter(function (l) {
          return l && productoPorId(l.id) && l.cant > 0;
        });
      }
    } catch (err) {
      carrito = [];
    }
  }

  function guardarCarrito() {
    try {
      window.localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    } catch (err) {
      /* sin almacenamiento: el carrito vive solo en esta página */
    }
  }

  function agregarAlCarrito(id, color, texto, cant) {
    texto = (texto || "").trim();
    var existente = null;
    carrito.forEach(function (l) {
      if (l.id === id && l.color === color && (l.texto || "") === texto) existente = l;
    });
    if (existente) {
      existente.cant = Math.min(99, existente.cant + cant);
    } else {
      carrito.push({ id: id, color: color, texto: texto, cant: cant });
    }
    guardarCarrito();
    dibujarCarrito();
    var p = productoPorId(id);
    avisar((p ? p.nombre : "Producto") + " agregado al carrito.");
  }

  function totalCarrito() {
    var total = 0;
    var completo = true;
    carrito.forEach(function (l) {
      var p = productoPorId(l.id);
      if (!p || p.precio === null || p.precio === undefined) completo = false;
      else total += p.precio * l.cant;
    });
    return { total: total, completo: completo };
  }

  function textoPedido() {
    var t = totalCarrito();
    var lineas = ["Hola, quiero hacer este pedido:"];
    carrito.forEach(function (l) {
      var p = productoPorId(l.id);
      var detalle = [l.color];
      if (l.texto) detalle.push('personalizado con "' + l.texto + '"');
      lineas.push("- " + l.cant + " x " + p.nombre + " (" + detalle.join(", ") + ")");
    });
    lineas.push(t.completo ? "Total: " + PESOS.format(t.total) : "Total: por confirmar");
    return lineas.join("\n");
  }

  function botonCantidad(texto, etiqueta, accion) {
    var b = crear("button", "qty__btn", texto);
    b.type = "button";
    b.setAttribute("aria-label", etiqueta);
    b.addEventListener("click", accion);
    return b;
  }

  function dibujarCarrito() {
    var lista = document.getElementById("carrito-lista");
    var vacio = document.getElementById("carrito-vacio");
    var pie = document.getElementById("carrito-pie");
    var totalEl = document.getElementById("carrito-total");
    var nota = document.getElementById("carrito-nota");
    var wa = document.getElementById("carrito-wa");

    var unidades = carrito.reduce(function (s, l) { return s + l.cant; }, 0);
    document.querySelectorAll(".cart-count").forEach(function (b) {
      b.textContent = String(unidades);
      b.hidden = unidades === 0;
    });
    document.querySelectorAll(".cart-btn").forEach(function (b) {
      b.setAttribute("aria-label", unidades ? "Abrir carrito, " + unidades + (unidades === 1 ? " producto" : " productos") : "Abrir carrito");
    });

    if (!lista) return;
    lista.textContent = "";
    vacio.hidden = carrito.length > 0;
    pie.hidden = carrito.length === 0;

    carrito.forEach(function (l, i) {
      var p = productoPorId(l.id);
      var li = crear("li", "cart-line");

      var foto = crear("div", "ph ph--" + p.categoria, "Foto");
      foto.classList.add("cart-line__ph");
      li.appendChild(foto);

      var info = crear("div", "cart-line__info");
      var nombre = crear("a", "cart-line__name", p.nombre);
      nombre.href = "producto.html?id=" + encodeURIComponent(p.id);
      info.appendChild(nombre);
      info.appendChild(crear("span", "cart-line__meta", l.color + (l.texto ? ' · "' + l.texto + '"' : "")));

      var control = crear("div", "qty");
      control.appendChild(botonCantidad("−", "Quitar una unidad de " + p.nombre, function () {
        if (l.cant > 1) l.cant -= 1;
        else carrito.splice(i, 1);
        guardarCarrito();
        dibujarCarrito();
      }));
      var n = crear("span", "qty__n", String(l.cant));
      n.setAttribute("aria-label", l.cant + (l.cant === 1 ? " unidad" : " unidades"));
      control.appendChild(n);
      control.appendChild(botonCantidad("+", "Agregar una unidad de " + p.nombre, function () {
        l.cant = Math.min(99, l.cant + 1);
        guardarCarrito();
        dibujarCarrito();
      }));
      info.appendChild(control);
      li.appendChild(info);

      var lado = crear("div", "cart-line__side");
      lado.appendChild(crear("span", "cart-line__price", precioTexto(p.precio === null ? null : p.precio * l.cant)));
      var quitar = crear("button", "link-btn", "Quitar");
      quitar.type = "button";
      quitar.setAttribute("aria-label", "Quitar " + p.nombre + " del carrito");
      quitar.addEventListener("click", function () {
        carrito.splice(i, 1);
        guardarCarrito();
        dibujarCarrito();
      });
      lado.appendChild(quitar);
      li.appendChild(lado);

      lista.appendChild(li);
    });

    var t = totalCarrito();
    totalEl.textContent = t.completo ? PESOS.format(t.total) : "Por confirmar";
    nota.textContent = t.completo
      ? "Paga este valor en Wompi."
      : "Algunos precios aún no están definidos. Confirmamos el total por WhatsApp.";
    if (wa) wa.href = waLink(textoPedido());
  }

  function setupCarrito() {
    leerCarrito();
    dibujarCarrito();

    var vaciar = document.getElementById("carrito-vaciar");
    if (vaciar) {
      vaciar.addEventListener("click", function () {
        carrito = [];
        guardarCarrito();
        dibujarCarrito();
      });
    }
    // Si se agrega algo desde otra pestaña, esta se actualiza
    window.addEventListener("storage", function (e) {
      if (e.key === CLAVE_CARRITO) {
        leerCarrito();
        dibujarCarrito();
      }
    });
  }

  /* 4. Enlaces de WhatsApp y precios en tarjetas ------------------------ */

  function setupWhatsAppLinks() {
    document.querySelectorAll("a[data-wa]").forEach(function (a) {
      var texto = a.getAttribute("data-wa-text");
      if (texto) a.href = waLink(texto);
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  function setupPrecios() {
    document.querySelectorAll("[data-precio]").forEach(function (n) {
      var p = productoPorId(n.getAttribute("data-precio"));
      if (p) n.textContent = precioTexto(p.precio);
    });
  }

  /* 5. Menú del celular ------------------------------------------------- */

  function setupMenu() {
    var toggle = document.querySelector(".menu-toggle");
    var menu = document.getElementById("menu-principal");
    if (!toggle || !menu) return;

    function setOpen(abierto) {
      menu.classList.toggle("is-open", abierto);
      toggle.setAttribute("aria-expanded", String(abierto));
      toggle.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* 6. Ficha de producto ------------------------------------------------ */

  function dibujarProducto(p) {
    var cat = categoriaPorId(p.categoria);
    document.title = p.nombre + " · ITO 3D";

    document.getElementById("producto-nombre").textContent = p.nombre;
    document.getElementById("crumb-producto").textContent = p.nombre;
    document.getElementById("producto-precio").textContent = precioTexto(p.precio);
    document.getElementById("producto-desc").textContent = p.descripcion || "[DESCRIPCIÓN CORTA]";
    document.getElementById("spec-medidas").textContent = p.medidas || "[ANCHO × LARGO × ALTO] cm";
    document.getElementById("spec-material").textContent = p.material || "[MATERIAL]";
    document.getElementById("producto-dias").textContent =
      "Se fabrica en " + (p.dias ? p.dias : "[X]") + " días hábiles · envío a todo el país";

    var crumb = document.getElementById("crumb-cat");
    if (cat && crumb) {
      crumb.textContent = cat.nombre;
      crumb.setAttribute("data-catalogo", cat.id);
    }

    // Colores
    var cont = document.getElementById("swatches");
    cont.textContent = "";
    p.colores.forEach(function (nombre, i) {
      var label = crear("label", "swatch");
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "color";
      input.value = nombre;
      if (i === 0) input.checked = true;
      label.appendChild(input);
      label.appendChild(crear("span", "swatch__dot sw--" + (CLASE_COLOR[nombre] || "carbon")));
      label.appendChild(crear("span", "sr-only", nombre));
      cont.appendChild(label);
    });
    document.getElementById("color-elegido").textContent = p.colores[0];

    // Personalización
    var campo = document.getElementById("campo-personalizacion");
    campo.hidden = !p.personalizable;
    var extra = p.extraPersonalizacion === null || p.extraPersonalizacion === undefined ? "[VALOR]" : PESOS.format(p.extraPersonalizacion);
    document.getElementById("etiqueta-personalizacion").textContent = "Personalización (opcional, + " + extra + ")";

    // Relacionados: primero los de la misma categoría
    var rel = document.getElementById("relacionados");
    rel.textContent = "";
    var otros = CATALOGO.productos.filter(function (x) { return x.id !== p.id; });
    otros.sort(function (a, b) {
      return (b.categoria === p.categoria ? 1 : 0) - (a.categoria === p.categoria ? 1 : 0);
    });
    otros.slice(0, 4).forEach(function (x) {
      var a = crear("a", "related-card");
      a.href = "producto.html?id=" + encodeURIComponent(x.id);
      a.appendChild(crear("div", "ph ph--" + x.categoria, "Foto"));
      a.appendChild(crear("span", "related-card__name", x.nombre));
      a.appendChild(crear("span", "", precioTexto(x.precio)));
      rel.appendChild(a);
    });
  }

  function setupProduct() {
    var nombre = document.getElementById("producto-nombre");
    if (!nombre) return;

    var id = new URLSearchParams(window.location.search).get("id") || "bandeja-organizadora";
    var producto = productoPorId(id) || CATALOGO.productos[0];
    if (producto) dibujarProducto(producto);

    var colorLabel = document.getElementById("color-elegido");
    var personal = document.getElementById("personalizacion");
    var pedir = document.getElementById("pedir-wa");

    function colorActual() {
      var marcado = document.querySelector('input[name="color"]:checked');
      return marcado ? marcado.value : "";
    }

    function textoPersonal() {
      return personal && !personal.closest("[hidden]") ? personal.value.trim() : "";
    }

    function actualizarWhatsApp() {
      var color = colorActual();
      if (colorLabel) colorLabel.textContent = color;

      var texto = "Hola, quiero pedir: " + nombre.textContent.trim();
      if (color) texto += ", color " + color;
      if (textoPersonal()) texto += ', personalizado con "' + textoPersonal() + '"';
      texto += ". " + window.location.href;
      if (pedir) pedir.href = waLink(texto);
    }

    document.getElementById("swatches").addEventListener("change", actualizarWhatsApp);
    if (personal) personal.addEventListener("input", actualizarWhatsApp);
    actualizarWhatsApp();

    // Miniaturas: marca la activa. Cuando haya fotos reales, aquí se cambia la imagen grande.
    var thumbs = document.querySelectorAll(".thumb");
    thumbs.forEach(function (t) {
      t.addEventListener("click", function () {
        thumbs.forEach(function (o) {
          o.classList.remove("is-active");
          o.setAttribute("aria-pressed", "false");
        });
        t.classList.add("is-active");
        t.setAttribute("aria-pressed", "true");
      });
    });

    var agregar = document.getElementById("agregar-carrito");
    if (agregar && producto) {
      agregar.addEventListener("click", function () {
        agregarAlCarrito(producto.id, colorActual(), textoPersonal(), 1);
        cerrarVentanas();
        abrirVentana(document.getElementById("carrito-panel"));
      });
    }
  }

  /* 7. Formulario Cotiza tu diseño -------------------------------------- */

  function setupQuoteForm() {
    var form = document.getElementById("form-cotiza");
    if (!form) return;

    var archivo = document.getElementById("q-archivo");
    var enlace = document.getElementById("q-enlace");
    var estado = document.getElementById("form-estado");
    var MAX_BYTES = 50 * 1024 * 1024; // 50 MB, según el brief

    // Hace falta el archivo o el enlace (uno de los dos)
    function revisarArchivoOEnlace() {
      var hayArchivo = archivo.files && archivo.files.length > 0;
      var hayEnlace = enlace.value.trim() !== "";
      var mensaje = "";

      if (!hayArchivo && !hayEnlace) {
        mensaje = "Sube el archivo o pega el enlace del modelo.";
      } else if (hayArchivo && archivo.files[0].size > MAX_BYTES) {
        mensaje = "El archivo pesa más de 50 MB.";
      }
      archivo.setCustomValidity(mensaje);
    }

    archivo.addEventListener("change", revisarArchivoOEnlace);
    enlace.addEventListener("input", revisarArchivoOEnlace);
    revisarArchivoOEnlace();

    function valor(nombre) {
      var campo = form.elements[nombre];
      return campo ? String(campo.value).trim() : "";
    }

    function textoSolicitud() {
      var lineas = ["Hola, quiero cotizar una pieza."];
      lineas.push("Nombre: " + valor("nombre"));
      lineas.push("WhatsApp: " + valor("whatsapp"));
      lineas.push("Correo: " + valor("correo"));
      if (archivo.files.length) lineas.push("Archivo: " + archivo.files[0].name + " (lo adjunto en este chat)");
      if (valor("enlace")) lineas.push("Enlace del modelo: " + valor("enlace"));
      lineas.push("Origen del archivo: " + valor("origen"));
      lineas.push("Licencia: " + valor("licencia"));
      lineas.push("Cantidad: " + valor("cantidad"));
      if (valor("fecha")) lineas.push("Para cuándo: " + valor("fecha"));
      if (valor("color")) lineas.push("Color o material: " + valor("color"));
      lineas.push("Para qué es: " + valor("uso"));
      lineas.push("Confirmo que tengo derecho a usar este archivo y acepto las condiciones.");
      return lineas.join("\n");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      revisarArchivoOEnlace();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      /* La solicitud llega por WhatsApp, que es donde ITO 3D responde la cotización.
         Un enlace de WhatsApp no puede llevar el archivo: la persona lo adjunta en el chat.
         TODO: guardar también cada solicitud en correo y hoja de cálculo (ver README). */
      var url = waLink(textoSolicitud());
      window.open(url, "_blank", "noopener");

      estado.textContent = "";
      var msg = archivo.files.length
        ? "Se abrió WhatsApp con tu solicitud. Adjunta el archivo en el chat y envíalo. "
        : "Se abrió WhatsApp con tu solicitud. Envíala desde el chat. ";
      estado.appendChild(document.createTextNode(msg));
      estado.appendChild(document.createTextNode("¿No se abrió? "));
      var a = crear("a", "", "Toca aquí para abrir WhatsApp");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
      estado.appendChild(a);
    });
  }

  /* Inicio -------------------------------------------------------------- */

  setupWhatsAppLinks();
  setupMenu();
  setupVentanas();
  setupCatalogo();
  setupCarrito();
  setupPrecios();
  setupProduct();
  setupQuoteForm();
})();
