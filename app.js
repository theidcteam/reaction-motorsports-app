
let currentScreen = "home";
let currentFilter = "All";
let currentEvent = EVENTS[0];

function esc(str) {
  return String(str ?? "").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}


function isEventActive(event) {
  if (!event.endDate) return true;
  const today = new Date();
  today.setHours(0,0,0,0);
  const end = new Date(event.endDate + "T23:59:59");
  return end >= today;
}

function directionsUrl(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || "")}`;
}

function sponsorCard(name) {
  const logo = SPONSOR_LOGOS[name];
  const url = SPONSOR_URLS && SPONSOR_URLS[name] ? SPONSOR_URLS[name] : "";
  const inner = logo
    ? `<img src="${esc(logo)}" alt="${esc(name)}">`
    : `<span>${esc(name)}</span>`;

  if (url) {
    return `<a class="sponsor-card" href="${esc(url)}" target="_blank" rel="noopener">${inner}</a>`;
  }

  return `<div class="sponsor-card sponsor-card-disabled">${inner}</div>`;
}

function eventCard(event) {
  return `
    <article class="card" data-brand="${esc(event.brand)}">
      <div class="card-img">
        <img src="${esc(event.hero)}" alt="${esc(event.name)}">
        <div class="card-labels"><span>${esc(event.brand)}</span><span>${esc(event.type)}</span></div>
        <div class="card-title">
          <img class="event-logo" src="${esc(event.logo)}" alt="${esc(event.brand)}">
          <h3>${esc(event.name)}</h3>
          <p>${esc(event.venue)} • ${esc(event.city)}</p>
        </div>
      </div>
      <div class="stats">
        <div class="stat"><small>Date</small><b>${esc(event.date)}</b></div>
        <div class="stat"><small>Driver</small><b>${esc(event.driverFee)}</b></div>
        <div class="stat"><small>Cap</small><b>${esc(event.driverCap)}</b></div>
      </div>
      <div class="card-actions">
        <a class="btn brand-register ${esc(event.brandClass)}" href="${esc(event.registration)}" target="_blank" rel="noopener">Register</a>
        <button class="btn secondary" onclick="openEvent('${esc(event.id)}')">Details</button>
      </div>
    </article>
  `;
}

function topHero(event) {
  return `
    <header class="hero">
      <img class="hero-img" src="${esc(event.hero)}" alt="${esc(event.name)}">
      <div class="topbar">
        <img class="rm-logo" src="assets/logos/Reaction_Logo_White.svg" alt="Reaction Motorsports Events">
        <button class="menu-pill" onclick="go('events')">Events</button>
      </div>
      <div class="hero-copy">
        <span class="badge">Featured</span>
        <img class="hero-logo" src="${esc(event.logo)}" alt="${esc(event.name)}">
        <p>${esc(event.eventDays)}</p>
      </div>
    </header>
  `;
}





function homeScreen() {
  return `
    <header class="rm-home">
      <img class="rm-home-bg" src="assets/photos/toge_home_15.jpg" alt="Reaction Motorsports event">

      <div class="rm-season-pill">2026 Season</div>

      <div class="rm-home-brand">
        <img src="assets/logos/Reaction_Logo_White.svg" alt="Reaction Motorsports Events">
        <div class="rm-tagline">
          <span>Real Drivers, Real Events.</span>
          <span>Real Community.</span>
        </div>
      </div>

      <div class="rm-experience">
        <h2>Pick Your Experience</h2>

        <div class="rm-brand-row">
          <button class="rm-brand-button rm-drift" onclick="openBrand('DriftNWA')" aria-label="Open DriftNWA">
            <img src="assets/logos/DriftNWA_Logo_White.svg" alt="DriftNWA">
          </button>

          <button class="rm-brand-button rm-grip" onclick="openBrand('GripNWA')" aria-label="Open GripNWA">
            <img src="assets/logos/GripNWA_Logo_White.svg" alt="GripNWA">
          </button>

          <button class="rm-brand-button rm-toge" onclick="openBrand('Tōge')" aria-label="Open Tōge">
            <img src="assets/logos/Toge_Logo_White.svg" alt="Tōge">
          </button>
        </div>
      </div>
    </header>
  `;
}

function eventsScreen() {
  const brands = ["All", "DriftNWA", "GripNWA", "Tōge"];
  const list = EVENTS.filter(isEventActive).filter(e => currentFilter === "All" || e.brand === currentFilter).sort((a, b) => new Date(a.dateSort) - new Date(b.dateSort));
  return `
    <div class="screen-title">
      <h1>Events</h1>
      <p>All remaining Reaction Motorsports Events for 2026.</p>
    </div>
    <section class="section">
      <div class="filters">
        ${brands.map(b => `<button data-brand="${b}" class="filter ${currentFilter===b?'active':''}" onclick="setFilter('${b}')">${b}</button>`).join("")}
      </div>
      ${currentFilter === "DriftNWA" ? jackpotEntryCard() : ""}
      ${list.map(eventCard).join("")}
    </section>
  `;
}

function detailScreen(event) {
  const rows = Object.entries(event.schedule).map(([k,v]) => `<div class="row"><span>${esc(k)}</span><span>${esc(v)}</span></div>`).join("");
  return `
    <header class="hero detail-hero">
      <img class="hero-img" src="${esc(event.hero)}" alt="${esc(event.name)}">
      <div class="topbar">
        <button class="menu-pill" onclick="go('events')">Back</button>
        <button class="menu-pill" onclick="go('home')">Home</button>
      </div>
      <div class="hero-copy">
        <span class="badge">${esc(event.brand)}</span>
        <img class="hero-logo" src="${esc(event.logo)}" alt="${esc(event.name)}">
        <p>${esc(event.venue)} • ${esc(event.city)}</p>
      </div>
    </header>
    <section class="section">
      <div class="grid2">
        <div class="tile"><small>Date</small><b>${esc(event.date)}</b></div>
        <div class="tile"><small>Driver Fee</small><b>${esc(event.driverFee)}</b></div>
        <div class="tile"><small>Spectators</small><b>${esc(event.spectatorFee)}</b></div>
        <div class="tile"><small>Cap</small><b>${esc(event.driverCap)}</b></div>
        <div class="tile"><small>Ride-Alongs</small><b>${esc(event.rideAlong)}</b></div>
        <div class="tile"><small>Camping</small><b>${esc(event.camping)}</b></div>
        ${event.registrationDeadline ? `<div class="tile detail-wide"><small>Registration Deadline</small><b>${esc(event.registrationDeadline)}</b></div>` : ""}
      </div>
      <p class="note">${esc(event.eventDays)}</p>
      <div class="card-actions detail-actions" style="padding:14px 0 0;">
        <a class="btn brand-register ${esc(event.brandClass)}" href="${esc(event.registration)}" target="_blank" rel="noopener">Register</a>
        <a class="btn secondary" href="${directionsUrl(event.address)}" target="_blank" rel="noopener">Directions</a>
        ${event.venueUrl
          ? `<a class="btn secondary" href="${esc(event.venueUrl)}" target="_blank" rel="noopener">Venue Website</a>`
          : ""}
      </div>
      <div class="panel venue-detail-panel">
        <h2>Venue</h2>
        <div class="rows">
          <div class="row"><span>Venue</span><span>${esc(event.venue)}</span></div>
          <div class="row"><span>Address</span><span>${esc(event.address)}</span></div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="panel"><h2>Schedule</h2><div class="rows">${rows}</div></div>
      <div class="panel"><h2>Event Sponsors</h2><div class="sponsor-strip">${event.sponsors.map(sponsorCard).join("")}</div></div>
      <div class="panel"><h2>Gallery</h2><div class="gallery-grid">${event.gallery.map((g,i)=>`<img class="${i===0?'big':''}" src="${esc(g)}" alt="${esc(event.name)} photo">`).join("")}</div></div>
    </section>
  `;
}



const JACKPOT_STANDINGS = [
  { pos: 1, driver: "Curtis Mathews", points: 100 },
  { pos: 2, driver: "Hunter Wood", points: 75 },
  { pos: 3, driver: "Colin Carter", points: 50 },
  { pos: 4, driver: "Geoffrey Hicks", points: 25 },
  { pos: 5, driver: "Nick Miller", points: 15 },
  { pos: 6, driver: "Seth Stites", points: 10 },
  { pos: 7, driver: "Josh Hanneke", points: 5 },
  { pos: 8, driver: "Austin Little", points: 5 },
  { pos: 9, driver: "Cole Pearson", points: 5 }
];

function jackpotEntryCard() {
  return `
    <article class="jackpot-entry-card" onclick="go('jackpot')">
      <img src="assets/logos/235_jackpot_logo.png" alt="235 Jackpot">
      <div>
        <h2>235 Jackpot Standings</h2>
        <p>Current points after Round 1 — OMC.</p>
        <span>View Championship Points</span>
      </div>
    </article>
  `;
}

function jackpotScreen() {
  return `
    <div class="screen-title jackpot-title">
      <button class="menu-pill" onclick="openBrand('DriftNWA')">Back to DriftNWA</button>
      <img class="jackpot-hero-logo" src="assets/logos/235_jackpot_logo.png" alt="235 Jackpot">
      <h1>235 Jackpot</h1>
      <p>2026 DriftNWA 235 Jackpot Championship standings after Round 1 — OMC.</p>
    </div>

    <section class="section jackpot-section">
      <div class="panel jackpot-panel">
        <h2>Current Standings</h2>
        <p class="note">After Round 1 — OMC</p>

        <div class="jackpot-standings">
          ${JACKPOT_STANDINGS.map(row => `
            <div class="jackpot-row ${row.pos === 1 ? 'leader' : ''}">
              <span class="jackpot-pos">${row.pos}</span>
              <span class="jackpot-driver">${esc(row.driver)}</span>
              <span class="jackpot-points">${row.points}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="panel jackpot-panel">
        <h2>Next Round</h2>
        <div class="jackpot-next">
          <strong>Round 2 — Cam’s Acres</strong>
          <span>June 20–21, 2026</span>
          <p>Registration remains open until Thursday at 9:00 PM.</p>
          <a class="btn brand-register drift" href="https://form.jotform.com/261115443302140" target="_blank" rel="noopener">Sign Up for Rd2</a>
        </div>
      </div>

      <div class="panel jackpot-panel">
        <h2>Series Schedule</h2>
        <div class="jackpot-rounds">
          <div class="done"><b>Round 1</b><span>OMC — Completed</span></div>
          <div class="active"><b>Round 2</b><span>Cam’s Acres — June 20–21</span></div>
          <div><b>Round 3</b><span>Cam’s Acres — August</span></div>
          <div><b>Round 4</b><span>Drake Field — October Championship Round</span></div>
        </div>
      </div>

      <div class="panel jackpot-panel">
        <h2>Series Rules</h2>
        <div class="rows">
          <div class="row"><span>Tire Limit</span><span>235 max</span></div>
          <div class="row"><span>Treadwear</span><span>300TW minimum</span></div>
          <div class="row"><span>Buy-In</span><span>$100 cash</span></div>
          <div class="row"><span>Nightly Payout</span><span>75% to top 3</span></div>
          <div class="row"><span>Final Jackpot</span><span>25% retained for championship pot</span></div>
        </div>
      </div>
    </section>
  `;
}

function scheduleScreen() {
  const list = EVENTS.filter(isEventActive).sort((a, b) => new Date(a.dateSort) - new Date(b.dateSort));

  return `
    <div class="screen-title schedule-title">
      <h1>Schedule</h1>
      <p>Remaining 2026 Reaction Motorsports events, sorted by date.</p>
    </div>

    <section class="section schedule-section">
      ${list.map(e => `
        <div class="schedule-event-card schedule-${esc(e.brandClass)}" onclick="openEvent('${esc(e.id)}')">
          <div class="schedule-accent"></div>

          <div class="schedule-card-top">
            <div>
              <div class="schedule-brand">${esc(e.brand)}</div>
              <h2>${esc(e.name)}</h2>
              <p>${esc(e.date)} • ${esc(e.venue)}</p>
            </div>
          </div>

          <div class="schedule-mini-grid">
            <div>
              <small>Driver Gate</small>
              <b>${esc(e.schedule["Driver Gate"])}</b>
            </div>
            <div>
              <small>Meeting</small>
              <b>${esc(e.schedule["Drivers Meeting"])}</b>
            </div>
            <div>
              <small>Track Hot</small>
              <b>${esc(e.schedule["Track Hot"])}</b>
            </div>
          </div>

          <div class="schedule-open">View Details</div>
        </div>
      `).join("")}
    </section>
  `;
}

function galleryScreen() {
  const imgs = EVENTS.flatMap(e => [e.hero, ...e.gallery.map(g => g)]);
  const unique = [...new Set(imgs)];
  return `
    <div class="screen-title">
      <h1>Gallery</h1>
      <p>Event photos from Tōge, DriftNWA, and GripNWA.</p>
    </div>
    <section class="section">
      <div class="gallery-grid">${unique.map((g,i)=>`<img class="${i%5===0?'big':''}" src="${esc(g)}" alt="Reaction Motorsports event photo">`).join("")}</div>
    </section>
  `;
}

function sponsorsScreen() {
  const names = [...new Set(EVENTS.flatMap(e => e.sponsors))];
  return `
    <div class="screen-title">
      <h1>Sponsors</h1>
      <p>Event partner visibility with logos held on black backgrounds.</p>
    </div>
    <section class="section">
      <div class="sponsor-grid">${names.map(sponsorCard).join("")}</div>
    </section>
  `;
}

function venueScreen() {
  return `
    <div class="screen-title">
      <h1>Venues</h1>
      <p>Venue information for the remaining 2026 schedule.</p>
    </div>
    <section class="section">
      ${EVENTS.map(e => `
        <div class="panel">
          <h2>${esc(e.venue)}</h2>
          <div class="grid2">
            <div class="tile"><small>Event</small><b>${esc(e.name)}</b></div>
            <div class="tile"><small>City</small><b>${esc(e.city)}</b></div>
            <div class="tile"><small>Camping</small><b>${esc(e.camping)}</b></div>
            <div class="tile"><small>Food</small><b>${esc(e.food)}</b></div>
          </div>
          <p class="note">${esc(e.address)}</p>
          <div class="card-actions" style="padding:12px 0 0;">
            <a class="btn secondary" href="${directionsUrl(e.address)}" target="_blank" rel="noopener">Directions</a>
            ${e.venueUrl ? `<a class="btn secondary" href="${esc(e.venueUrl)}" target="_blank" rel="noopener">Venue Website</a>` : ""}
          </div>
        </div>`).join("")}
    </section>
  `;
}

function render() {
  const app = document.getElementById("app");
  if (currentScreen === "home") app.innerHTML = homeScreen();
  if (currentScreen === "events") app.innerHTML = eventsScreen();
  if (currentScreen === "detail") app.innerHTML = detailScreen(currentEvent);
  if (currentScreen === "schedule") app.innerHTML = scheduleScreen();
  if (currentScreen === "gallery") app.innerHTML = galleryScreen();
  if (currentScreen === "sponsors") app.innerHTML = sponsorsScreen();
  if (currentScreen === "venue") app.innerHTML = venueScreen();
  if (currentScreen === "jackpot") app.innerHTML = jackpotScreen();

  document.querySelectorAll(".nav button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.nav === currentScreen || (currentScreen === "detail" && btn.dataset.nav === "events"));
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function go(screen) {
  currentScreen = screen;
  render();
}

function setFilter(filter) {
  currentFilter = filter;
  render();
}


function openBrand(brand) {
  currentFilter = brand;
  currentScreen = "events";
  render();
}

function openEvent(id) {
  currentEvent = EVENTS.find(e => e.id === id) || EVENTS[0];
  currentScreen = "detail";
  render();
}

document.querySelectorAll(".nav button").forEach(btn => btn.addEventListener("click", () => go(btn.dataset.nav)));
render();
