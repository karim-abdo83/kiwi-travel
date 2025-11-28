import Script from 'next/script';

export default function Analytics() {
  return (
    <>
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-J2HS403HD2"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-J2HS403HD2');
        `}
      </Script>

      {/* Google Ads */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-17648501598"
        strategy="afterInteractive"
      />
      <Script id="google-ads" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-17648501598');
        `}
      </Script>

      {/* Yandex Metrica - defer loading */}
      <Script id="yandex-metrica" strategy="lazyOnLoad">
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
          ym(102724586, "init", {clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});
        `}
      </Script>
    </>
  );
}
