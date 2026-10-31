import { readFile, writeFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { games, socials } from './games.mjs';

const root = new URL('../', import.meta.url);
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const arrow = '<span class="arrow" aria-hidden="true">↗</span>';
const right = '<span class="arrow" aria-hidden="true">→</span>';
const year = new Date().getFullYear();
const brand = `<img class="brand-mark" src="/images/web/mark.webp" alt="" width="35" height="35"><span><img class="brand-wordmark" src="/images/web/wordmark.webp" alt="Appocalypse" width="178" height="47"><small>INDEPENDENT GAME STUDIO</small></span>`;

function header(active) {
  const links = [['Home', '/'], ['Games', '/games'], ['The studio', '/about-us'], ['Support', '/support']];
  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header"><div class="container header-inner">
  <a class="brand" href="/" aria-label="Appocalypse Games home">${brand}</a>
  <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation"><span>Menu</span><span class="menu-icon" aria-hidden="true"></span></button>
  <nav class="primary-navigation" id="primary-navigation" aria-label="Main navigation">${links.map(([label, href]) => `<a href="${href}"${active === href ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
    <a class="button" href="/games#catalogue">Let’s play ${arrow}</a>
  </nav>
</div></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="container">
  <div class="footer-top"><div class="footer-brand"><a class="brand" href="/" aria-label="Appocalypse Games home">${brand}</a><p>Small studio. Big ideas. Always indie.</p></div>
  <div class="footer-links"><div><h2>Explore</h2><a href="/games">Our games</a><a href="/about-us">The studio</a><a href="/support">Get support</a></div>
  <div><h2>Follow along</h2>${socials.slice(0, 3).map(([label, url]) => `<a href="${escape(url)}">${label} ↗</a>`).join('')}</div>
  <div><h2>Elsewhere</h2>${socials.slice(3).map(([label, url]) => `<a href="${escape(url)}">${label} ↗</a>`).join('')}</div></div></div>
  <div class="footer-bottom"><span>© 2016–<span data-year>${year}</span> Appocalypse Games. All rights reserved.</span><a href="/privacy-policy">Privacy policy</a><span class="footer-signoff">Made with an independent spirit.</span></div>
</div></footer>`;
}

function page({ title, description, route = '/', active = route, body, image = '/images/web/bowling-over-it-2.webp', schema }) {
  const url = 'https://appocalypsegames.com' + route;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(title)}</title>
  <meta name="description" content="${escape(description)}">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#11130f">
  <link rel="canonical" href="${url}">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="/styles.css">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Appocalypse Games">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(description)}">
  <meta property="og:image" content="https://appocalypsegames.com${image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escape(title)}">
  <meta name="twitter:description" content="${escape(description)}">
  <meta name="twitter:image" content="https://appocalypsegames.com${image}">
  <meta name="google-adsense-account" content="ca-pub-7323401413378084">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7323401413378084" crossorigin="anonymous"></script>
  <script src="/site.js" defer></script>
${schema ? `  <script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>` : ''}
  <noscript><style>@media(max-width:760px){.site-header{position:static}.header-inner{height:auto;flex-wrap:wrap;padding-block:20px}.menu-toggle{display:none}.primary-navigation{display:flex;position:static;flex-basis:100%;padding:0;border:0;box-shadow:none}}</style></noscript>
</head>
<body>
${header(active)}
<main id="main" tabindex="-1">${body}</main>
${footer()}
</body>
</html>
`;
}

function card(game) {
  const landscape = !game.portrait;
  const image = landscape ? `${game.slug}-${game.slug === 'bowling-over-it' ? 1 : 2}.webp` : `${game.slug}-cover.webp`;
  return `<article class="game-card" data-platforms="${game.platforms.join(' ')}" style="--card-color:${game.color}">
  <a class="card-art${landscape ? '' : ' is-cover'}" href="/games/${game.slug}" aria-label="Explore ${escape(game.name + (game.subtitle ? ' — ' + game.subtitle : ''))}">
    <img src="/images/web/${image}" alt="${escape(game.name)} ${landscape ? 'gameplay' : 'artwork'}" loading="lazy" width="640" height="442">
    <span class="card-genre">${game.genre}</span><span class="card-open" aria-hidden="true">↗</span>
  </a>
  <h3><a href="/games/${game.slug}">${escape(game.name)}${game.subtitle ? ` <span>— ${escape(game.subtitle)}</span>` : ''}</a></h3>
  <div class="card-meta">${game.platforms.map(platform => `<span>${platform}</span>`).join('')}<span>${game.genre}</span></div>
  <p>${escape(game.short)}</p>
</article>`;
}

function community() {
  return `<section class="community container" aria-labelledby="community-title"><div class="community-panel"><div><span class="eyebrow">There’s more where that came from</span><h2 id="community-title">Come for the games.<br>Stay for the chaos.</h2><p>New ideas, behind the scenes, and whatever we dream up next.</p></div><a class="button" href="https://www.instagram.com/appocalypsegames/">Follow our adventures ${arrow}</a></div></section>`;
}

// Real platform artwork, downloaded from the platforms' own asset endpoints.
// PNG copies preserve the supplied design; no brand marks are drawn in code.
const storeArtwork = {
  'Steam': ['steam', 480, 146],
  'App Store': ['app-store', 480, 160],
  'Google Play': ['google-play', 564, 168],
  'itch.io': ['itch-io', 480, 123]
};
function storeImage(label) {
  const [file, width, height] = storeArtwork[label];
  return `<img class="platform-logo platform-logo-${file}" src="/images/brands/${file}.png" alt="${label}" width="${width}" height="${height}" loading="lazy">`;
}
function storeDownload(label, url) {
  if (!storeArtwork[label]) return `<a class="button button-outline" href="${escape(url)}">${label} ${arrow}</a>`;
  return `<a class="store-download store-${storeArtwork[label][0]}" href="${escape(url)}" aria-label="Find the game on ${label}">${storeImage(label)}</a>`;
}

const home = `<section class="hero container" aria-labelledby="home-title">
  <div class="hero-topline"><span class="eyebrow">Independent minds. Unexpected games.</span><span class="hero-coordinate">EST. 2016 &nbsp; / &nbsp; SALAMANCA, SPAIN</span></div>
  <div class="hero-layout"><div class="hero-copy"><h1 id="home-title">Small studio.<br>Big ideas.<br><span class="accent">Press play.</span></h1><p>We’re Appocalypse Games. An independent studio making curious worlds, unexpected challenges, and games with a mind of their own.</p><div class="hero-actions"><a class="button" href="#our-games">Explore our games ${arrow}</a><a class="text-link" href="/about-us">Meet the studio ${right}</a></div></div>
  <div class="hero-art"><a class="feature-art" href="/games/bowling-over-it" aria-label="Discover Bowling Over It"><img src="/images/web/bowling-over-it-2.webp" alt="An astronaut swings a bowling ball beside Jupiter in Bowling Over It" width="1440" height="810" fetchpriority="high"><div class="feature-top"><span class="badge">In the spotlight</span><span class="feature-index">01 / 06</span></div><div class="feature-bottom"><div><p>PHYSICS. PERSISTENCE. ONE MORE TRY.</p><h2>Bowling Over It</h2></div><span class="circle-link" aria-hidden="true">↗</span></div></a><div class="orbit-stamp" aria-hidden="true">100%<span>✳</span>INDIE SPIRIT</div></div></div>
  <div class="hero-footnote"><a class="scroll-cue" href="#our-games">Good things ahead ↓</a><span>Made with curiosity. Played your way.</span></div>
</section>
<div class="platform-strip"><div class="container platform-inner"><span class="platform-caption">Find us on your favourite platform</span><a class="store-link" href="https://apps.apple.com/us/developer/eduardo-nunez-matas/id1489994354">${storeImage('App Store')}</a><a class="store-link" href="https://store.steampowered.com/search/?developer=Appocalypse%20Games&amp;ndl=1">${storeImage('Steam')}</a><a class="store-link" href="https://play.google.com/store/apps/dev?id=8676992905604252831">${storeImage('Google Play')}</a><a class="store-link" href="https://appocalypsegames.itch.io">${storeImage('itch.io')}</a></div></div>
<section class="container section" id="our-games" aria-labelledby="our-games-title"><div class="section-heading"><div><span class="eyebrow">The good stuff</span><h2 id="our-games-title">Find your next<br>“one more try”.</h2></div><a class="text-link" href="/games">All games ${arrow}</a></div><div class="game-grid">${games.map(card).join('')}</div><div class="section-end"><a class="button button-outline" href="/games">Find your kind of game ${right}</a></div></section>
<section class="manifesto section" aria-labelledby="manifesto-title"><div class="container manifesto-grid"><div><span class="eyebrow">A little about us</span><h2 id="manifesto-title">Independent.<br>Curious.<br><em>Playfully different.</em></h2></div><div class="manifesto-copy"><p>We believe the best ideas start with “what if?”. What if bowling took you to space? What if the real adventure was underneath the football pitch?</p><p>Since 2016, we’ve been turning our curiosity into games. Different worlds. Different ways to play. The same independent spirit.</p><a class="text-link" href="/about-us">This is Appocalypse ${arrow}</a><div class="studio-stats"><div><strong>2016</strong><span>Our first chapter</span></div><div><strong>06</strong><span>Games. And counting.</span></div></div></div></div></section>
${community()}`;

await writeFile(new URL('index.html', root), page({ title: 'Appocalypse Games — Small Studio. Big Ideas. Press Play.', description: 'Independent minds. Unexpected games. Discover Bowling Over It, Beyond the Pitch, Dr. Machine and more from Appocalypse Games, an indie studio founded in 2016.', body: home, schema: { '@context': 'https://schema.org', '@type': 'Organization', name: 'Appocalypse Games', url: 'https://appocalypsegames.com/', logo: 'https://appocalypsegames.com/android-chrome-512x512.png', foundingDate: '2016', email: 'appocalypse333@gmail.com', sameAs: [...socials.map(([, url]) => url), 'https://appocalypsegames.itch.io'] } }));

await writeFile(new URL('games.html', root), page({ title: 'Our Games — Appocalypse Games', description: 'Explore all six Appocalypse games. Find your next indie adventure on PC or mobile, from Bowling Over It to Beyond the Pitch.', route: '/games', body: `<header class="container page-intro"><span class="eyebrow">The Appocalypse collection</span><h1>Different worlds.<br><em>Your next game.</em></h1><p>A little strange. A lot of fun. Explore our collection and find the game that speaks to your kind of player.</p></header><section class="container catalogue" id="catalogue" aria-label="Game catalogue"><div class="catalogue-toolbar"><div class="filters" data-filters hidden role="group" aria-label="Filter games by platform">${['All', 'PC', 'Mobile'].map((filter, i) => `<button type="button" data-filter="${filter}" aria-pressed="${i === 0}">${filter === 'All' ? 'All games' : filter}</button>`).join('')}</div><span class="result-count" data-result-count role="status" aria-live="polite">06 games</span></div><div class="game-grid">${games.map(card).join('')}</div></section>${community()}` }));

for (const game of games) {
  const fullName = game.name + (game.subtitle ? ' — ' + game.subtitle : '');
  const screenshots = Array.from({ length: game.shots }, (_, i) => i + 1);
  const body = `<header class="container game-intro"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/games">Games</a><span aria-hidden="true">/</span><span aria-current="page">${escape(game.name)}</span></nav><div class="game-intro-layout"><div><span class="eyebrow">${game.genre} / Appocalypse Games</span><h1>${escape(game.name)}${game.subtitle ? `<small>${escape(game.subtitle)}</small>` : ''}</h1><p class="tagline">${escape(game.tagline)}</p><div class="platform-chips">${game.platforms.map(platform => `<span class="platform-chip">${platform}</span>`).join('')}</div></div><a class="button" href="#get-the-game">Get the game ${arrow}</a></div></header>
<section class="container game-gallery${game.portrait ? ' gallery-portrait' : ''}" data-gallery aria-label="${escape(game.name)} screenshots"><div class="gallery-stage">${screenshots.map((n, i) => `<img class="gallery-slide" src="/images/web/${game.slug}-${n}.webp" alt="${escape(fullName)} — gameplay screenshot ${n}" width="${game.portrait ? 665 : 1440}" height="${game.portrait ? 1440 : 810}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}>`).join('')}</div><div class="gallery-toolbar"><span class="gallery-caption">A closer look / In-game screenshots</span><div class="gallery-controls" data-gallery-control hidden><button type="button" data-prev aria-label="Previous screenshot">←</button><span class="gallery-count" data-slide-count role="status" aria-live="polite">1 / ${game.shots}</span><button type="button" data-next aria-label="Next screenshot">→</button></div></div><div class="gallery-thumbs" data-gallery-control hidden role="group" aria-label="Choose a screenshot">${screenshots.map((n, i) => `<button type="button" data-slide="${i}" aria-label="Show screenshot ${n}" aria-pressed="${i === 0}"><img src="/images/web/${game.slug}-${n}.webp" alt="" width="240" height="135" loading="lazy"></button>`).join('')}</div></section>
<section class="container game-information" aria-labelledby="about-game-title"><div><h2 id="about-game-title">About the game.</h2><p>${escape(game.description)}</p><a class="text-link" href="/support">Need a hand? We’re here ${arrow}</a></div><div id="get-the-game"><span class="eyebrow">Your next move</span><h2 style="margin-top:17px">Find it on your platform.</h2><div class="store-buttons">${[...game.stores].sort(([a], [b]) => (a === 'App Store' ? -1 : b === 'App Store' ? 1 : 0)).map(([label, url]) => storeDownload(label, url)).join('')}</div><a class="text-link" href="/privacy-policy/${game.slug}">Game privacy policy ${arrow}</a></div></section>
<section class="related" aria-labelledby="related-title"><div class="container"><div class="section-heading"><div><span class="eyebrow">Keep exploring</span><h2 id="related-title">More from our world.</h2></div><a class="text-link" href="/games">All games ${arrow}</a></div><div class="game-grid">${games.filter(item => item !== game).slice(0, 3).map(card).join('')}</div></div></section>`;
  await writeFile(new URL(`games/${game.slug}.html`, root), page({ title: `${fullName} — Appocalypse Games`, description: `${game.tagline} ${game.short} Discover screenshots and find ${game.name} on ${game.stores.map(([label]) => label).join(', ')}.`, route: `/games/${game.slug}`, active: '/games', image: `/images/web/${game.slug}-cover.webp`, body, schema: { '@context': 'https://schema.org', '@type': 'VideoGame', name: fullName, description: game.description, genre: game.genre, gamePlatform: game.platforms, image: `https://appocalypsegames.com/images/web/${game.slug}-cover.webp`, url: `https://appocalypsegames.com/games/${game.slug}`, publisher: { '@type': 'Organization', name: 'Appocalypse Games', url: 'https://appocalypsegames.com/' } } }));
}

await writeFile(new URL('about-us.html', root), page({ title: 'The Studio — Appocalypse Games', description: 'Meet Appocalypse Games. An independent game studio from Salamanca, Spain, turning curiosity into games since 2016.', route: '/about-us', body: `<header class="container page-intro"><span class="eyebrow">Hello. We’re Appocalypse.</span><h1>Small by choice.<br><em>Curious by nature.</em></h1><p>We’re an independent game studio from Salamanca, Spain. Since 2016, we’ve been making games that follow our curiosity. Wherever it takes us.</p></header><div class="studio-visual"><div class="container"><img src="/images/web/studio-panel.webp" alt="A collection of characters, objects and worlds from Appocalypse games" width="2000" height="417"></div></div><section class="container section" aria-labelledby="studio-title"><div class="manifesto-grid"><div><span class="eyebrow">Our way of making games</span><h2 id="studio-title" style="font-size:clamp(40px,5vw,70px)">Good games start<br>with a <span style="color:var(--accent)">“what if?”.</span></h2></div><div class="manifesto-copy"><p>For us, making games is about exploring an idea and seeing how far it can go. Sometimes that means swinging a bowling ball through space. Sometimes it means finding out what’s hiding below a football pitch.</p><p>Our games take different shapes, but they share the same spirit: a love of play, a taste for the unexpected, and the freedom to try something different.</p><a class="text-link" href="/games">Explore what we make ${arrow}</a></div></div><div class="values"><article class="value"><span>01 / CURIOSITY</span><h3>Follow the weird idea.</h3><p>The unexpected is a great place to start. We give unusual ideas room to become something worth playing.</p></article><article class="value"><span>02 / CRAFT</span><h3>Make every try count.</h3><p>We care about the little things. The feel of a mechanic, a surprising detail, and the urge to give it another go.</p></article><article class="value"><span>03 / COMMUNITY</span><h3>Keep the conversation going.</h3><p>Games are better with people. Your feedback and experiences help us keep learning and making.</p></article></div></section><section class="community container" aria-labelledby="contact-title"><div class="community-panel"><div><span class="eyebrow">Say hello</span><h2 id="contact-title">Let’s make a connection.</h2><p>Questions, press, collaborations, or just a good game recommendation.</p></div><a class="button" href="mailto:appocalypse333@gmail.com">Get in touch ${arrow}</a></div></section>` }));

await writeFile(new URL('support.html', root), page({ title: 'Player Support — Appocalypse Games', description: 'Need a hand with an Appocalypse game? Get in touch, report an issue, or find help with our games on PC and mobile.', route: '/support', body: `<header class="container page-intro"><span class="eyebrow">Player support</span><h1>Stuck? Let’s get you<br><em>back in the game.</em></h1><p>Something not working, a question, or an idea to share? We’re here to help.</p></header><div class="container support-layout"><section class="contact-panel" aria-labelledby="support-contact-title"><span class="eyebrow">A direct line to the studio</span><h2 id="support-contact-title">Let’s figure it out.</h2><p>Tell us which game you’re playing and what’s happening. The more details you can share, the easier it is for us to help.</p><a class="email-link" href="mailto:appocalypse333@gmail.com">appocalypse333@gmail.com</a><a class="button" href="mailto:appocalypse333@gmail.com?subject=Game%20support">Email the studio ${arrow}</a><div class="support-hours"><strong>Support hours</strong>Monday–Friday, 9:00–18:00 (local studio time).<br>We aim to reply within 24 business hours.</div></section><section class="faq" aria-labelledby="faq-title"><h2 id="faq-title">A good place to start.</h2><details open><summary>How do I report a problem?</summary><p>Email us with these details so we can take a closer look:</p><ul><li>The game name and version.</li><li>Your device and operating system.</li><li>What happened and the steps to reproduce it.</li><li>A screenshot, if you have one.</li></ul></details><details><summary>Where can I find your games?</summary><p>Visit <a href="/games">our games</a>, choose a title, and follow the links to its official stores. Each game page lists its platforms.</p></details><details><summary>Can I share feedback or an idea?</summary><p>Absolutely. Send your thoughts to <a href="mailto:appocalypse333@gmail.com">appocalypse333@gmail.com</a>. We love hearing about your experience with our games.</p></details><details><summary>Where is the privacy policy for my game?</summary><p>Each game page has a link to its own privacy policy beneath the store buttons. You can also read our <a href="/privacy-policy">website privacy policy</a>.</p></details></section></div>` }));

// Legal copy is preserved verbatim; only its page shell and typography change.
for (const name of await readdir(new URL('content/privacy/', root))) {
  if (!name.endsWith('.html')) continue;
  const body = await readFile(new URL(`content/privacy/${name}`, root), 'utf8');
  const website = name === 'website.html';
  const slug = name.replace('.html', '');
  const game = games.find(item => item.slug === slug);
  const label = website ? 'Appocalypse Games' : game ? game.name + (game.subtitle ? ' — ' + game.subtitle : '') : 'Illuminati Hand';
  const route = website ? '/privacy-policy' : `/privacy-policy/${slug}`;
  const output = website ? 'privacy-policy.html' : `privacy-policy/${name}`;
  await writeFile(new URL(output, root), page({ title: `Privacy Policy — ${label}`, description: `Privacy Policy for ${label}.`, route, active: '', body: `<article class="container privacy-document"><a class="text-link privacy-back" href="${game ? `/games/${game.slug}` : '/'}">← Back to ${game ? escape(game.name) : 'Appocalypse Games'}</a>${body}</article>` }));
}

console.log(`Built homepage, catalogue, 6 game pages, studio, support and 8 privacy pages in ${fileURLToPath(root)}`);
