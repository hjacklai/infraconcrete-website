#!/usr/bin/env bash
# Generates service × state combo SEO pages.
# Idempotent: re-runs overwrite. Skip files by adding their slugs to SKIP[].
# Run from repo root: bash scripts/gen-combos.sh
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# ---- Service catalog ----
# slug:Display Name:family-anchor:short methodology blurb
declare -a SERVICES=(
  "soil-nailing|Soil Nailing|cap-soil-nailing|Steel reinforcing bars drilled at engineered angles, grouted in place, and faced with shotcrete or panel cladding. To BS 8006-2, FHWA-NHI-14-007, JKR Slope Specifications."
  "guniting|Guniting & Shotcrete|cap-guniting|Wet-mix and dry-mix sprayed concrete on slope and rock faces. To ACI 506, EN 14487, JKR. The structural skin on soil-nailed and rock-bolted slopes."
  "rock-bolting|Rock Bolting|cap-rock-bolting|Tensioned and grouted rock anchors for cut rock faces, tunnel portals, and quarry benches. To BS 8081, EN 1537, AASHTO, JKR."
  "rock-netting|Rock Netting|cap-rock-netting|High-tensile steel mesh anchored over the rock face, catching loose debris before it reaches the road or rail line below."
  "slope-stabilization|Slope Stabilization|cap-slope-stabilization|Integrated systems combining soil nailing, guniting, drainage, and ground anchors as one engineered solution. JKR Class I-IV."
  "rockfall-barrier|Rockfall Barriers|cap-rockfall-barrier|Energy-rated flexible barriers (100 kJ to 5000 kJ), drape mesh, and dynamic netting. To ETAG 027 / EAD 340059."
  "retaining-walls|Retaining Walls|cap-retaining|Reinforced earth (MSE), modular concrete blocks, RC cantilever, sheet piling, soldier piles, and anchored walls. To BS 8002, BS 8004, BS EN 1997 (Eurocode 7)."
  "land-creation|Land Creation & Earthworks|cap-landcreation|Cut-and-fill platforms, infill across natural terrain, slope cuts, embankments. JKR-spec earthworks delivered with our own fleet."
  "horizontal-drains|Horizontal Drains|cap-slope-stabilization|Drilled subsurface drains that lower the groundwater table by gravity. To BS 6031, JKR. Often the single most effective slope-stabilization measure when groundwater is the failure driver."
)

# ---- State catalog ----
# slug:Display Name:cities pipe-separated:state-context-paragraph
declare -a STATES=(
  "klang-valley|Klang Valley|Kuala Lumpur#Petaling Jaya#Shah Alam#Subang Jaya#Klang#Puchong#Damansara#Cheras#Bangi#Semenyih#Hulu Selangor#Cyberjaya#Putrajaya#Mont Kiara|Federal expressways (EKVE delivered — 39.5 km, 450,000 m² protected), KL hillside developer estates (Damansara Heights, Bukit Tunku, Mont Kiara, Country Heights), MRT/LRT cut-and-cover slopes, Hulu Selangor + Semenyih industrial platforms. Office in Petaling Jaya — same-day site response across KL, Selangor, Putrajaya, Cyberjaya."
  "penang|Penang|George Town#Bukit Mertajam#Bayan Lepas#Tanjung Bungah#Tanjung Tokong#Air Itam#Penang Hill#Balik Pulau#Butterworth#Seberang Perai|Penang Hill granite hillside developments, MBPP submission native, Penang Hill Slope Guideline compliant. Bayan Lepas industrial parks, Seberang Perai infrastructure corridor. Ferry/bridge mobilization for the island."
  "johor|Johor|Johor Bahru#Iskandar Puteri#Senai#Pasir Gudang#Skudai#Kulai#Pontian#Kluang#Batu Pahat#Muar#Mersing#Segamat|Iskandar Puteri / Medini mixed-use cut platforms, Pasir Gudang petrochemical durability spec, Senai logistics, Tebrau urban hillside. BS / EN / Eurocode 7 native for Singapore-influenced consultancies. Cross-causeway response from KL within 4-5 hours."
  "pahang|Pahang|Kuantan#Genting Highlands#Cameron Highlands#Bukit Tinggi#Fraser's Hill#Bentong#Raub#Temerloh#Maran#Pekan#Kuala Lipis|Hill-station resort and residential platforms (Genting, Cameron Highlands — Class III/IV slopes), ECRL alignment cut slopes (32 km of chainage in Pahang), Central Spine Road delivered (65,000 m², MOW project). Monsoon-resilient design with groundwater-led methodology."
  "sabah|Sabah|Kota Kinabalu#Sandakan#Tawau#Lahad Datu#Keningau#Beaufort#Kudat#Semporna#Ranau#Tuaran#Papar|Crocker Range hillside developments around KK, oil palm estate access platforms, post-monsoon east coast remediation on the Sandakan-Lahad Datu-Tawau corridor. Salt-spray durability spec for coastal sites. Project-specific mobilization via KKIA + Sepanggar Port."
  "sarawak|Sarawak|Kuching#Miri#Sibu#Bintulu#Samarahan#Sri Aman#Sarikei#Limbang#Kapit#Mukah#Lawas|Pan Borneo Highway corridor (~786 km), Bintulu SCORE industrial belt (smelters, polysilicon — vibration-sensitive platforms), Kuching mixed-use developments, oil palm estate platforms. Cross-sea logistics via Port Klang to Senari/Bintulu/Tg Kidurong/Miri."
)

mkdir -p ./generated-combos-log
LOG="./generated-combos-log/$(date +%s).log"
COUNT=0

for SVC_ROW in "${SERVICES[@]}"; do
  IFS='|' read -r SVC_SLUG SVC_NAME SVC_FAMILY SVC_BLURB <<< "$SVC_ROW"
  for ST_ROW in "${STATES[@]}"; do
    IFS='|' read -r ST_SLUG ST_NAME ST_CITIES ST_CONTEXT <<< "$ST_ROW"
    SLUG="${SVC_SLUG}-${ST_SLUG}"
    DIR="./${SLUG}"
    OUT="${DIR}/index.html"
    mkdir -p "$DIR"

    # Skip if hand-authored richer version already exists (>4KB heuristic)
    if [ -f "$OUT" ] && [ "$(wc -c < "$OUT")" -gt 4000 ]; then
      echo "SKIP (rich): $OUT" >> "$LOG"
      continue
    fi

    # Convert # separators to <span> chips
    AREAS_HTML=""
    IFS='#' read -ra CITY_ARR <<< "$ST_CITIES"
    for CITY in "${CITY_ARR[@]}"; do
      AREAS_HTML+="<span>${CITY}</span>"
    done
    # Truncate to first 3 cities for title
    TITLE_CITIES="${CITY_ARR[0]}, ${CITY_ARR[1]:-}, ${CITY_ARR[2]:-}"

    cat > "$OUT" <<HTMLEOF
<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${SVC_NAME} Contractor in ${ST_NAME} | ${TITLE_CITIES} | Infraconcrete CIDB G7</title>
<meta name="description" content="Specialist ${SVC_NAME,,} contractor for ${ST_NAME}. ${ST_CONTEXT} ${SVC_BLURB} CIDB G7, ISO 9001:2015." />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://infraconcrete.co/${SLUG}/" />
<link rel="alternate" hreflang="en" href="https://infraconcrete.co/${SLUG}/" />
<link rel="alternate" hreflang="x-default" href="https://infraconcrete.co/${SLUG}/" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" /><link rel="apple-touch-icon" href="/favicon.svg" />
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"LocalBusiness","name":"Infraconcrete Construction Sdn Bhd","url":"https://infraconcrete.co/","telephone":"+60-16-428-1214","areaServed":[{"@type":"AdministrativeArea","name":"${ST_NAME}"}]},{"@type":"Service","serviceType":"${SVC_NAME}","areaServed":{"@type":"AdministrativeArea","name":"${ST_NAME}, Malaysia"},"provider":{"@type":"LocalBusiness","name":"Infraconcrete Construction Sdn Bhd"}},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://infraconcrete.co/"},{"@type":"ListItem","position":2,"name":"${SVC_NAME}","item":"https://infraconcrete.co/${SVC_SLUG}/"},{"@type":"ListItem","position":3,"name":"${ST_NAME}","item":"https://infraconcrete.co/${SLUG}/"}]}]}</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&family=Manrope:wght@400;600&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/seo-page.css">
<script src="/js/seo-nav.js" defer></script>
</head>
<body>
<header class="topbar"><div class="container topbar-row"><a href="/" class="brand">Infra<em>concrete</em></a></div></header>
<div class="container"><nav class="crumbs"><a href="/">Home</a><span class="sep">·</span><a href="/${SVC_SLUG}/">${SVC_NAME}</a><span class="sep">·</span><span class="here">${ST_NAME}</span></nav></div>
<main><div class="container">
<section class="hero"><div class="eyebrow">${SVC_NAME} · ${ST_NAME}</div><h1>${SVC_NAME} <em>Contractor in ${ST_NAME}.</em></h1><p class="lede">${ST_CONTEXT} ${SVC_BLURB} CIDB G7, ISO 9001:2015.</p>
<div class="areas">${AREAS_HTML}</div>
<div class="stats"><div class="stat"><div class="v">100+</div><div class="l">Projects delivered</div></div><div class="stat"><div class="v">5M m²</div><div class="l">Slope stabilized</div></div><div class="stat"><div class="v">JKR I-IV</div><div class="l">Slope class</div></div><div class="stat"><div class="v">G7</div><div class="l">CIDB highest</div></div></div></section>
<section class="block"><div class="block-eye">01 / ${ST_NAME} context</div><h2>Why ${ST_NAME} projects need <em>${SVC_NAME,,} engineered properly.</em></h2><p>${ST_CONTEXT} For ${SVC_NAME,,} specifically, ${ST_NAME} sites combine site-specific geology with weather and access constraints — single-system fixes often fail in tropical conditions, which is why we default to integrated systems and groundwater-led design.</p></section>
<section class="block"><div class="block-eye">02 / Why we deliver in ${ST_NAME}</div><h2>Federal references, <em>specialist crews.</em></h2>
<div class="two-col">
<div><h3>Federal-grade engineering</h3><p>EKVE (39.5 km, 450,000 m² protected), ECRL (320,000 m drilled), Central Spine Road (65,000 m²) — all delivered. Same engineering team designs your ${ST_NAME} project.</p>
<h3>CIDB G7 + ISO 9001:2015</h3><p>Highest CIDB grade, ISO 9001:2015 quality system. Eligible for JKR ${ST_NAME}, federal panels, and local authority submissions.</p></div>
<div><h3>Six in-house systems</h3><p>Soil nailing, guniting, rock bolting, rockfall barriers, retaining walls, horizontal drains — all crews are ours. No subcontracting on the geotechnical scope.</p>
<h3>Same-day response</h3><p>WhatsApp brief acknowledged the same business day. Site visits at no obligation. Project-specific mobilization to ${ST_NAME}.</p></div></div></section>
</div>
<section class="cta-block"><div class="container"><h2>${ST_NAME} ${SVC_NAME,,} <em>job needs engineering?</em></h2><p>Same-day brief acknowledgement. CIDB G7 + ISO 9001:2015.</p><div class="cta-row"><a class="btn btn-primary" href="https://wa.me/60164281214" target="_blank" rel="noopener">WhatsApp our team →</a><a class="btn btn-ghost" href="/#brief">Full contact</a></div></div></section>
</main>
<footer><div class="container"><p>Infraconcrete Construction Sdn Bhd · CIDB G7 · ISO 9001:2015 · A <a href="/">Panthera Group</a> company</p></div></footer>
</body></html>
HTMLEOF
    echo "WROTE: $OUT" >> "$LOG"
    COUNT=$((COUNT+1))
  done
done

echo "=== Done. $COUNT pages written. Log: $LOG ==="
