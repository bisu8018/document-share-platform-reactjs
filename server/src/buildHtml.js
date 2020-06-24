const manifest = require('../build/asset-manifest.json');

module.exports = data => `
  <!DOCTYPE html>
  <html lang="en" prefix="og: http://ogp.me/ns#">
  
  <head>
    <title>${data.headerData.title}</title>
    <link rel="stylesheet" type="text/css"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:400,700|Material+Icons"/>
    <link href="/${manifest.files['main.css']}" rel="stylesheet">
        
    <meta charset="utf-8"/>
    <meta content='width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no' name='viewport'/>
    <meta name="msapplication-TileImage" content="/favicon/ms-icon-144x144.png"/>
    <meta name="msapplication-TileColor" content="#ffffff"/>
    <meta name="msapplication-config" content="./browserconfig.xml">

    <!--메타 태그-->
    <meta name="title" content='${data.headerData.title}'>
    <meta name="description" content='${data.headerData.title}'>
    <meta name="seoTitle" content='${data.headerData.seoTitle}'>    

    <!--트위터 태그-->
    <meta name="twitter:card" content='${data.headerData.twitter.card}'>
    <meta name="twitter:site" content='${data.headerData.twitter.site}'>
    <meta name="twitter:title" content='${data.headerData.twitter.title}'>
    <meta name="twitter:description" content='${data.headerData.twitter.description}'>
    <meta name="twitter:image" content='${data.headerData.twitter.image}'>
    <meta name="twitter:url" content='${data.headerData.twitter.url}'>

    <!--오픈그래프 태그-->
    <meta property="og:url" content='${data.headerData.og.url}'>
    <meta property="og:site_name" content='${data.headerData.og.site_name}'>
    <meta property="og:title" content='${data.headerData.og.title}'>
    <meta property="og:type" content='${data.headerData.og.type}'>
    <meta property="og:description" content='${data.headerData.og.description}'>
    <meta property="og:image:width" content='${data.headerData.og.image_width}'>
    <meta property="og:image:height" content='${data.headerData.og.image_height}'>

    <!--페이스북 태그-->
    <meta content="2237550809844881" property="fb:app_id" name="fb_app_id">

    <!--##META-TAG##-->

    <!--favicon-->
    <link rel="manifest" crossorigin="use-credentials" type="application/json" href="/manifest.json"/>
    <link rel="apple-touch-icon" sizes="57x57" href="/favicon/apple-icon-57x57.png"/>
    <link rel="apple-touch-icon" sizes="60x60" href="/favicon/apple-icon-60x60.png"/>
    <link rel="apple-touch-icon" sizes="72x72" href="/favicon/apple-icon-72x72.png"/>
    <link rel="apple-touch-icon" sizes="76x76" href="/favicon/apple-icon-76x76.png"/>
    <link rel="apple-touch-icon" sizes="114x114" href="/favicon/apple-icon-114x114.png"/>
    <link rel="apple-touch-icon" sizes="120x120" href="/favicon/apple-icon-120x120.png"/>
    <link rel="apple-touch-icon" sizes="144x144" href="/favicon/apple-icon-144x144.png"/>
    <link rel="apple-touch-icon" sizes="152x152" href="/favicon/apple-icon-152x152.png"/>
    <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-icon-180x180.png"/>
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon/android-icon-192x192.png"/>
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"/>
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png"/>
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"/>
        
    <script>           
       window.__PRELOADED_STATE__ = ${data.state ? JSON.stringify(data.state)
  .replace(/</g, '\\u003c') : 'undefined'};

      // 구글 광고 스크립트
      (adsbygoogle = window.adsbygoogle || []).push({
        google_ad_client: "ca-pub-2064031911940677",
        enable_page_level_ads: true
      });

      document.documentElement.addEventListener("touchstart", event => {
        if (event.touches.length > 1) event.preventDefault();
      }, false);
    </script>    
  </head>
  
  <body>
    <div id="root" style="opacity: 0">${data.html}</div>
    <script> 
       window.onload = () => document.getElementById('root').style.opacity = '1';        
       !function (l) {
          function e(e) {
            for (var r, t, n = e[0], o = e[1], u = e[2], f = 0, i = []; f < n.length; f++) t = n[f], p[t] && i.push(p[t][0]), p[t] = 0;
            for (r in o) Object.prototype.hasOwnProperty.call(o, r) && (l[r] = o[r]);
            for (s && s(e); i.length;) i.shift()();
            return c.push.apply(c, u || []), a();
          }
        
          function a() {
            for (var e, r = 0; r < c.length; r++) {
              for (var t = c[r], n = !0, o = 1; o < t.length; o++) {
                var u = t[o];
                0 !== p[u] && (n = !1);
              }
              n && (c.splice(r--, 1), e = f(f.s = t[0]));
            }
            return e;
          }
        
          var t = {},
            p = { 1: 0 },
            c = [];
        
          function f(e) {
            if (t[e]) return t[e].exports;
            var r = t[e] = {
              i: e,
              l: !1,
              exports: {}
            };
            return l[e].call(r.exports, r, r.exports, f), r.l = !0, r.exports;
          }
        
          f.m = l, f.c = t, f.d = function (e, r, t) {
            f.o(e, r) || Object.defineProperty(e, r, {
              enumerable: !0,
              get: t
            });
          }, f.r = function (e) {
            'undefined' != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }), Object.defineProperty(e, '__esModule', { value: !0 });
          }, f.t = function (r, e) {
            if (1 & e && (r = f(r)), 8 & e) return r;
            if (4 & e && 'object' == typeof r && r && r.__esModule) return r;
            var t = Object.create(null);
            if (f.r(t), Object.defineProperty(t, 'default', {
              enumerable: !0,
              value: r
            }), 2 & e && 'string' != typeof r) {
              for (var n in r) {
                f.d(t, n, function (e) {
                  return r[e];
                }.bind(null, n));
              }
            }
            return t;
          }, f.n = function (e) {
            var r = e && e.__esModule ? function () {
              return e.default;
            } : function () {
              return e;
            };
            return f.d(r, 'a', r), r;
          }, f.o = function (e, r) {
            return Object.prototype.hasOwnProperty.call(e, r);
          }, f.p = '/';
          var r = window.webpackJsonp = window.webpackJsonp || [],
            n = r.push.bind(r);
          r.push = e, r = r.slice();
          for (var o = 0; o < r.length; o++) e(r[o]);
          var s = n;
          a();
        }([]);
    </script>      
    <script type="text/javascript" src="/${manifest.files[Object.keys(manifest.files)[6]]}"></script>
    <script type="text/javascript" src="/${manifest.files['main.js']}"></script>     
  </body>    
  
 </html>`;
