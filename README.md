# NOIR INK — Embudo de marketing

Landing page en hebreo (RTL) con panel de administración: CRM de leads, analítica del embudo,
edición de contenido e imágenes, y píxeles de tracking.

- **Stack**: Next.js 15 (App Router) + Postgres + Resend + Vercel.
- **Idioma del sitio y del panel**: hebreo (`lang="he" dir="rtl"`).
- **Landing**: `/`
- **Panel**: `/admin` (protegido por contraseña, no indexable)

---

## 1. Puesta en marcha local

```bash
npm install
cp .env.example .env.local   # y completar los valores
npm run db:migrate           # crea las tablas
npm run dev                  # http://localhost:3000
```

### Variables de entorno

| Variable | Para qué sirve |
| --- | --- |
| `DATABASE_URL` | Cadena de conexión de Postgres (Neon, Supabase, etc.). |
| `ADMIN_PASSWORD_HASH` | Hash de la contraseña del panel, en base64. |
| `SESSION_SECRET` | Cadena larga y aleatoria para firmar la cookie de sesión. |
| `RESEND_API_KEY` | API key de Resend para enviar los leads por mail. |
| `MAIL_FROM` | Remitente verificado, ej. `NOIR INK <leads@noirink.co.il>`. |
| `DB_POOL_MAX` | Opcional. Tamaño del pool de conexiones (por defecto 5). |

Cambiar la contraseña del panel (genera el hash y lo escribe en `.env.local`):

```bash
npm run set-password -- "la-contraseña-del-estudio"
```

Imprime además el valor a copiar en la variable `ADMIN_PASSWORD_HASH` de Vercel. Si solo se
quiere el hash sin tocar el archivo:

```bash
npm run hash -- "la-contraseña-del-estudio"
```

Sale en **base64** a propósito: un hash bcrypt crudo contiene `$`, y los archivos `.env`
interpretan ese carácter como expansión de variables y lo rompen.

Generar el `SESSION_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 2. Base de datos

Cualquier Postgres sirve. El código detecta solo si la cadena apunta a un pooler en modo
*transaction* (Supabase/Supavisor, PgBouncer) y desactiva los prepared statements, que esos
poolers no soportan.

### Opción A — Supabase (plan gratis)

1. Crear un proyecto en [supabase.com](https://supabase.com).
2. **Project Settings → Database → Connection string**, pestaña **Transaction pooler**
   (host `...pooler.supabase.com`, puerto `6543`). Esa es la que hay que usar en Vercel: la
   conexión directa a `db.xxx.supabase.co` es solo IPv6 en el plan gratis.
3. Reemplazar `[YOUR-PASSWORD]` por la contraseña de la base y ponerla en `DATABASE_URL`.
4. Correr `npm run db:migrate`.

Las tablas también se pueden crear pegando `db/schema.sql` en el **SQL Editor** de Supabase.

### Opción B — Neon (plan gratis)

1. Crear un proyecto y copiar la connection string (incluye `?sslmode=require`).
2. Ponerla en `DATABASE_URL`.
3. Correr `npm run db:migrate`.

Tablas que crea `db/schema.sql`:

- `content` — un único registro JSON con todo el contenido editable del sitio.
- `media` — imágenes subidas desde el panel, servidas por `/api/media/[id]`.
- `leads` — cada pedido del formulario, con su atribución (utm) y estado del CRM.
- `events` — eventos del embudo: `view`, `cta_click`, `form_start`.

---

## 3. Envío de mails (Resend)

1. Crear cuenta en [resend.com](https://resend.com) y generar una API key.
2. Verificar el dominio del estudio en Resend (Domains → Add Domain, cargando los registros DNS).
3. `MAIL_FROM` debe usar ese dominio verificado. Para probar antes de verificarlo se puede usar
   `onboarding@resend.dev`.
4. Las direcciones que **reciben** los leads se configuran desde el panel, en **הגדרות → התראות במייל**
   (se pueden poner varias separadas por coma).

Si el mail falla, **el lead igual queda guardado** y aparece en el panel marcado como
`email failed`, con un botón para reintentar el envío.

### Los dos mails que salen por cada lead

| Mail | A quién | Editable desde |
| --- | --- | --- |
| Notificación de pedido nuevo | Al estudio (direcciones de **Settings → Email notifications**) | Código: [`src/lib/mail.ts`](src/lib/mail.ts) |
| Confirmación automática | A quien dejó su email en el formulario | Panel: **Settings → Auto-reply to the client** |

La confirmación se puede desactivar con un switch, usa `{{name}}` para insertar el nombre de la
persona, y su `Reply-To` apunta al mail del estudio: si el cliente responde, la respuesta llega al
estudio y no al remitente técnico. Si la persona no dejó email, no se intenta enviar y el lead
queda marcado como `skipped`. Ambos envíos salen en paralelo y su estado se ve en la ficha del lead.

> Mientras el remitente sea `onboarding@resend.dev`, **Resend solo entrega a la dirección de la
> cuenta de Resend**. La confirmación al cliente recién funciona de verdad con el dominio del
> estudio verificado.

---

## 4. Deploy en Vercel

1. Subir el proyecto a un repositorio de GitHub.
2. En Vercel: *Add New → Project* e importar el repo (framework detectado: Next.js).
3. Cargar las cinco variables de entorno en *Settings → Environment Variables*.
4. Deploy. Después, apuntar el dominio del estudio en *Settings → Domains*.

La migración se corre una sola vez desde la máquina local (`npm run db:migrate`) apuntando a la
misma `DATABASE_URL` de producción.

---

## 5. El panel de administración

El sitio público está en hebreo y RTL; **el panel está en inglés y LTR**. Los campos que contienen
texto del sitio usan `dir="auto"`, así que el hebreo se sigue alineando a la derecha dentro de cada
input aunque la interfaz sea LTR.

| Sección | Qué permite |
| --- | --- |
| **Dashboard** | Visitantes únicos, clicks en CTA, formularios empezados, leads, tasa de conversión, gráfico diario y ranking de fuentes de tráfico. Rango de 7, 30 o 90 días. |
| **Leads** | Listado con búsqueda y filtro por estado. Filas expandibles (email, idea, notas y atribución sin salir de la tabla), cambio de estado en línea, y selección múltiple para borrar en lote. Cada lead tiene además ficha propia con reenvío del mail. |
| **Website** | SEO, hero (imagen, títulos, subtítulo, botones, 3 métricas), sección "sobre mí" (2 imágenes, textos, 4 bullets, firma) y galería (agregar, borrar, reordenar, subir y **recortar** imágenes). |
| **Settings** | Textos del bloque de contacto, teléfono, mail, dirección, horarios, WhatsApp con mensaje prellenado, redes sociales, destinatarios de las notificaciones y píxeles. |

Lo que **no** es editable desde el panel (queda fijo en el código): el nombre NOIR INK, el menú de
navegación, la sección "התהליך" (4 pasos) y los textos del footer. Están en
[`src/app/page.tsx`](src/app/page.tsx).

El mail de notificación que llega por cada lead sigue en hebreo/RTL
([`src/lib/mail.ts`](src/lib/mail.ts)).

---

## 6. Tracking y campañas

- **Meta Pixel**, **GA4** y **Google Tag Manager** se cargan solo si su ID está cargado en הגדרות.
- Al enviar el formulario se dispara la conversión: `fbq('track','Lead')`, `gtag('event','generate_lead')`
  y un push `generate_lead` a `dataLayer`.
- La analítica propia del panel es independiente de esos píxeles: no depende de cookies de terceros
  ni de bloqueadores, y guarda la atribución de la primera visita de cada sesión.
- Para medir campañas, agregar parámetros utm al link del anuncio:

```text
https://noirink.co.il/?utm_source=instagram&utm_medium=paid&utm_campaign=sept-blackwork
```

Esos valores quedan pegados al lead que se genere en esa sesión y aparecen en su ficha y en el
ranking de fuentes del dashboard.

---

## 7. Rendimiento

Decisiones que hacen que la landing cargue rápido, por si alguien las toca sin querer:

- **Toda imagen que se sube se recomprime** antes de guardarse ([`src/lib/images.ts`](src/lib/images.ts)):
  se reescala a 2000px como máximo y se reencoda a WebP. Como los archivos viven en Postgres y se
  sirven por `/api/media`, el peso del blob es tiempo de carga directo: un GIF de 1.4 MB tardaba
  ~10s en salir de la base; el mismo, ya comprimido, pesa 38 KB y tarda 0.4s. De un GIF animado se
  guarda el primer cuadro.
- Para recomprimir lo que ya estaba cargado antes de este cambio: `npm run media:recompress`.
- El hero, la sección "sobre mí" y la galería usan `next/image`: cada dispositivo recibe el tamaño
  que necesita en AVIF. El hero pasó de 630 KB a 55 KB en desktop y 12 KB en móvil.
- Las fuentes se auto-hospedan con `next/font` en vez de pedirlas a Google, así no bloquean el
  primer render.
- La landing se cachea (`revalidate = 300`) y se invalida sola al guardar desde el panel, así que
  no consulta la base en cada visita.
- `/api/media` responde con `ETag`: como cada subida crea un id nuevo y nunca se reescribe, el
  navegador revalida con un `304` vacío en vez de volver a bajar el archivo.
- Reemplazar o recortar una imagen deja la anterior huérfana en la base. En **Settings → Image
  storage** se ve cuánto ocupan y hay un botón para borrar las que ya no usa ninguna sección
  (se respetan las de la última hora, por si están en un editor sin guardar).

## 8. Notas de seguridad

- El panel usa un único usuario: contraseña bcrypt + cookie de sesión firmada (JWT, 7 días),
  validada en `src/middleware.ts` antes de servir cualquier ruta `/admin`.
- El formulario público tiene honeypot anti-bots, límite de 5 envíos por IP cada 10 minutos y
  descarte de reenvíos idénticos dentro de los 2 minutos. El conteo se hace **en la base**, no en
  memoria: en Vercel cada request puede tocar una instancia distinta, así que un contador en
  memoria nunca llegaría a aplicarse.
- `/admin` y `/api` están excluidos en `robots.txt`.
- Las imágenes subidas se validan por tipo (JPG, PNG, WEBP, AVIF, GIF) y tamaño (máx. 4 MB, límite de Vercel para subidas).
