# Menú digital — Todos Santos

Sitio estático servido por un Cloudflare Worker. Un solo archivo de datos
(`public/menu.json`) controla todo el contenido del menú; el diseño vive en
`public/index.html` y normalmente no lo vuelves a tocar.

## 1. Primer despliegue

```bash
npm install
npx wrangler login          # abre el navegador, autoriza tu cuenta de Cloudflare
npx wrangler deploy
```

Esto te da una URL tipo `todos-santos-menu.<tu-cuenta>.workers.dev`. Sirve para
probar, pero para producción usa un dominio propio (paso 3).

Para ver el sitio en tu máquina antes de publicar cambios:

```bash
npm run dev     # abre http://localhost:8787
```

## 2. Automatizar el despliegue (GitHub Actions)

Ya está en `.github/workflows/deploy.yml`: cada `git push` a `main` corre
`wrangler deploy` automáticamente. Necesitas 2 secrets en
**GitHub → tu repo → Settings → Secrets and variables → Actions**:

- `ACCOUNT_ID`: lo ves en el dashboard de Cloudflare, barra lateral derecha de
  "Workers & Pages".
- `API_key`: créalo en **Cloudflare dashboard → My Profile → API Tokens →
  Create Token**, usa la plantilla "Edit Cloudflare Workers" (dale permiso
  solo sobre la cuenta que necesitas, no "todas las cuentas").

Con esto, tú (o el dueño del restaurante) nunca vuelven a tocar la terminal:
todo el ciclo de cambio de precios es "editar → guardar → subir a GitHub".

## 3. Dominio propio (que no se vea "workers.dev" ni tu nombre de cuenta)

Esto es aparte del código, se hace en el dashboard:

1. Consigue un dominio. Opciones:
   - Cómpralo directo en Cloudflare Registrar (cobra el precio del registro,
     sin margen) — el más simple porque ya queda dentro de tu cuenta.
   - O usa uno que ya tengas en otro proveedor (GoDaddy, Namecheap, etc.) y
     cambia sus **nameservers** a los que te da Cloudflare al agregarlo como
     "sitio" (Add a site). Tarda de minutos a un par de horas en propagar.
2. En el dashboard: **Workers & Pages → todos-santos-menu → Settings →
   Domains & Routes → Add → Custom Domain**.
3. Escribe el subdominio que quieras, ej. `menu.todosantosgdl.mx` o
   directo `todosantosgdl.mx`. Cloudflare emite el certificado SSL solo,
   no necesitas hacer nada más — queda con candado/https automáticamente.
4. Genera el QR apuntando a esa URL final (cualquier generador de QR gratis
   sirve, ej. el de qr-code-generator.com o el de la propia consola de
   Cloudflare) e imprímelo en un tent card o etiqueta para cada mesa.

Con esto la URL nunca muestra tu cuenta ni "workers.dev" — solo el dominio
del restaurante.

### Seguridad
No hay nada sensible que proteger (el menú es público), así que no necesitas
autenticación ni base de datos. Dos cosas sí importan:
- El **API token** de Cloudflare va solo como secret de GitHub, nunca en el
  código ni en el repo.
- El **Account ID no es secreto** (es público, como un nombre de usuario),
  pero igual está bien tenerlo como secret por prolijidad.

## 4. Cómo se cambian los precios (el día a día)

Todo el contenido vive en `public/menu.json`. Para cambiar un precio, agregar
un platillo o quitarlo:

1. Abre `public/menu.json` (se puede editar directo desde GitHub.com, sin
   instalar nada — botón de lápiz en la esquina del archivo).
2. Cambia el número o el texto que necesites. Estructura de cada platillo:

   ```json
   { "name": "Margarita", "price": 216, "desc": "Queso mozzarella, jitomate y albahaca fresca." }
   ```

3. Guarda / haz commit directo a `main` (o desde tu computadora:
   `git add . && git commit -m "actualiza precios" && git push`).
4. GitHub Actions corre solo, en ~20-30 segundos el cambio ya está en vivo.
   No hay que volver a imprimir el QR — la URL nunca cambia.

No se necesita tocar `index.html` ni el worker para esto; ese archivo solo
define cómo se ve, no qué dice.

## 5. Estructura del proyecto

```
todos-santos-menu/
├── public/
│   ├── index.html      ← diseño del menú (rara vez se edita)
│   └── menu.json        ← contenido y precios (se edita seguido)
├── src/
│   └── index.ts          ← worker que sirve los archivos estáticos
├── wrangler.toml          ← configuración de Cloudflare
├── package.json
└── .github/workflows/deploy.yml   ← auto-despliegue en cada push
```

## 6. Si más adelante quieres vender esto a otros restaurantes

Lo más simple para replicarlo sin construir nada nuevo: por cada cliente
nuevo, duplicas este repo (o usas "Use this template" en GitHub), cambias
`menu.json` y el nombre/colores en `index.html`, y despliegas un Worker nuevo
con su propio dominio o subdominio. El costo marginal por cliente es
prácticamente cero (Cloudflare Workers tiene una capa gratuita generosa para
tráfico de este tamaño).

Si en el futuro quieres que el propio dueño edite su menú sin tocar GitHub
(un panel con usuario/contraseña y formulario), el siguiente paso técnico es
mover `menu.json` a **Cloudflare KV** (una base de datos simple clave-valor)
y agregar una página `/admin` protegida con contraseña que lea y escriba ahí.
Es una v2 razonable una vez que tengas 3-4 clientes y valga la pena
construirlo una sola vez para todos.
