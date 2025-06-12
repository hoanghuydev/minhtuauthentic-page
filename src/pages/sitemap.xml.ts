import { SlugDto } from '@/dtos/Slug.dto';

function generateSiteMap(items: SlugDto[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>${process.env.NEXT_PUBLIC_APP_URL}</loc>
     </url>
      <url>
       <loc>${process.env.NEXT_PUBLIC_APP_URL}/kiem-tra-don-hang</loc>
     </url>
      <url>
       <loc>${process.env.NEXT_PUBLIC_APP_URL}/san-pham</loc>
     </url>
     <url>
       <loc>${process.env.NEXT_PUBLIC_APP_URL}/thuong-hieu</loc>
     </url>
      <url>
       <loc>${process.env.NEXT_PUBLIC_APP_URL}/tin-tuc</loc>
     </url>
     <url>
       <loc>${process.env.NEXT_PUBLIC_APP_URL}/tai-khoan/lich-su</loc>
     </url>
     <url>
       <loc>${process.env.NEXT_PUBLIC_APP_URL}/tai-khoan/thong-tin-tai-khoan</loc>
     </url>
     <url>
       <loc>${process.env.NEXT_PUBLIC_APP_URL}/tai-khoan/dang-ky</loc>
     </url>
     <url>
       <loc>${process.env.NEXT_PUBLIC_APP_URL}/tai-khoan/dang-nhap</loc>
     </url>
     <url>
       <loc>${process.env.NEXT_PUBLIC_APP_URL}/gio-hang/thanh-toan</loc>
     </url>
     <url>
       <loc>${process.env.NEXT_PUBLIC_APP_URL}/gio-hang/tom-tat</loc>
     </url>
     ${items
       .map(({ slug }) => {
         return `
       <url>
 <loc>${`${process.env.NEXT_PUBLIC_APP_URL}/${slug}`}</loc>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

export async function getServerSideProps({ res }: any) {
  // We make an API call to gather the URLs for our site
  const request = await fetch(process.env.BE_URL + '/api/pages/slug/list/all');
  const posts: { data: SlugDto[] } = await request.json();
  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(posts?.data || []);

  res.setHeader('Content-Type', 'text/xml');
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export default SiteMap;
