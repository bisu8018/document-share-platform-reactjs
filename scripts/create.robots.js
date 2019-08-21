const fs = require("fs");

console.log((process.env.NODE_ENV_SUB === "production" ? "운영계 " : "개발계 ") + "robots.txt 생성 시작. . .");

let robotsTxt;

if (process.env.NODE_ENV_SUB === "production") {
  robotsTxt = "User-agent: *\n" +
    // 크롤러 임시 접근 X
    "Disallow: /\n" +
  /*  "Disallow: /about/\n" +
    "Disallow: /aboutus/\n" +
    "Disallow: /legal/\n" +
    "Disallow: /static/\n" +
    "Disallow: /faq/\n" +
    "Disallow: /guide/\n" +
    "Disallow: /terms/\n" +
    "Disallow: /main\n" +
    "Disallow: /latest\n" +
    "Disallow: /latest/\n" +
    "Disallow: /popular\n" +
    "Disallow: /featured\n" +
    "Disallow: /callback\n" +
    "Disallow: /tracking/\n" +
    "Disallow: /trackingDetail/\n" +
    "Disallow: /faq\n" +
    "Disallow: /policies\n" +
    "Disallow: /privacy\n" +
    "Disallow: /about\n" +
    "Disallow: /guide\n" +
    "Disallow: /terms\n" +
    "Disallow: /emailverify\n" +
    "Disallow: /signup\n" +
    "Disallow: /404\n" +*/
    "Sitemap: https://www.polarishare.com/sitemap.xml\n";
} else {
  robotsTxt = "User-agent: *\n" +
    "Disallow: /\n" +
    "Sitemap: https://share.decompany.io/sitemap.xml\n";
}

fs.writeFileSync("public/robots.txt", robotsTxt);

console.log((process.env.NODE_ENV_SUB === "production" ? "운영계 " : "개발계 ") + "robots.txt 생성 완료. . .");
