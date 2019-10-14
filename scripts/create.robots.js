const fs = require("fs");

console.log((process.env.NODE_ENV_SUB === "production" ? "운영계 " : "개발계 ") + "robots.txt 생성 시작. . .");

let robotsTxt;

if (process.env.NODE_ENV_SUB === "production") {
  robotsTxt = "User-agent: *\n" +
    // 크롤러 임시 접근 X
   /* "Disallow: /popular/\n" +
    "Disallow: /featured/\n" +
    "Disallow: /callback/\n" +
    "Disallow: /ca/\n" +  // content add
    "Disallow: /tr/\n" +  // tracking
    "Disallow: /td/\n" +  // tracking detail
    "Disallow: /f/\n" +   // faq
    "Disallow: /p/\n" +   // privacy
    "Disallow: /a/\n" +   // about
    "Disallow: /g/\n" +   // user guide
    "Disallow: /t/\n" +   // terms of service
    "Disallow: /n/\n" +   // not found page*/
    "Sitemap: https://www.polarishare.com/sitemap.xml\n";
} else {
  robotsTxt = "User-agent: *\n" +
    "Disallow: /\n" +
    "Sitemap: https://share.decompany.io/sitemap.xml\n";
}

fs.writeFileSync("public/robots.txt", robotsTxt);

console.log((process.env.NODE_ENV_SUB === "production" ? "운영계 " : "개발계 ") + "robots.txt 생성 완료. . .");
