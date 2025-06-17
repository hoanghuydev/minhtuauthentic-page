import { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import Script from 'next/script';
import { useEffect } from 'react';
import { GA_TRACKING_ID } from '../utils/gtag';

export default function Document() {
  return (
    <Html lang="vi">
      <Head>
        {process.env.NO_INDEX === 'true' && (
          <meta name="robots" content="noindex,nofollow" />
        )}

        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}');
            `,
          }}
        />

        <meta
          name="google-site-verification"
          content="5P0Wm8H0ZaYhmtLWPwgMqdt6Z-o-0rOd1XTfaPRNu78"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap"
          rel="stylesheet"
        />
        <script
          data-partytown-config
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `
              {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": "Minh Tu Authentic",
                "gmail": "nguyenminh20131659@gmail.com",
                "image":"https://minhtuauthentic.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.fc400164.png&w=640&q=75 ",
                "@id": "",
                "url": " https://minhtuauthentic.com/",
                "telephone": "0961693869",
                "address": {
                "@type": "PostalAddress",
                "streetAddress": "278 Hòa Bình, hiệp tân, Quận tân phú",
                "addressLocality": "Tp Hồ Chí Minh",
                "postalCode": "70000",
                "addressCountry": "VN"
                },
                "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
                ],
                "opens": "09:00",
                "closes": "21:00"
                },
                "sameAs": [
                " https://www.facebook.com/minhtuauthentic",
                " https://minhtuauthentic.com/",
                " https://shopee.vn/minhtu_authentic/",
                " https://www.yellowpages.vn/lgs/1187978532/minh-tu-authentic",
                " https://www.homepaylater.vn/doi-tac/minh-tu-authentic/"," https://toplist.vn/top/minh-tu-authentic-600215/", 
                "https://www.pinterest.com/MinhTuAuthentic/?actingBusinessId=1121537250862165663"
                ] 
              }
            `,
          }}
        />
        <script
          data-partytown-config
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `
                [
                    {"@context":"https://schema.org/","@type":"WebSite","@id":"https:// https://minhtuauthentic.com#website","headline":" minhtuauthentic.com ","name":" minhtuauthentic.com ","description":" Minh Tu Authentic, Shop nước hoa chính hãng uy tín Tphcm, Quận tân phú, Tân bình, Bình tân, sản phẩm khuyến mãi, Nước hoa trả góp, nước hoa chiết nam, chiết nữ, nuớc hoa Niche, đu bai, cao cấp, mỹ phẩm chính hãng.","url":"https://minhtuauthentic.com","potentialAction":{"@type":"SearchAction","target":"https://minhtuauthentic.com?s={search_term_string}","query-input":"required name=search_term_string"}},{"@context":"https://schema.org/","@type":"Organization","@id":"https://minhtuauthentic.com#Organization","name":"minhtuauthentic.com","url":"https://minhtuauthentic.com","sameAs":[],"logo":{"@type":"ImageObject","url":" https://minhtuauthentic.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.fc400164.png&w=640&q=75"}}
                ]
            `,
          }}
        />
        <script
          data-partytown-config
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `{
                "@context": "https://schema.org/",
                "@type": "CreativeWorkSeries",
                "name": "Minh Tu Authentic",
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.9",
                    "bestRating": "5",
                    "ratingCount": "3979"
                }
            }
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        <div id="bk-modal"></div>
      </body>
    </Html>
  );
}

// Document.getInitialProps = async (ctx: DocumentContext) => {
//   const cache = createCache();
//   const originalRenderPage = ctx.renderPage;
//   ctx.renderPage = () =>
//     originalRenderPage({
//       enhanceApp: (App) => (props) => (
//         <StyleProvider cache={cache}>
//           <App {...props} />
//         </StyleProvider>
//       ),
//     });
//
//   const initialProps: any = await Document.getInitialProps(ctx);
//   const style = extractStyle(cache, true);
//   return {
//     ...initialProps,
//     styles: (
//       <>
//         {initialProps.styles}
//         <style dangerouslySetInnerHTML={{ __html: style }} />
//       </>
//     ),
//   } as any;
// };
