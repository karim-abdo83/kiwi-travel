# Karim Tour (karimtor.com): contexto SEO del proyecto

## Proyecto
- **Sitio:** karimtor.com, agencia de excursiones y traslados en Turquía y Egipto.
- **Código:** proyecto TypeScript `kiwi-travel` (carpeta local: `Proyectos Duwoh/Dimitri/viajes/Kamirtor-real/kiwi-travel`).
- **Idiomas:** /en, /ru, /tr. El hreflang está bien implementado en la home y en las fichas, pero falta el `x-default`.
- **Reglas de trabajo:** no hacer commit ni push, y no borrar archivos (renombrar está permitido). Martin revisa los cambios y hace él los commits.

## Datos de partida
- **GA4:** del 1 de enero al 1 de noviembre de 2026. Es tráfico de todos los canales; la búsqueda orgánica es el 45% de las sesiones.
- **Search Console:** los últimos 6 meses. Google es un canal menor, con unos 160 clics al mes.
- **Yandex Webmaster:** del 4 de noviembre de 2025 al 6 de octubre de 2026.
  - Unos 600 clics orgánicos al mes. Es el buscador principal, porque el público es mayoritariamente ruso.
  - El 92% que GA4 atribuye a Yandex está inflado, probablemente por anuncios de Yandex Direct sin etiquetar.
  - El 90% de las impresiones están entre las posiciones 4 y 50, con una posición media de 10,4.
- **Reparto del tráfico por destino:** las páginas de excursiones en Egipto reciben cerca del 55% de las sesiones analizadas.

## Lo que pidió el cliente
- **Turquía, fin de temporada:** quedan entre 10 y 15 días de temporada. Las excursiones marítimas se cancelan casi a diario.
- **Programas que siguen activos:** Pamukkale, Capadocia, Demre–Myra–Kekova, Cañón Verde, Land of Legends y el Acuario de Antalya.
- **Fichas acuáticas:** no se borran, no se redirigen y no se marcan con noindex. Llevan un aviso de temporada finalizada y enlaces a los tours activos.

## Prioridades de contenido
1. Destacar los tours activos en las páginas de destino de Antalya, Alanya, Kemer, Belek y Side, en RU y EN.
2. Subir de posición las fichas que ya existen pero no reciben tráfico:
   - Capadocia desde Side (3 días)
   - Demre desde Belek (posición 19 en Google)
   - Acuario (posición 16)
   - Estambul
3. Egipto, como propuesta abierta a decisión del cliente:
   - Eden Island (posición 10) y Makadi Water World (posición 22)
   - Cairo en avión y Petra desde Sharm (posición 47, más de 1.600 impresiones cada una)
   - Ordenar la estructura de traslados: hay posible canibalización entre la URL rusa y el post del blog.

## Tareas técnicas (código)
- **URLs sin prefijo de idioma:** los enlaces internos salen sin `/en`, `/ru` o `/tr`, y Google ya indexó 48 URLs `/trips/...`. Hay que corregir cómo se generan los enlaces y redirigir esas URLs con 301.
- **Erratas en los slugs:** `hurghad`, `0verday`, `nationa-park`, `kprl-canyon`, `istanbual`, `mosess`, `sphainx-egyaptian`. Se renombran y se redirigen con 301.
- **Hreflang:** agregar el `x-default` y corregir los hreflang que apuntan a páginas que redirigen o están rotas.
- **Sitemap:** quitar las URLs que dan errores 500 y 400.
- **Datos estructurados:** agregar Product o TouristTrip con AggregateRating y precio.
- **Meta descriptions:** acortar las que son demasiado largas.
- **JavaScript:** corregir los recursos JS que redirigen.
- **Rendimiento:** mejorar la carga lenta para los buscadores de IA.
- **Enlazado interno:** reforzarlo entre las páginas de destino y los tours.
- **Contenido:** quitar el texto en turco de las páginas en inglés («Organizasyon Detayları») y unificar los datos que se contradicen dentro de las fichas.
- **Páginas /google-ads/:** verificar que tengan noindex o canonical a su página de destino.
- **GA4:**
  - Dejar como eventos clave solo las reservas, WhatsApp, Telegram y los formularios.
  - Medir las reservas con su importe.
  - Excluir el tráfico de localhost y Vercel.
  - Clasificar ya.ru como búsqueda orgánica.
  - Revisar de dónde salen las sesiones con página de destino «(not set)».

## Pendientes
- Exportar el CSV completo de consultas de Yandex. Solo se analizaron 20 de las 2.951.
- Pedir acceso a Yandex Metrica para separar el tráfico orgánico de Yandex Direct.
- Confirmar con el cliente qué excursiones de Egipto están operando.
