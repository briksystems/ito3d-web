/* ==========================================================================
   ITO 3D · Comportamiento de todas las páginas
   Cada bloque revisa si su elemento existe, así el mismo archivo sirve
   para index.html, producto.html y cotiza.html.
   ========================================================================== */

(function () {
  "use strict";

  /* CAMBIAR: número de WhatsApp Business con código de país, sin + ni espacios.
     Ejemplo: "573001234567" */
  var WHATSAPP_NUMBER = "573142155358";

  // Marca la página como "con JS" para que el menú del celular arranque cerrado
  document.documentElement.classList.add("js");

  /* 1. Enlaces de WhatsApp --------------------------------------------- */
  function waLink(text) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
  }

  function setupWhatsAppLinks() {
    document.querySelectorAll("a[data-wa]").forEach(function (a) {
      var text = a.getAttribute("data-wa-text");
      if (text) {
        a.href = waLink(text);
      }
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  /* 2. Menú del celular ------------------------------------------------- */
  function setupMenu() {
    var toggle = document.querySelector(".menu-toggle");
    var menu = document.getElementById("menu-principal");
    if (!toggle || !menu) return;

    function setOpen(open) {
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
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

  /* 3. Ficha de producto ------------------------------------------------ */
  function setupProduct() {
    var nombre = document.getElementById("producto-nombre");
    if (!nombre) return;

    var colorLabel = document.getElementById("color-elegido");
    var personal = document.getElementById("personalizacion");
    var pedir = document.getElementById("pedir-wa");

    function colorActual() {
      var checked = document.querySelector('input[name="color"]:checked');
      return checked ? checked.value : "";
    }

    function actualizarWhatsApp() {
      var color = colorActual();
      if (colorLabel) colorLabel.textContent = color;

      var texto = "Hola, quiero pedir: " + nombre.textContent.trim();
      if (color) texto += ", color " + color;
      if (personal && personal.value.trim()) {
        texto += ", personalizado con \"" + personal.value.trim() + "\"";
      }
      texto += ". " + window.location.href;

      if (pedir) pedir.href = waLink(texto);
    }

    document.querySelectorAll('input[name="color"]').forEach(function (r) {
      r.addEventListener("change", actualizarWhatsApp);
    });
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

    // TODO versión 2: conectar con el carrito
    var carrito = document.getElementById("agregar-carrito");
    if (carrito) {
      carrito.addEventListener("click", function () {
        var aviso = document.getElementById("carrito-estado");
        if (aviso) aviso.textContent = "El carrito se activa pronto. Por ahora usa Pedir por WhatsApp.";
      });
    }
  }

  /* 4. Formulario Cotiza tu diseño -------------------------------------- */
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

    form.addEventListener("submit", function (e) {
      revisarArchivoOEnlace();
      if (!form.checkValidity()) return; // el navegador muestra el campo con error

      e.preventDefault();
      /* TODO: enviar el formulario a correo y a la hoja de cálculo (ver README).
         Mientras tanto no se envía nada y se avisa con claridad. */
      estado.textContent = "Formulario listo, pero el envío aún no está conectado.";
    });
  }

  setupWhatsAppLinks();
  setupMenu();
  setupProduct();
  setupQuoteForm();
})();
