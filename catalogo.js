/* ==========================================================================
   ITO 3D · Catálogo de productos
   AQUÍ se cambian los productos, precios, colores y textos del sitio.
   La ventana de tienda, el carrito y la ficha de producto leen este archivo.

   OJO: todos los productos de abajo son de EJEMPLO (ejemplo: true).
   Los nombres, precios y medidas son inventados para probar la tienda.
   Antes de publicar: borra los que no sean reales y cambia el resto.
   Los productos con ejemplo: true muestran una etiqueta "Ejemplo" en el sitio.
   Al poner los reales, quita esa línea o pon ejemplo: false.

   Campos de cada producto:
   - id          nombre corto sin espacios ni tildes (sale en el enlace de la ficha)
   - categoria   casa, floreros, gaming o tech
   - precio      número en pesos, sin puntos. Con null se muestra [PRECIO]
   - medidas     [ancho, largo, alto] en cm. De ahí sale el tamaño del filtro
   - material    estandar, calor o flexible (ver la lista de materiales)
   - colores     Carbón, Hueso, Arena, Bermellón o Gris
   - dias        días hábiles de fabricación
   - destacado   true para que salga primero en "Destacados"
   - creado      fecha AAAA-MM-DD, para ordenar por "Más nuevos"
   ========================================================================== */

window.ITO_CATALOGO = {
  categorias: [
    { id: "casa", nombre: "Casa", frase: "Bandejas, posavasos y organizadores para tu casa." },
    { id: "floreros", nombre: "Floreros", frase: "Piezas decorativas, capa a capa." },
    { id: "gaming", nombre: "Gaming", frase: "Soportes para audífonos y controles." },
    { id: "tech", nombre: "Tech", frase: "Cables, celular y portátil en orden." }
  ],

  /* Materiales con nombre claro para el cliente. Entre paréntesis va el nombre técnico. */
  materiales: [
    { id: "estandar", nombre: "Estándar (PLA)", detalle: "Plástico de origen vegetal, liviano y resistente" },
    { id: "calor", nombre: "Resistente al calor (PETG)", detalle: "Más resistente al calor y a los golpes" },
    { id: "flexible", nombre: "Flexible (TPU)", detalle: "Flexible, con algo de elasticidad" }
  ],

  /* El tamaño se calcula con la medida más larga: pequeño hasta 12 cm, mediano hasta 25 cm, grande más de eso */
  tamanos: [
    { id: "pequeno", nombre: "Pequeño", detalle: "hasta 12 cm", hasta: 12 },
    { id: "mediano", nombre: "Mediano", detalle: "12 a 25 cm", hasta: 25 },
    { id: "grande", nombre: "Grande", detalle: "más de 25 cm", hasta: 9999 }
  ],

  productos: [
    /* ---- CASA ---- */
    { id: "bandeja-organizadora", categoria: "casa", nombre: "Bandeja organizadora", precio: 38000,
      descripcion: "Un lugar fijo para llaves, billetera y audífonos a la entrada de la casa.",
      medidas: [24, 16, 3], material: "estandar", colores: ["Carbón", "Hueso", "Arena", "Bermellón"],
      personalizable: true, extraPersonalizacion: 8000, dias: 3, destacado: true, creado: "2026-10-01", ejemplo: true },
    { id: "posavasos-x4", categoria: "casa", nombre: "Posavasos, juego de 4", precio: 28000,
      descripcion: "Cuatro posavasos que aguantan la taza caliente.",
      medidas: [10, 10, 1], material: "calor", colores: ["Carbón", "Hueso"],
      personalizable: false, dias: 2, creado: "2026-09-20", ejemplo: true },
    { id: "organizador-cajon", categoria: "casa", nombre: "Organizador de cajón", precio: 34000,
      descripcion: "Divide el cajón en espacios para que cada cosa tenga su lugar.",
      medidas: [30, 12, 5], material: "estandar", colores: ["Carbón", "Hueso"],
      personalizable: false, dias: 3, creado: "2026-09-12", ejemplo: true },
    { id: "caja-multiuso", categoria: "casa", nombre: "Caja multiuso con tapa", precio: 45000,
      descripcion: "Para guardar lo pequeño: cargadores, botones, papeles.",
      medidas: [18, 18, 10], material: "estandar", colores: ["Hueso", "Arena", "Carbón"],
      personalizable: true, extraPersonalizacion: 8000, dias: 4, creado: "2026-10-12", ejemplo: true },
    { id: "percha-llaves", categoria: "casa", nombre: "Percha de llaves", precio: 26000,
      descripcion: "Se pega a la pared. Cuatro ganchos para llaves y correas.",
      medidas: [14, 6, 2], material: "estandar", colores: ["Carbón", "Hueso", "Bermellón"],
      personalizable: true, extraPersonalizacion: 6000, dias: 2, creado: "2026-10-10", ejemplo: true },
    { id: "portavelas-geometrico", categoria: "casa", nombre: "Portavelas geométrico", precio: 32000,
      descripcion: "Para velas de té. La luz sale por las ranuras.",
      medidas: [9, 9, 8], material: "calor", colores: ["Hueso", "Arena"],
      personalizable: false, dias: 2, creado: "2026-10-15", ejemplo: true },

    /* ---- FLOREROS ---- */
    { id: "florero-espiral-alto", categoria: "floreros", nombre: "Florero espiral alto", precio: 89000,
      descripcion: "Se imprime en una sola línea continua que sube en espiral.",
      medidas: [12, 12, 28], material: "estandar", colores: ["Hueso", "Arena"],
      personalizable: false, dias: 5, destacado: true, creado: "2026-10-05", ejemplo: true },
    { id: "florero-bajo", categoria: "floreros", nombre: "Florero bajo", precio: 59000,
      descripcion: "Para flores cortas o ramas secas sobre la mesa.",
      medidas: [14, 14, 14], material: "estandar", colores: ["Hueso", "Arena"],
      personalizable: false, dias: 4, creado: "2026-09-25", ejemplo: true },
    { id: "florero-espiral-mediano", categoria: "floreros", nombre: "Florero espiral mediano", precio: 72000,
      descripcion: "El mismo trazo en espiral, en tamaño de escritorio.",
      medidas: [12, 12, 20], material: "estandar", colores: ["Hueso", "Arena", "Carbón"],
      personalizable: false, dias: 4, creado: "2026-09-28", ejemplo: true },
    { id: "florero-ondas", categoria: "floreros", nombre: "Florero ondas", precio: 64000,
      descripcion: "Paredes con ondas suaves que atrapan la luz.",
      medidas: [13, 13, 18], material: "estandar", colores: ["Hueso", "Bermellón"],
      personalizable: false, dias: 4, creado: "2026-10-14", ejemplo: true },
    { id: "jarron-grande", categoria: "floreros", nombre: "Jarrón grande de piso", precio: 145000,
      descripcion: "Para ramas altas. Una pieza que se nota desde la puerta.",
      medidas: [20, 20, 38], material: "estandar", colores: ["Hueso", "Carbón"],
      personalizable: false, dias: 7, creado: "2026-10-08", ejemplo: true },

    /* ---- GAMING ---- */
    { id: "soporte-audifonos", categoria: "gaming", nombre: "Soporte para audífonos", precio: 42000,
      descripcion: "Cuelga los audífonos del escritorio y libera espacio.",
      medidas: [10, 14, 24], material: "estandar", colores: ["Carbón", "Hueso", "Bermellón"],
      personalizable: true, extraPersonalizacion: 8000, dias: 3, destacado: true, creado: "2026-10-03", ejemplo: true },
    { id: "soporte-control", categoria: "gaming", nombre: "Soporte para control", precio: 36000,
      descripcion: "Deja el control a la mano y sin enredar el cable.",
      medidas: [12, 12, 14], material: "estandar", colores: ["Carbón", "Hueso"],
      personalizable: false, dias: 3, creado: "2026-09-30", ejemplo: true },
    { id: "soporte-doble-control", categoria: "gaming", nombre: "Soporte doble para controles", precio: 58000,
      descripcion: "Dos controles juntos, listos para jugar.",
      medidas: [22, 12, 14], material: "estandar", colores: ["Carbón", "Hueso"],
      personalizable: false, dias: 4, creado: "2026-10-11", ejemplo: true },
    { id: "organizador-setup", categoria: "gaming", nombre: "Organizador de setup", precio: 52000,
      descripcion: "Bandeja para el escritorio: control, cables y audífonos.",
      medidas: [35, 14, 6], material: "estandar", colores: ["Carbón", "Gris"],
      personalizable: false, dias: 4, creado: "2026-09-18", ejemplo: true },
    { id: "base-vertical-consola", categoria: "gaming", nombre: "Base vertical para consola", precio: 78000,
      descripcion: "Pone la consola de pie y deja pasar el aire.",
      medidas: [30, 10, 28], material: "calor", colores: ["Carbón", "Hueso"],
      personalizable: false, dias: 5, creado: "2026-10-16", ejemplo: true },

    /* ---- TECH ---- */
    { id: "caja-cables", categoria: "tech", nombre: "Caja para cables", precio: 44000,
      descripcion: "Esconde la regleta y los cables debajo del escritorio.",
      medidas: [28, 12, 12], material: "estandar", colores: ["Carbón", "Gris", "Hueso"],
      personalizable: false, dias: 4, destacado: true, creado: "2026-10-02", ejemplo: true },
    { id: "enrollador-cables", categoria: "tech", nombre: "Enrollador de cables", precio: 18000,
      descripcion: "Enrolla el cargador y viaja sin nudos.",
      medidas: [6, 6, 3], material: "flexible", colores: ["Carbón", "Hueso", "Bermellón"],
      personalizable: false, dias: 2, creado: "2026-09-15", ejemplo: true },
    { id: "soporte-iphone", categoria: "tech", nombre: "Soporte para iPhone", precio: 24000,
      descripcion: "Apoya el celular en ángulo, para ver o cargar.",
      medidas: [8, 8, 10], material: "calor", colores: ["Carbón", "Hueso"],
      personalizable: false, dias: 2, creado: "2026-10-06", ejemplo: true },
    { id: "soporte-portatil", categoria: "tech", nombre: "Soporte vertical para portátil", precio: 69000,
      descripcion: "Guarda el portátil de pie y libera el escritorio.",
      medidas: [28, 22, 8], material: "calor", colores: ["Carbón", "Gris"],
      personalizable: false, dias: 5, creado: "2026-10-13", ejemplo: true },
    { id: "clips-cables", categoria: "tech", nombre: "Clips para cables, pack de 6", precio: 15000,
      descripcion: "Sujetan los cables al borde de la mesa.",
      medidas: [4, 4, 2], material: "flexible", colores: ["Carbón", "Hueso"],
      personalizable: false, dias: 2, creado: "2026-10-17", ejemplo: true }
  ]
};
