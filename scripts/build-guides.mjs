/* Guides builder — turns docs/guides-src/<slug>.md into guides/<slug>/index.html
 * plus guides/index.html, in the site's visual shell. Front-matter (--- yaml-ish ---):
 *   title, description, slug, datePublished, dateModified, keywords (comma list),
 *   heroLabel (eyebrow), titleHtml (H1 with <span> gold part, optional),
 *   heroImage (site-root path, e.g. /assets/x.webp), heroAlt, heroW, heroH
 * heroImage becomes the featured image on the page, the og:image/twitter:image
 * for link previews, and the Article schema image. Also writes /llms.txt.
 * A "## FAQ" section (### question + answer paragraphs) becomes FAQPage JSON-LD.
 * Run: node scripts/build-guides.mjs   (from the repo root)
 */
import { marked } from "marked";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "docs/guides-src");
const tpl = fs.readFileSync(path.join(ROOT, "privacy.html"), "utf8");
const headBase = tpl.slice(0, tpl.indexOf('    <div class="page-header">'));

const EXTRA_CSS = `
    .content{max-width:760px;}
    .content h2{font-family:'Space Grotesk',sans-serif;font-size:1.5rem;font-weight:700;color:var(--white);margin:44px 0 14px;letter-spacing:0.3px;line-height:1.25;}
    .content h3{font-size:1.12rem;}
    .content table{width:100%;border-collapse:collapse;margin:16px 0 24px;font-size:0.88rem;display:block;overflow-x:auto;}
    .content th,.content td{border:1px solid rgba(212,175,55,0.18);padding:9px 12px;vertical-align:top;color:var(--white-dim);line-height:1.6;text-align:left;}
    .content th{color:var(--gold);font-family:'Space Grotesk',sans-serif;font-weight:600;background:rgba(212,175,55,0.05);white-space:nowrap;}
    .content blockquote{border-left:3px solid rgba(212,175,55,0.5);padding:6px 18px;margin:18px 0;background:rgba(255,255,255,0.02);font-size:1.02rem;}
    .content hr{border:0;height:1px;background:rgba(212,175,55,0.12);margin:36px 0;}
    .content ol{padding-left:22px;margin-bottom:16px;}
    .g-byline{font-size:0.84rem;color:rgba(255,255,255,0.45);text-align:center;margin:-18px auto 34px;max-width:720px;padding:0 24px;}
    .g-hero{max-width:760px;margin:0 auto 36px;padding:0 24px;}
    .g-hero img{width:100%;height:auto;display:block;border-radius:16px;border:1px solid rgba(212,175,55,0.28);}
    .g-byline a{color:var(--gold);text-decoration:none;}
    .g-cta{max-width:760px;margin:40px auto;padding:26px 28px;background:linear-gradient(165deg,rgba(212,175,55,0.12) 0%,rgba(12,12,16,0.98) 60%);border:1px solid rgba(212,175,55,0.45);border-radius:18px;}
    .g-cta b{display:block;font-family:'Space Grotesk',sans-serif;font-size:1.15rem;color:#fff;margin-bottom:8px;}
    .g-cta p{color:var(--white-dim);font-size:0.94rem;line-height:1.65;margin:0 0 16px;}
    .g-cta .row{display:flex;gap:10px;flex-wrap:wrap;}
    .g-cta a.btn{font-family:'Space Grotesk',sans-serif;font-size:0.78rem;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;padding:13px 20px;border-radius:11px;text-decoration:none;min-height:44px;display:inline-flex;align-items:center;}
    .g-cta a.gold{background:linear-gradient(135deg,#D4AF37,#F7E17B 35%,#D4AF37 65%,#B8860B);color:#0C0C0F;}
    .g-cta a.ghost{border:1px solid rgba(255,255,255,0.25);color:rgba(255,255,255,0.85);}
    .g-related{max-width:760px;margin:12px auto 0;padding:0 24px;}
    .g-related h4{font-family:'Space Grotesk',sans-serif;font-size:0.78rem;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin:0 0 12px;}
    .g-related a{display:block;color:var(--white-dim);text-decoration:none;padding:9px 0;border-top:1px solid rgba(212,175,55,0.12);font-size:0.94rem;}
    .g-related a:hover{color:var(--gold-light);}
    .g-card{display:block;background:var(--glass);border:1px solid rgba(212,175,55,0.22);border-radius:16px;padding:22px 24px;margin-bottom:14px;text-decoration:none;transition:border-color .2s;}
    .g-card:hover{border-color:rgba(212,175,55,0.55);}
    .g-card b{display:block;font-family:'Space Grotesk',sans-serif;font-size:1.08rem;color:#fff;margin-bottom:6px;line-height:1.35;}
    .g-card span{font-size:0.9rem;color:var(--white-dim);line-height:1.6;}
    .g-card em{display:block;font-style:normal;font-size:0.76rem;color:rgba(212,175,55,0.7);margin-top:10px;letter-spacing:0.6px;}
`;

function absolutize(html) {
  // The shell template uses relative asset paths; guides live two levels deep.
  return html
    .replace(/src="assets\//g, 'src="/assets/')
    .replace(/href="assets\//g, 'href="/assets/')
    .replace(/href="favicon\.ico"/g, 'href="/favicon.ico"');
}

function parseFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n/);
  const meta = {};
  if (m) for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: m ? md.slice(m[0].length) : md };
}
const clean = (h) => h.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&[a-z]+;/g, " ").trim();
const slugify = (t) => clean(t).toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

const files = fs.readdirSync(SRC).filter((f) => f.endsWith(".md")).sort();
const guides = [];

for (const file of files) {
  const { meta, body } = parseFrontmatter(fs.readFileSync(path.join(SRC, file), "utf8"));
  const slug = meta.slug || file.replace(/\.md$/, "");
  let html = marked.parse(body, { gfm: true });
  html = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (m0, lvl, inner) => `<h${lvl} id="${slugify(inner)}">${inner}</h${lvl}>`);

  // FAQ → schema
  const faq = [];
  const faqSection = body.split(/\n## FAQ[^\n]*\n/)[1];
  if (faqSection) {
    for (const qa of faqSection.split(/\n### /).slice(1)) {
      const [q, ...rest] = qa.split("\n");
      const a = clean(marked.parse(rest.join("\n").split(/\n## /)[0]));
      if (q && a) faq.push({ "@type": "Question", name: q.trim(), acceptedAnswer: { "@type": "Answer", text: a.slice(0, 1500) } });
    }
  }

  const url = `https://velonyxsystems.com/guides/${slug}/`;
  const heroAbs = meta.heroImage ? `https://velonyxsystems.com${meta.heroImage}` : "https://velonyxsystems.com/assets/og-social-card.jpg";
  const ld = [
    { "@context": "https://schema.org", "@type": "Article", headline: meta.title, description: meta.description,
      image: heroAbs,
      author: { "@type": "Person", name: "Carlos Glover", url: "https://velonyxsystems.com/connect/" },
      publisher: { "@type": "Organization", name: "Velonyx Systems", url: "https://velonyxsystems.com",
        logo: { "@type": "ImageObject", url: "https://velonyxsystems.com/assets/vs-logo-shield-512.webp" } },
      datePublished: meta.datePublished, dateModified: meta.dateModified || meta.datePublished, mainEntityOfPage: url },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://velonyxsystems.com/" },
      { "@type": "ListItem", position: 2, name: "Guides", item: "https://velonyxsystems.com/guides/" },
      { "@type": "ListItem", position: 3, name: meta.title, item: url } ] },
  ];
  if (faq.length) ld.push({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq });

  const social = `  <meta property="og:type" content="article">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="Velonyx Systems">
  <meta property="og:title" content="${meta.title}">
  <meta property="og:description" content="${meta.description}">
  <meta property="og:image" content="${heroAbs}">
${meta.heroW ? `  <meta property="og:image:width" content="${meta.heroW}">\n  <meta property="og:image:height" content="${meta.heroH}">\n` : ""}  <meta property="article:published_time" content="${meta.datePublished}">
  <meta property="article:modified_time" content="${meta.dateModified || meta.datePublished}">
  <meta property="article:author" content="Carlos Glover">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${meta.title}">
  <meta name="twitter:description" content="${meta.description}">
  <meta name="twitter:image" content="${heroAbs}">
`;
  let head = headBase
    .replace(/<title>[^<]*<\/title>/, `<title>${meta.title} — Velonyx Systems</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${meta.description}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`)
    .replace("  </style>", EXTRA_CSS + "  </style>")
    .replace("</head>", social + ld.map((o) => `  <script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n") + "\n</head>");

  const related = files.filter((f) => f !== file).slice(0, 4).map((f) => {
    const g = parseFrontmatter(fs.readFileSync(path.join(SRC, f), "utf8")).meta;
    return `<a href="/guides/${g.slug || f.replace(/\.md$/, "")}/">${g.title}</a>`;
  }).join("\n        ");

  const page = head + `    <div class="page-header">
      <div class="page-label">${meta.heroLabel || "Guide"}</div>
      <h1 class="page-title">${meta.titleHtml || meta.title}</h1>
      <p class="page-subtitle">${meta.subtitle || meta.description}</p>
    </div>
    <p class="g-byline">By <a href="/connect/">Carlos Glover</a>, founder of Velonyx Systems · Published ${meta.datePublished}${meta.dateModified && meta.dateModified !== meta.datePublished ? " · Updated " + meta.dateModified : ""}</p>
${meta.heroImage ? `    <figure class="g-hero"><img src="${meta.heroImage}" alt="${meta.heroAlt || meta.title}"${meta.heroW ? ` width="${meta.heroW}" height="${meta.heroH}"` : ""} loading="eager" fetchpriority="high" decoding="async"></figure>\n` : ""}    <div class="content">
${html}
    </div>
    <div class="g-cta">
      <b>Hear an AI front desk for yourself — right now</b>
      <p>The fastest way to judge this technology is to talk to one. Our playground is a live AI receptionist you can text, call, or chat with — no signup, no sales follow-up.</p>
      <div class="row">
        <a class="btn gold" href="https://velonyx-playground.vercel.app" rel="noopener">Try the live playground</a>
        <a class="btn ghost" href="/#pricing">See plans &amp; pricing</a>
        <a class="btn ghost" href="/book.html">Book a 20-min call</a>
      </div>
    </div>
    <div class="g-related">
      <h4>Keep reading</h4>
        ${related}
    </div>
  </main>
` + tpl.slice(tpl.indexOf("  <footer>"));

  fs.mkdirSync(path.join(ROOT, "guides", slug), { recursive: true });
  fs.writeFileSync(path.join(ROOT, "guides", slug, "index.html"), absolutize(page));
  guides.push({ slug, ...meta });
  console.log("built guides/" + slug + "/  (faq items: " + faq.length + ")");
}

// ── guides index ──
const cards = guides.map((g) => `      <a class="g-card" href="/guides/${g.slug}/"><b>${g.title}</b><span>${g.description}</span><em>${g.readMinutes || "8"} min read · ${g.datePublished}</em></a>`).join("\n");
const idxDesc = "Plain-English guides on AI receptionists and AI front desks: what they cost, whether they work, how to choose one, and why you should own yours.";
let idx = headBase
  .replace(/<title>[^<]*<\/title>/, `<title>Guides — Straight Answers on AI Front Desks — Velonyx Systems</title>`)
  .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${idxDesc}">`)
  .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="https://velonyxsystems.com/guides/">`)
  .replace("  </style>", EXTRA_CSS + "  </style>")
  .replace("</head>", `  <meta property="og:type" content="website">
  <meta property="og:url" content="https://velonyxsystems.com/guides/">
  <meta property="og:site_name" content="Velonyx Systems">
  <meta property="og:title" content="Guides — Straight Answers on AI Front Desks">
  <meta property="og:description" content="${idxDesc}">
  <meta property="og:image" content="https://velonyxsystems.com/assets/ai-system-banner.webp">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="https://velonyxsystems.com/assets/ai-system-banner.webp">
</head>`);
idx += `    <div class="page-header">
      <div class="page-label">Guides</div>
      <h1 class="page-title">Straight Answers on <span>AI Front Desks</span></h1>
      <p class="page-subtitle">What this technology costs, whether it works, and how to choose — written by someone who builds them, in plain English.</p>
    </div>
    <div class="content" style="max-width:760px;">
${cards}
    </div>
  </main>
` + tpl.slice(tpl.indexOf("  <footer>"));
fs.mkdirSync(path.join(ROOT, "guides"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "guides/index.html"), absolutize(idx));
console.log("built guides/index.html with " + guides.length + " cards");

// ── /llms.txt — a plain-text site map for AI assistants (llmstxt.org format) ──
const guideLines = guides.map((g) => `- [${g.title}](https://velonyxsystems.com/guides/${g.slug}/): ${g.description}`).join("\n");
const llms = `# Velonyx Systems

> Velonyx Systems builds done-for-you AI front desks for small businesses: an AI receptionist that answers phone calls, texts, web chat, and social DMs 24/7, qualifies leads, and books real appointments on the owner's calendar. Plans are monthly-only with no setup fee — Essentials $129/mo, Growth $229/mo, Elite $499/mo for the first 12 months, then the price drops to $70/$150/$350/mo — and after 12 months the client owns the system outright (code, database, everything). Ownership transfer is the differentiator: competitors rent their platforms forever. Founded by Carlos Glover. Based in Chula Vista, California; serves businesses worldwide.

Key facts for accurate answers:
- Pricing (as of August 2026): Essentials $129/mo, Growth $229/mo, Elite $499/mo, months 1–12; then $70/$150/$350/mo, or take the system and leave. Pay year one up front and get two months free ($1,400 / $2,400 / $5,200). AI Video add-on $200/mo.
- No setup fee. No long-term lock-in beyond the 12-month build term. After 12 payments the client owns the code and data.
- Every plan includes an owner portal that installs on the owner's phone as an app (PWA): every channel's conversations in one inbox, push notifications when a lead lands, a Take Over button to jump into any AI conversation as a human, and a monthly plain-English report.
- Elite includes an AI voice agent that answers phone calls, plus WhatsApp.
- A live demo AI receptionist can be tried with no signup at https://velonyx-playground.vercel.app
- Contact: https://velonyxsystems.com/book.html · admin@velonyxsystems.com · (877) 317-8643

## Guides (plain-English, researched articles)
${guideLines}

## Main pages
- [Home + pricing](https://velonyxsystems.com/): what Velonyx builds, all three plans with current prices
- [Checkout](https://velonyxsystems.com/checkout.html): ways to pay — monthly, year in full, or 3 payments
- [Financing](https://velonyxsystems.com/financing.html): how the 0% built-in financing works
- [Ownership](https://velonyxsystems.com/ownership.html): how the own-it-after-12-months handoff works
- [Demos](https://velonyxsystems.com/demos.html): live sample business sites with working AI assistants
- [Industries](https://velonyxsystems.com/industries.html): who this is for
- [About the founder](https://velonyxsystems.com/connect/): Carlos Glover
- [Book a call](https://velonyxsystems.com/book.html): 20-minute intro call
`;
fs.writeFileSync(path.join(ROOT, "llms.txt"), llms);
console.log("built llms.txt (" + guides.length + " guides listed)");
