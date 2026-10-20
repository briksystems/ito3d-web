# ITO 3D · Página web

Tienda en línea de objetos impresos en 3D. Hilo a hilo.

HTML, CSS y JavaScript puros, sin instalar nada. Todos los archivos están sueltos en esta carpeta.

## Cómo verla

Abre `index.html` con doble clic. O, mejor, sirve la carpeta:

```
python3 -m http.server 8000
```

y entra a http://localhost:8000

## Archivos

| Archivo | Qué es |
| --- | --- |
| `index.html` | Inicio |
| `producto.html` | Ficha de producto (ejemplo: Bandeja organizadora) |
| `cotiza.html` | Cotiza tu diseño |
| `styles.css` | Todos los estilos. Los colores y medidas están arriba, en `:root` |
| `script.js` | Menú del celular, color y WhatsApp de la ficha, formulario |
| `ito3d-*.svg` | Logos (claro, oscuro y símbolo) |
| `favicon.svg`, `favicon-32.png`, `apple-touch-icon-180.png` | Íconos de la pestaña y del celular |
| `manrope-latin.woff2` | Tipografía Manrope (licencia libre OFL) |

## Lo primero que hay que cambiar

1. **Número de WhatsApp.** En `script.js`, la línea `WHATSAPP_NUMBER`. Con eso se arreglan todos los botones de WhatsApp del sitio.
2. **Textos entre corchetes.** Busca `[PRECIO]`, `[NÚMERO]`, `[DOMINIO]`, `[RUT / NIT]`, `[X]`, `[VALOR]`, `[DESCRIPCIÓN CORTA]` y `[ANCHO × LARGO × ALTO]`.
3. **Fotos.** Los bloques con clase `ph` son fotos de relleno. Busca los comentarios `FOTO PENDIENTE` y `VIDEO PENDIENTE`. Se reemplaza el bloque por una etiqueta `<img>` con su texto `alt`.

## Pendiente (viene del brief)

- Páginas que aún no existen: Tienda y categorías, Empresas, Nosotros, Ayuda y políticas. Sus enlaces apuntan a `#`.
- El formulario de Cotiza tu diseño valida los campos, pero **todavía no envía nada**. Falta conectarlo a correo y a una hoja de cálculo, con carga de archivos hasta 50 MB. Eso necesita un servicio de formularios o un backend.
- El carrito y el pago con Wompi o Bold son la versión 2.
- Panel para que el cliente edite productos, precios y fotos sin programar. El brief lo pide y un sitio estático no lo da. Hay que decidir si se usa una plataforma de tienda o un gestor de contenido.
- SEO (sitemap, datos de producto), Google Analytics 4, píxel de Meta y aviso de cookies.

## Reglas del logo (del kit de marca)

- Ancho mínimo: 120 px el logo horizontal, 24 px el símbolo.
- No cambiar colores, no deformar, no poner sombras.
- Sobre fondo carbón se usa `ito3d-horizontal-fondo-oscuro.svg`.

## Colores y tipografía

Bermellón `#C8402A` · Carbón `#1F1E1C` · Hueso `#F6F3EE` · Gris `#5E5A54` · Arena `#E9E3D8`

Manrope: títulos en 800, textos en 400 y 600.
