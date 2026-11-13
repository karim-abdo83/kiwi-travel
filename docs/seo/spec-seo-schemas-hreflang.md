# Spec SEO: datos estructurados y hreflang (karimtor.com)

- **Rama:** `SEO`, sincronizada con `main` en `49f8e1b`.
- **Alcance:** las tareas de *Datos estructurados* y *Hreflang* del plan técnico. Lo que queda fuera de alcance está en la sección 5.
- **Stack:** Next.js 15.5 (App Router), next-intl 4.12 (`localePrefix: "always"`, locales `en | ru | tr`, por defecto `en`).

---

## 1. Hreflang

### 1.1 Estado actual

Hoy el hreflang sale de dos lugares a la vez, y las dos señales no coinciden.

**A. Cabecera HTTP `Link`, que genera next-intl automáticamente**

- `src/i18n/routing.ts` no define `alternateLinks`, así que vale `true` por defecto. En cada respuesta, el middleware de next-intl agrega una cabecera `Link` con `en`, `ru`, `tr` y `x-default`.
- Ese `x-default` apunta a la ruta **sin prefijo de idioma**, como `https://karimtor.com/trips/<slug>`. Lo genera `getAlternateLinksHeaderValue.js`, que usa `normalizedUrl.pathname` sin prefijo.
- Esa ruta sin prefijo devuelve un **301** a `/en/...` (lo hace `src/middleware.ts`). Resultado: **el x-default apunta a una URL que redirige.** Esta es la causa del aviso de la auditoría y probablemente contribuye a las 48 URLs `/trips/...` indexadas.
- La cabecera se emite en **todas** las rutas. Eso incluye `/ru/google-ads/*` y `/tr/google-ads/*`, que devuelven 404, y también `/bookings` y `/dashboard`. Es decir, hay hreflang que apuntan a páginas rotas o privadas.

**B. Etiquetas `<link rel="alternate">` en el HTML, desde `generateMetadata`**

| Página | Archivo | canonical | hreflang | x-default |
|---|---|---|---|---|
| Home | `(main)/page.tsx` | relativo | relativo | ❌ |
| Ficha de tour | `(main)/trips/[slug]/page.tsx` | relativo | relativo, siempre con los 3 idiomas | ❌ |
| Destino | `(main)/destinations/[slug]/page.tsx` | absoluto | absoluto | ❌ |
| FAQs | `(main)/faqs/page.tsx` | absoluto | absoluto | ❌ |
| Listado de tours | `(main)/trips/page.tsx` | ❌ | ❌ | ❌ |
| Índice de destinos | `(main)/destinations/page.tsx` | ❌ | ❌ | ❌ |
| País | `(main)/destinations/country/[country]/page.tsx` | ❌ | ❌ | ❌ |
| Blog (índice y artículos) | `(main)/blog/page.tsx`, `blog/[slug]/page.tsx` | ❌ (sin `generateMetadata`) | ❌ | ❌ |
| Google Ads (6 páginas) | `(main)/google-ads/*/page.tsx` | absoluto, noindex | — (solo EN, correcto) | — |
| Privacy / Terms | | noindex | — | — |

**Otro problema:** `titleTr` y `descriptionTr` tienen `default('')` en `src/server/db/schema/trip.ts`. Cuando un tour no tiene traducción al turco, `/tr/trips/<slug>` se publica igual, con título y descripción vacíos, y el hreflang `tr` apunta a una página sin contenido. Esto pasa porque `localeAttributeFactory` usa `key in object` y no vuelve a EN cuando el string está vacío.

### 1.2 Cambios

**H1. Desactivar la cabecera `Link` de next-intl**

En `src/i18n/routing.ts`:
```ts
export const routing = defineRouting({
  locales: ["en", "ru", "tr"],
  defaultLocale: "en",
  alternateLinks: false,
});
```
El HTML queda como la única fuente de hreflang. Así se elimina el x-default que redirige y los alternates en rutas 404 o privadas.

**H2. Un helper único para canonical y alternates**

Archivo nuevo: `src/lib/seo/alternates.ts`
```ts
import { env } from "@/env";
import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

export const SITE_URL = (env.NEXT_PUBLIC_APP_URL || "https://karimtor.com").replace(/\/$/, "");

/**
 * @param path    ruta sin prefijo de idioma, empezando con "/" ("" para la home)
 * @param locale  idioma actual
 * @param available idiomas con contenido real (por defecto, todos)
 */
export function buildAlternates(
  path: string,
  locale: string,
  available: readonly Locale[] = routing.locales,
) {
  const url = (l: string) => `${SITE_URL}/${l}${path}`;
  const languages: Record<string, string> = {};
  for (const l of available) languages[l] = url(l);
  if (available.includes(routing.defaultLocale)) {
    languages["x-default"] = url(routing.defaultLocale);
  }
  return { canonical: url(locale), languages };
}
```
Reglas:
- Todas las URLs son absolutas.
- `x-default` apunta a la versión `/en/...`, que responde 200 y no redirige.
- Cada página se incluye a sí misma en sus alternates.
- Solo se listan los idiomas que tienen contenido.

**H3. Usar el helper en las páginas indexables**

| Página | Llamada |
|---|---|
| Home | `buildAlternates("", locale)` |
| Listado de tours | `buildAlternates("/trips", locale)` |
| Ficha de tour | `buildAlternates(\`/trips/${slug}\`, locale, tripLocales(trip))` |
| Índice de destinos | `buildAlternates("/destinations", locale)` |
| Destino | `buildAlternates(\`/destinations/${slug}\`, locale)` |
| País | `buildAlternates(\`/destinations/country/${country}\`, locale)` |
| FAQs | `buildAlternates("/faqs", locale)` |
| Blog (índice) | `generateMetadata` nuevo con `buildAlternates("/blog", locale)` |
| Blog (artículo) | `generateMetadata` nuevo con `buildAlternates(\`/blog/${slug}\`, locale)`; si el slug no existe, `notFound()` |

Para las fichas de tour, `tripLocales(trip)` devuelve `en` y `ru` siempre (son `notNull`), y agrega `tr` solo si `titleTr.trim() !== ""`.

Las páginas de Google Ads, Privacy y Terms no se tocan: no llevan hreflang.

**H4. Fichas sin turco (hay que decidirlo)**

Si `/tr/trips/<slug>` no tiene `titleTr`, hay dos opciones:
- (a) `robots: { index: false }` en la versión TR. Es la recomendada.
- (b) Una redirección 301 a `/en/trips/<slug>`.

Con cualquiera de las dos, H3 ya quita esa URL del hreflang de las otras versiones.

### 1.3 Criterios de aceptación

1. `curl -sI https://<preview>/ru/trips/<slug>` no devuelve ninguna cabecera `Link` con `hreflang`.
2. El código fuente de cada página de la tabla H3 tiene un `<link rel="canonical">` absoluto y un `<link rel="alternate" hreflang>` por cada idioma disponible, más `x-default` apuntando a `/en/...`.
3. Todas las URLs de los hreflang responden **200** (sin 301, 404 ni 500).
4. Los hreflang son recíprocos: si A apunta a B, B apunta a A.
5. En una ficha sin `titleTr`, no aparece `hreflang="tr"` en ninguna de sus versiones.
6. `pnpm typecheck` termina sin errores.

---

## 2. Datos estructurados

### 2.1 Estado actual

**Ficha de tour** (`trips/[slug]/page.tsx` y `lib/seo/schemas.ts → generateTripSchema`)
- Ya renderiza `["Product","TouristTrip"]` con `offers` y `aggregateRating`, más un `BreadcrumbList`.
- `priceCurrency` está fijo en `"EUR"`, pero en RU y TR el precio que se muestra está en **USD** (la página usa `$` cuando `locale !== "en"`). **El precio del schema no coincide con el visible.**
- `offers` no tiene `url`, `priceValidUntil` ni `availability` basada en datos (siempre `InStock`).
- `aggregateRating` no tiene `bestRating` ni `worstRating`, y `ratingValue` va como string.
- Hay código muerto: la variable `jsonLd` (`TouristTrip`) se arma pero no se renderiza, y su `offers.url` usa `trip.id` en lugar del slug.
- En el breadcrumb, «Home» y «Destinations» no están traducidos.
- Las reseñas (`Testimonials`) se cargan del lado del cliente con `useQuery`. Google ejecuta JavaScript; Yandex lo hace de forma limitada.

**Layout** (`src/app/[locale]/layout.tsx`)
- `Organization.logo` apunta a `"/logo.png"`: es relativo y **el archivo no existe** en `public/` (hay `logo.svg`, `logo-icon.svg` y `email-logo.png`).
- El `WebSite.potentialAction` (SearchAction) apunta a `/search`, una ruta que no existe. Además, Google retiró el sitelinks search box en noviembre de 2024.

**Destino** (`destinations/[slug]/page.tsx`)
- Tiene `TouristDestination` con `hasPart: TouristTrip[]`, `BreadcrumbList` y `FAQPage`.
- El JSON del `FAQPage` no escapa `<`, a diferencia de los otros bloques.

**Listado, país y blog:** no tienen ningún schema propio.

### 2.2 Cambios

**S1. `generateTripSchema` (en `src/app/[locale]/(main)/lib/seo/schemas.ts`)**

Firma nueva:
```ts
generateTripSchema({
  trip: {
    title, description, images: string[], slug,
    priceInCents, currency: "EUR" | "USD",
    isAvailable: boolean,
    duration?: string,          // ISO 8601 si se puede derivar ("PT8H", "P3D")
    destinationName: string,
    reviews: { ratingValue: number }[],
  },
  locale, baseUrl,
})
```
Salida esperada para `/ru/trips/pamukkale-from-antalya`:
```json
{
  "@context": "https://schema.org",
  "@type": ["Product", "TouristTrip"],
  "@id": "https://karimtor.com/ru/trips/pamukkale-from-antalya#trip",
  "name": "…",
  "description": "…",
  "image": ["https://…/1.webp", "https://…/2.webp"],
  "url": "https://karimtor.com/ru/trips/pamukkale-from-antalya",
  "inLanguage": "ru",
  "brand": { "@type": "Brand", "name": "Karim Tour" },
  "provider": { "@type": "Organization", "@id": "https://karimtor.com/#organization" },
  "touristType": "IndividualOrGroup",
  "itinerary": { "@type": "Place", "name": "Анталья" },
  "offers": {
    "@type": "Offer",
    "price": "45.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://karimtor.com/ru/trips/pamukkale-from-antalya",
    "priceValidUntil": "2026-12-31"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.8,
    "bestRating": 5,
    "worstRating": 1,
    "reviewCount": 12
  }
}
```
Reglas:
- **Moneda:** `en` usa `EUR` (con `englishAdultTripPriceInCents ?? adultTripPriceInCents`); `ru` y `tr` usan `USD` (con `adultTripPriceInCents`). Es la misma lógica que el precio visible.
- **Disponibilidad:** `isAvailable === false` se marca como `https://schema.org/OutOfStock`; si no, `InStock`. Las fichas acuáticas con temporada terminada siguen como InStock mientras `isAvailable` sea true (el cliente pidió no tocarlas).
- **`priceValidUntil`:** 31 de diciembre del año en curso.
- **`aggregateRating`:** solo si `reviews.length > 0`. Usa las reseñas con `isHiddenByAdmin = false`, que son las que ya filtra `viewBySlug`, y el rating va como número.
- **Imágenes:** hasta 3, todas las que no sean video (filtrar `?type=video`).
- **Limpieza:** eliminar la variable `jsonLd` y el import de `schema-dts` si queda sin uso.

**S2. Breadcrumb traducido**

Agregar las claves `Breadcrumb.home` y `Breadcrumb.destinations` en `messages/{en,ru,tr}.json` y usarlas en la ficha de tour y en la de destino.

**S3. Organization y WebSite (layout)**
- `Organization`: agregar `"@id": "${SITE_URL}/#organization"`; cambiar `logo` a una URL absoluta de un PNG que exista (falta decidir el archivo: hoy está `email-logo.png`, o habría que exportar un `logo.png` de 512×512); `url` absoluto.
- `WebSite`: quitar `potentialAction` y agregar `"inLanguage": locale`.

**S4. Destino**
- Mantener `TouristDestination` y el `FAQPage`.
- Escapar `<` en el JSON del `FAQPage`, igual que en el resto de los bloques.
- Cambiar `hasPart: TouristTrip[]` por un `ItemList` separado de los tours, con `url` absoluto. Es más estándar y no anida tours incompletos.

**S5. Listado y país (prioridad baja)**

Agregar un `ItemList` con los tours o destinos visibles, usando `generateListSchema`, que ya existe.

### 2.3 Criterios de aceptación

1. El [Rich Results Test](https://search.google.com/test/rich-results) de una ficha EN, una RU y una TR (si existe) muestra un **Product snippet** válido, sin errores, con precio y moneda iguales a los que se ven en la página.
2. Una ficha sin reseñas no tiene `aggregateRating` y sigue validando, porque `offers` está presente.
3. El [Schema Markup Validator](https://validator.schema.org/) no da errores en la home, una ficha, un destino ni en FAQs.
4. El logo de `Organization` responde 200 y es PNG o JPG.
5. Ningún bloque JSON-LD tiene una URL relativa.
6. `pnpm typecheck` termina sin errores.

---

## 3. Orden de implementación

1. H1: `alternateLinks: false`.
2. H2: el helper `buildAlternates`.
3. H3: aplicar el helper página por página.
4. S1 y S2: schema de la ficha de tour y breadcrumb.
5. S3: layout.
6. S4 y S5.
7. H4, cuando el cliente decida.

Ningún cambio toca la base de datos ni el panel de administración.

## 4. Validación después del deploy

- Search Console, *Inspección de URL* sobre 3 fichas: comprobar el canonical elegido por Google y los alternates.
- Yandex Webmaster, *Validador de microdatos* sobre las mismas fichas.
- Rastreo con Screaming Frog (modo lista, con las URLs del sitemap): pestaña *Hreflang*, filtrando por *Non-200 hreflang URLs*, *Missing return links* y *Missing X-Default*.
- Search Console, *Mejoras → Fragmentos de producto*: ver la evolución en 2 a 4 semanas.

## 5. Fuera de alcance (tareas separadas del plan)

- Los enlaces internos sin prefijo de idioma. Por ejemplo, en `trips/[slug]/page.tsx` los «Similar trips» usan `next/link` con `/trips/...` en lugar del `Link` de `@/i18n/routing`, igual que otros componentes. Es la otra causa de las 48 URLs `/trips/...`.
- Las erratas en los slugs y sus 301.
- El sitemap: hoy incluye `/tr/...` de fichas sin traducción y artículos del blog sin validar, que dan 500 si el slug no existe. También se puede evaluar agregar `alternates.languages` en `sitemap.ts`, que Yandex usa como señal adicional.
- Las meta descriptions, el texto en turco dentro de las páginas EN y el rendimiento.
