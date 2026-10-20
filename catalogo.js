/* ==========================================================================
   ITO 3D · Catálogo de productos
   AQUÍ se cambian los productos, precios, colores y textos del sitio.
   El carrito, la ventana de catálogo y la ficha de producto leen este archivo.

   Cómo editar:
   - precio: número en pesos, sin puntos. Ejemplo: 45000. Con null se muestra [PRECIO].
   - colores: nombres que existan en el sitio: Carbón, Hueso, Arena, Bermellón, Gris.
   - dias: días hábiles de fabricación. Con null se muestra [X].
   - Los productos de abajo son los de la maqueta. Cambia nombres y textos por los reales.
   ========================================================================== */

window.ITO_CATALOGO = {
  categorias: [
    { id: "casa", nombre: "Casa", frase: "Bandejas, posavasos y organizadores para tu casa." },
    { id: "floreros", nombre: "Floreros", frase: "Piezas decorativas, capa a capa." },
    { id: "gaming", nombre: "Gaming", frase: "Soportes para audífonos y controles." },
    { id: "tech", nombre: "Tech", frase: "Cables, celular y portátil en orden." }
  ],

  productos: [
    {
      id: "bandeja-organizadora",
      categoria: "casa",
      nombre: "Bandeja organizadora",
      precio: null,
      descripcion: "Un lugar fijo para llaves, billetera y audífonos a la entrada de la casa.",
      colores: ["Carbón", "Hueso", "Arena", "Bermellón"],
      personalizable: true,
      extraPersonalizacion: null,
      dias: null,
      medidas: null,
      material: "Plástico de origen vegetal, liviano y resistente"
    },
    {
      id: "posavasos-x4",
      categoria: "casa",
      nombre: "Posavasos, juego de 4",
      precio: null,
      descripcion: null,
      colores: ["Carbón", "Hueso"],
      personalizable: false,
      dias: null,
      medidas: null,
      material: null
    },
    {
      id: "organizador-cajon",
      categoria: "casa",
      nombre: "Organizador de cajón",
      precio: null,
      descripcion: null,
      colores: ["Carbón", "Hueso"],
      personalizable: false,
      dias: null,
      medidas: null,
      material: null
    },

    {
      id: "florero-espiral-alto",
      categoria: "floreros",
      nombre: "Florero espiral alto",
      precio: null,
      descripcion: "Se imprime en una sola línea continua que sube en espiral.",
      colores: ["Hueso", "Arena"],
      personalizable: false,
      dias: null,
      medidas: null,
      material: null
    },
    {
      id: "florero-bajo",
      categoria: "floreros",
      nombre: "Florero bajo",
      precio: null,
      descripcion: null,
      colores: ["Hueso", "Arena"],
      personalizable: false,
      dias: null,
      medidas: null,
      material: null
    },
    {
      id: "florero-espiral-mediano",
      categoria: "floreros",
      nombre: "Florero espiral mediano",
      precio: null,
      descripcion: null,
      colores: ["Hueso", "Arena"],
      personalizable: false,
      dias: null,
      medidas: null,
      material: null
    },

    {
      id: "soporte-audifonos",
      categoria: "gaming",
      nombre: "Soporte para audífonos",
      precio: null,
      descripcion: null,
      colores: ["Carbón", "Hueso"],
      personalizable: true,
      extraPersonalizacion: null,
      dias: null,
      medidas: null,
      material: null
    },
    {
      id: "soporte-control",
      categoria: "gaming",
      nombre: "Soporte para control",
      precio: null,
      descripcion: null,
      colores: ["Carbón", "Hueso"],
      personalizable: false,
      dias: null,
      medidas: null,
      material: null
    },
    {
      id: "organizador-setup",
      categoria: "gaming",
      nombre: "Organizador de setup",
      precio: null,
      descripcion: null,
      colores: ["Carbón", "Hueso"],
      personalizable: false,
      dias: null,
      medidas: null,
      material: null
    },

    {
      id: "caja-cables",
      categoria: "tech",
      nombre: "Caja para cables",
      precio: null,
      descripcion: null,
      colores: ["Carbón", "Gris"],
      personalizable: false,
      dias: null,
      medidas: null,
      material: null
    },
    {
      id: "enrollador-cables",
      categoria: "tech",
      nombre: "Enrollador de cables",
      precio: null,
      descripcion: null,
      colores: ["Carbón", "Hueso"],
      personalizable: false,
      dias: null,
      medidas: null,
      material: null
    },
    {
      id: "soporte-iphone",
      categoria: "tech",
      nombre: "Soporte para iPhone",
      precio: null,
      descripcion: null,
      colores: ["Carbón", "Hueso"],
      personalizable: false,
      dias: null,
      medidas: null,
      material: null
    }
  ]
};
