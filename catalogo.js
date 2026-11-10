/* ==========================================================================
   ITO 3D · Catálogo de productos
   AQUÍ se cambian los productos, precios, colores y textos del sitio.
   La ventana de tienda, el carrito y la ficha de producto leen este archivo.

   Productos reales de ITO 3D (9 nov 2026). Medidas tomadas de los modelos 3D.
   PENDIENTE: precio y dias. Mientras sean null, el sitio muestra
   "Precio a consultar" y "Tiempo de fabricación a confirmar".

   Campos de cada producto:
   - id          nombre corto sin espacios ni tildes (sale en el enlace de la ficha)
   - categoria   casa, floreros, gaming o tech
   - precio      número en pesos, sin puntos. Con null se muestra [PRECIO]
   - medidas     [ancho, largo, alto] en cm. De ahí sale el tamaño del filtro
   - material    estandar, calor o flexible (ver la lista de materiales)
   - colores     Carbón, Hueso, Arena, Bermellón, Gris o Salvia
   - fotos       rutas de la galería en orden: solo, ambiente/uso, dimensiones, detalle, en mano
   - dias        días hábiles de fabricación
   - destacado   true para que salga primero en "Destacados"
   - creado      fecha AAAA-MM-DD, para ordenar por "Más nuevos"
   ========================================================================== */

window.ITO_CATALOGO = {
  categorias: [
    { id: "casa", nombre: "Casa", frase: "Bandejas, posavasos y organizadores para tu casa." },
    { id: "floreros", nombre: "Floreros", frase: "Piezas decorativas, capa a capa." },
    { id: "gaming", nombre: "Gaming", frase: "Soportes para controles y audífonos, y orden para tus juegos." },
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
    { id: "florero-hilo-alto", categoria: "floreros", nombre: "Florero Hilo alto", precio: null,
      descripcion: "Florero acanalado de silueta curva, con franja lisa y el sello 糸 en la base.",
      medidas: [12.1, 12.1, 24.1], material: "estandar", colores: ["Hueso", "Salvia", "Carbón"],
      personalizable: false, dias: null, destacado: true, creado: "2026-11-09",
      fotos: ["img/productos/florero-hilo-alto/florero-hilo-alto_1_solo.webp", "img/productos/florero-hilo-alto/florero-hilo-alto_colores.webp", "img/productos/florero-hilo-alto/florero-hilo-alto_2_ambiente.webp", "img/productos/florero-hilo-alto/florero-hilo-alto_3_dimensiones.webp", "img/productos/florero-hilo-alto/florero-hilo-alto_4_detalle.webp", "img/productos/florero-hilo-alto/florero-hilo-alto_5_en-mano.webp"] },
    { id: "florero-hilo-medio", categoria: "floreros", nombre: "Florero Hilo medio", precio: null,
      descripcion: "Costillas en giro que acompañan la forma de huevo. Para ramas secas o flores frescas.",
      medidas: [13.5, 13.5, 20.1], material: "estandar", colores: ["Salvia", "Hueso", "Arena"],
      personalizable: false, dias: null, creado: "2026-11-09",
      fotos: ["img/productos/florero-hilo-medio/florero-hilo-medio_1_solo.webp", "img/productos/florero-hilo-medio/florero-hilo-medio_colores.webp", "img/productos/florero-hilo-medio/florero-hilo-medio_2_ambiente.webp", "img/productos/florero-hilo-medio/florero-hilo-medio_3_dimensiones.webp", "img/productos/florero-hilo-medio/florero-hilo-medio_4_detalle.webp", "img/productos/florero-hilo-medio/florero-hilo-medio_5_en-mano.webp"] },
    { id: "florero-hilo-bajo", categoria: "floreros", nombre: "Florero Hilo bajo", precio: null,
      descripcion: "Florero ancho y bajo para la mesa del comedor, con franja de color en la base.",
      medidas: [14.4, 14.4, 16.1], material: "estandar", colores: ["Carbón", "Hueso"],
      personalizable: false, dias: null, creado: "2026-11-09",
      fotos: ["img/productos/florero-hilo-bajo/florero-hilo-bajo_1_solo.webp", "img/productos/florero-hilo-bajo/florero-hilo-bajo_colores.webp", "img/productos/florero-hilo-bajo/florero-hilo-bajo_2_ambiente.webp", "img/productos/florero-hilo-bajo/florero-hilo-bajo_3_dimensiones.webp", "img/productos/florero-hilo-bajo/florero-hilo-bajo_4_detalle.webp", "img/productos/florero-hilo-bajo/florero-hilo-bajo_5_en-mano.webp"] },
    { id: "trio-mini", categoria: "floreros", nombre: "Trío de floreros mini", precio: null,
      descripcion: "Tres floreros pequeños, liso, acanalado y torcido, para una flor o una rama cada uno. Alturas de 9,1, 7,6 y 6,1 cm.",
      medidas: [6, 6, 9.1], material: "estandar", colores: ["Hueso", "Salvia", "Arena"],
      personalizable: false, dias: null, destacado: true, creado: "2026-11-09",
      fotos: ["img/productos/trio-mini/trio-mini_1_solo.webp", "img/productos/trio-mini/trio-mini_colores.webp", "img/productos/trio-mini/trio-mini_2_ambiente.webp", "img/productos/trio-mini/trio-mini_3_dimensiones.webp", "img/productos/trio-mini/trio-mini_4_detalle.webp", "img/productos/trio-mini/trio-mini_5_en-mano.webp"] },
    { id: "florero-propagacion", categoria: "floreros", nombre: "Florero de propagación", precio: null,
      descripcion: "Base acanalada con tubo de ensayo para enraizar esquejes en agua.",
      medidas: [8.3, 8.3, 8.5], material: "estandar", colores: ["Hueso", "Salvia"],
      personalizable: false, dias: null, creado: "2026-11-09",
      fotos: ["img/productos/florero-propagacion/florero-propagacion_1_solo.webp", "img/productos/florero-propagacion/florero-propagacion_colores.webp", "img/productos/florero-propagacion/florero-propagacion_2_ambiente.webp", "img/productos/florero-propagacion/florero-propagacion_3_dimensiones.webp", "img/productos/florero-propagacion/florero-propagacion_4_detalle.webp", "img/productos/florero-propagacion/florero-propagacion_5_en-mano.webp"] },
    { id: "maceta-hilo", categoria: "casa", nombre: "Maceta Hilo con plato", precio: null,
      descripcion: "Maceta acanalada con su plato para recoger el agua.",
      medidas: [12.7, 12.7, 11.6], material: "estandar", colores: ["Salvia", "Hueso", "Carbón"],
      personalizable: false, dias: null, creado: "2026-11-09",
      fotos: ["img/productos/maceta-hilo/maceta-hilo_1_solo.webp", "img/productos/maceta-hilo/maceta-hilo_colores.webp", "img/productos/maceta-hilo/maceta-hilo_2_ambiente.webp", "img/productos/maceta-hilo/maceta-hilo_3_dimensiones.webp", "img/productos/maceta-hilo/maceta-hilo_4_detalle.webp", "img/productos/maceta-hilo/maceta-hilo_5_en-mano.webp"] },
    { id: "bandeja-tocador", categoria: "casa", nombre: "Bandeja tocador", precio: null,
      descripcion: "Bandeja ovalada para anillos, cadenas y aretes.",
      medidas: [14.3, 9.3, 1.7], material: "estandar", colores: ["Arena", "Hueso"],
      personalizable: false, dias: null, creado: "2026-11-09",
      fotos: ["img/productos/bandeja-tocador/bandeja-tocador_1_solo.webp", "img/productos/bandeja-tocador/bandeja-tocador_colores.webp", "img/productos/bandeja-tocador/bandeja-tocador_2_ambiente.webp", "img/productos/bandeja-tocador/bandeja-tocador_3_dimensiones.webp", "img/productos/bandeja-tocador/bandeja-tocador_4_detalle.webp", "img/productos/bandeja-tocador/bandeja-tocador_5_en-mano.webp"] },
    { id: "bandeja-entrada", categoria: "casa", nombre: "Bandeja de entrada", precio: null,
      descripcion: "Un lugar fijo para llaves, billetera y gafas a la entrada de la casa.",
      medidas: [20, 12, 1.8], material: "estandar", colores: ["Hueso", "Carbón", "Arena"],
      personalizable: false, dias: null, destacado: true, creado: "2026-11-09",
      fotos: ["img/productos/bandeja-entrada/bandeja-entrada_1_solo.webp", "img/productos/bandeja-entrada/bandeja-entrada_colores.webp", "img/productos/bandeja-entrada/bandeja-entrada_2_uso.webp", "img/productos/bandeja-entrada/bandeja-entrada_3_dimensiones.webp", "img/productos/bandeja-entrada/bandeja-entrada_4_detalle.webp", "img/productos/bandeja-entrada/bandeja-entrada_5_en-mano.webp"] },
    { id: "portallaves", categoria: "casa", nombre: "Portallaves de pared", precio: null,
      descripcion: "Cuatro ganchos para llaves y una repisa para cartas y gafas.",
      medidas: [20, 5.2, 10.8], material: "estandar", colores: ["Carbón", "Hueso"],
      personalizable: false, dias: null, creado: "2026-11-09",
      fotos: ["img/productos/portallaves/portallaves_1_solo.webp", "img/productos/portallaves/portallaves_colores.webp", "img/productos/portallaves/portallaves_2_uso.webp", "img/productos/portallaves/portallaves_3_dimensiones.webp", "img/productos/portallaves/portallaves_4_detalle.webp", "img/productos/portallaves/portallaves_5_en-mano.webp"] },
    { id: "posavasos-asanoha", categoria: "casa", nombre: "Posavasos asanoha, juego de 4", precio: null,
      descripcion: "Posavasos con el patrón japonés asanoha calado, con soporte para guardarlos.",
      medidas: [10, 10, 0.4], material: "estandar", colores: ["Carbón", "Hueso"],
      personalizable: false, dias: null, creado: "2026-11-09",
      fotos: ["img/productos/posavasos-asanoha/posavasos-asanoha_1_solo.webp", "img/productos/posavasos-asanoha/posavasos-asanoha_colores.webp", "img/productos/posavasos-asanoha/posavasos-asanoha_2_uso.webp", "img/productos/posavasos-asanoha/posavasos-asanoha_3_dimensiones.webp", "img/productos/posavasos-asanoha/posavasos-asanoha_4_detalle.webp", "img/productos/posavasos-asanoha/posavasos-asanoha_5_en-mano.webp"] },
    { id: "organizadores-gridfinity", categoria: "casa", nombre: "Organizadores de cajón (gridfinity)", precio: null,
      descripcion: "Contenedores modulares para ordenar cajones de escritorio y taller. Tres tamaños.",
      medidas: [8.4, 8.4, 4.2], material: "estandar", colores: ["Hueso", "Arena", "Salvia"],
      personalizable: false, dias: null, creado: "2026-11-09",
      fotos: ["img/productos/organizadores-gridfinity/organizadores-gridfinity_1_solo.webp", "img/productos/organizadores-gridfinity/organizadores-gridfinity_colores.webp", "img/productos/organizadores-gridfinity/organizadores-gridfinity_2_uso.webp", "img/productos/organizadores-gridfinity/organizadores-gridfinity_3_dimensiones.webp", "img/productos/organizadores-gridfinity/organizadores-gridfinity_4_detalle.webp", "img/productos/organizadores-gridfinity/organizadores-gridfinity_5_en-mano.webp"] },
    { id: "tablero-perforado", categoria: "casa", nombre: "Tablero perforado con accesorios", precio: null,
      descripcion: "Tablero de 24 × 24 cm con repisa, caja, ganchos y soporte para audífonos.",
      medidas: [24, 9.7, 24], material: "estandar", colores: ["Hueso"],
      personalizable: false, dias: null, creado: "2026-11-09",
      fotos: ["img/productos/tablero-perforado/tablero-perforado_1_solo.webp", "img/productos/tablero-perforado/tablero-perforado_2_uso.webp", "img/productos/tablero-perforado/tablero-perforado_3_dimensiones.webp", "img/productos/tablero-perforado/tablero-perforado_4_detalle.webp", "img/productos/tablero-perforado/tablero-perforado_5_en-mano.webp"] },
    { id: "soporte-audifonos", categoria: "gaming", nombre: "Soporte para audífonos", precio: null,
      descripcion: "Soporte de escritorio con base acanalada para audífonos de diadema.",
      medidas: [15, 10, 25], material: "estandar", colores: ["Carbón", "Hueso"],
      personalizable: false, dias: null, destacado: true, creado: "2026-11-09",
      fotos: ["img/productos/soporte-audifonos/soporte-audifonos_1_solo.webp", "img/productos/soporte-audifonos/soporte-audifonos_colores.webp", "img/productos/soporte-audifonos/soporte-audifonos_2_uso.webp", "img/productos/soporte-audifonos/soporte-audifonos_3_dimensiones.webp", "img/productos/soporte-audifonos/soporte-audifonos_4_detalle.webp", "img/productos/soporte-audifonos/soporte-audifonos_5_en-mano.webp"] },
    { id: "soporte-control", categoria: "gaming", nombre: "Soporte para control", precio: null,
      descripcion: "Soporte inclinado para controles de PS5, Xbox o Switch Pro. Base acanalada y paso redondeado para el cable de carga.",
      medidas: [13, 8.4, 7.9], material: "estandar", colores: ["Carbón", "Hueso", "Gris"],
      personalizable: false, dias: null, destacado: true, creado: "2026-11-10",
      fotos: ["img/productos/soporte-control/soporte-control_1_solo.webp", "img/productos/soporte-control/soporte-control_colores.webp", "img/productos/soporte-control/soporte-control_2_uso.webp", "img/productos/soporte-control/soporte-control_3_dimensiones.webp", "img/productos/soporte-control/soporte-control_4_detalle.webp", "img/productos/soporte-control/soporte-control_5_en-mano.webp"] },
    { id: "soporte-control-panal", categoria: "gaming", nombre: "Soporte para control Panal", precio: null,
      descripcion: "Placa inclinada con patrón de panal y base acanalada. Para controles de PS5, Xbox o Switch Pro.",
      medidas: [13.2, 8.5, 8.6], material: "estandar", colores: ["Carbón", "Hueso", "Bermellón"],
      personalizable: false, dias: null, creado: "2026-11-10",
      fotos: ["img/productos/soporte-control-panal/soporte-control-panal_1_solo.webp", "img/productos/soporte-control-panal/soporte-control-panal_colores.webp", "img/productos/soporte-control-panal/soporte-control-panal_2_uso.webp", "img/productos/soporte-control-panal/soporte-control-panal_3_dimensiones.webp", "img/productos/soporte-control-panal/soporte-control-panal_4_detalle.webp", "img/productos/soporte-control-panal/soporte-control-panal_5_en-mano.webp"] },
    { id: "soporte-control-aleta", categoria: "gaming", nombre: "Soporte para control Aleta", precio: null,
      descripcion: "Minimalista: el control queda de pie, con las empuñaduras a cada lado de una aleta central.",
      medidas: [9.6, 6.4, 10.9], material: "estandar", colores: ["Carbón", "Hueso", "Salvia"],
      personalizable: false, dias: null, creado: "2026-11-10",
      fotos: ["img/productos/soporte-control-aleta/soporte-control-aleta_1_solo.webp", "img/productos/soporte-control-aleta/soporte-control-aleta_colores.webp", "img/productos/soporte-control-aleta/soporte-control-aleta_2_uso.webp", "img/productos/soporte-control-aleta/soporte-control-aleta_3_dimensiones.webp", "img/productos/soporte-control-aleta/soporte-control-aleta_4_detalle.webp", "img/productos/soporte-control-aleta/soporte-control-aleta_5_en-mano.webp"] },
    { id: "soporte-control-organico", categoria: "gaming", nombre: "Soporte para control Orgánico", precio: null,
      descripcion: "Una sola forma fluida que sube desde la base y sostiene el control de pie.",
      medidas: [8.9, 6.9, 11.1], material: "estandar", colores: ["Hueso", "Carbón", "Arena"],
      personalizable: false, dias: null, creado: "2026-11-10",
      fotos: ["img/productos/soporte-control-organico/soporte-control-organico_1_solo.webp", "img/productos/soporte-control-organico/soporte-control-organico_colores.webp", "img/productos/soporte-control-organico/soporte-control-organico_2_uso.webp", "img/productos/soporte-control-organico/soporte-control-organico_3_dimensiones.webp", "img/productos/soporte-control-organico/soporte-control-organico_4_detalle.webp", "img/productos/soporte-control-organico/soporte-control-organico_5_en-mano.webp"] },
    { id: "soporte-control-doble", categoria: "gaming", nombre: "Soporte doble para controles", precio: null,
      descripcion: "Dos controles lado a lado, listos para cargar. Para PS5, Xbox o Switch Pro.",
      medidas: [24.2, 8.4, 7.7], material: "estandar", colores: ["Carbón", "Hueso"],
      personalizable: false, dias: null, creado: "2026-11-10",
      fotos: ["img/productos/soporte-control-doble/soporte-control-doble_1_solo.webp", "img/productos/soporte-control-doble/soporte-control-doble_colores.webp", "img/productos/soporte-control-doble/soporte-control-doble_2_uso.webp", "img/productos/soporte-control-doble/soporte-control-doble_3_dimensiones.webp", "img/productos/soporte-control-doble/soporte-control-doble_4_detalle.webp", "img/productos/soporte-control-doble/soporte-control-doble_5_en-mano.webp"] },
    { id: "organizador-cartuchos", categoria: "gaming", nombre: "Organizador de cartuchos Switch", precio: null,
      descripcion: "Guarda 16 cartuchos de Nintendo Switch en gradas, a la vista y en orden.",
      medidas: [5.8, 6.8, 3.2], material: "estandar", colores: ["Carbón", "Hueso", "Bermellón"],
      personalizable: false, dias: null, creado: "2026-11-10",
      fotos: ["img/productos/organizador-cartuchos/organizador-cartuchos_1_solo.webp", "img/productos/organizador-cartuchos/organizador-cartuchos_colores.webp", "img/productos/organizador-cartuchos/organizador-cartuchos_2_uso.webp", "img/productos/organizador-cartuchos/organizador-cartuchos_3_dimensiones.webp", "img/productos/organizador-cartuchos/organizador-cartuchos_4_detalle.webp", "img/productos/organizador-cartuchos/organizador-cartuchos_5_en-mano.webp"] },
    { id: "organizador-estuches", categoria: "gaming", nombre: "Organizador de estuches de juegos", precio: null,
      descripcion: "Estante para 6 estuches de PS5, Xbox o Switch, con laterales curvos acanalados.",
      medidas: [10.1, 8.2, 10.4], material: "estandar", colores: ["Carbón", "Hueso", "Gris"],
      personalizable: false, dias: null, creado: "2026-11-10",
      fotos: ["img/productos/organizador-estuches/organizador-estuches_1_solo.webp", "img/productos/organizador-estuches/organizador-estuches_colores.webp", "img/productos/organizador-estuches/organizador-estuches_2_uso.webp", "img/productos/organizador-estuches/organizador-estuches_3_dimensiones.webp", "img/productos/organizador-estuches/organizador-estuches_4_detalle.webp", "img/productos/organizador-estuches/organizador-estuches_5_en-mano.webp"] },
    { id: "gancho-audifonos", categoria: "gaming", nombre: "Gancho para audífonos bajo el escritorio", precio: null,
      descripcion: "Cuelga los audífonos debajo del escritorio. Se fija con dos tornillos.",
      medidas: [8.2, 3.2, 5.8], material: "estandar", colores: ["Carbón", "Bermellón", "Hueso"],
      personalizable: false, dias: null, creado: "2026-11-10",
      fotos: ["img/productos/gancho-audifonos/gancho-audifonos_1_solo.webp", "img/productos/gancho-audifonos/gancho-audifonos_colores.webp", "img/productos/gancho-audifonos/gancho-audifonos_2_uso.webp", "img/productos/gancho-audifonos/gancho-audifonos_3_dimensiones.webp", "img/productos/gancho-audifonos/gancho-audifonos_4_detalle.webp", "img/productos/gancho-audifonos/gancho-audifonos_5_en-mano.webp"] },
    { id: "soporte-celular", categoria: "tech", nombre: "Soporte para celular", precio: null,
      descripcion: "Soporte inclinado para cargar el celular sin cables a la vista: el conector entra por debajo, el cable baja por dentro y sale por un orificio trasero.",
      medidas: [8, 9, 12.2], material: "estandar", colores: ["Arena", "Hueso", "Carbón"],
      personalizable: false, dias: null, destacado: true, creado: "2026-11-09",
      fotos: ["img/productos/soporte-celular/soporte-celular_1_solo.webp", "img/productos/soporte-celular/soporte-celular_colores.webp", "img/productos/soporte-celular/soporte-celular_2_uso.webp", "img/productos/soporte-celular/soporte-celular_3_dimensiones.webp", "img/productos/soporte-celular/soporte-celular_4_detalle.webp", "img/productos/soporte-celular/soporte-celular_5_en-mano.webp", "img/productos/soporte-celular/soporte-celular_6_cable.webp", "img/productos/soporte-celular/soporte-celular_7_por-dentro.webp"] },
    { id: "soporte-portatil", categoria: "tech", nombre: "Soporte vertical para portátil", precio: null,
      descripcion: "Mantiene el portátil cerrado de pie. Incluye insertos para equipos de 12, 16 y 20 mm de grosor.",
      medidas: [15, 6.6, 4.6], material: "estandar", colores: ["Gris", "Carbón", "Hueso"],
      personalizable: false, dias: null, creado: "2026-11-09",
      fotos: ["img/productos/soporte-portatil/soporte-portatil_1_solo.webp", "img/productos/soporte-portatil/soporte-portatil_colores.webp", "img/productos/soporte-portatil/soporte-portatil_2_uso.webp", "img/productos/soporte-portatil/soporte-portatil_3_dimensiones.webp", "img/productos/soporte-portatil/soporte-portatil_4_detalle.webp", "img/productos/soporte-portatil/soporte-portatil_5_en-mano.webp"] },
    { id: "enrollador-cables", categoria: "tech", nombre: "Enrollador de cables", precio: null,
      descripcion: "Organizador redondo con tapa para llevar el cable de carga sin enredos.",
      medidas: [6, 6, 1.6], material: "estandar", colores: ["Salvia", "Hueso", "Carbón"],
      personalizable: false, dias: null, creado: "2026-11-09",
      fotos: ["img/productos/enrollador-cables/enrollador-cables_1_solo.webp", "img/productos/enrollador-cables/enrollador-cables_colores.webp", "img/productos/enrollador-cables/enrollador-cables_2_uso.webp", "img/productos/enrollador-cables/enrollador-cables_3_dimensiones.webp", "img/productos/enrollador-cables/enrollador-cables_4_detalle.webp", "img/productos/enrollador-cables/enrollador-cables_5_en-mano.webp"] }
  ]
};
