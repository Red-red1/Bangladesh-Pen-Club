/* ============================================================
   EDIT HERE
   - REVIEWS: approved reviews shown on the site. Add new ones
     after you have read and approved them.
   - FORM_ENDPOINT: paste a free form URL (for example from
     Formspree) so new reviews arrive in your inbox.
     If empty, the form opens the visitor's email app instead.
   - REVIEW_EMAIL: where the email fallback is sent.
   ============================================================ */
const REVIEWS = [
  { name: "Sample member", rating: 5, text: "Found my first fountain pen here and a pen pal in Chattogram. Warm, helpful people." },
  { name: "Sample visitor", rating: 4, text: "The calligraphy workshop was well organised. I came as a beginner and left with a page I was proud of." }
];
const FORM_ENDPOINT = "";
const REVIEW_EMAIL = "hello@example.com";

/* ---------- ink picker ---------- */
const INKS = [
  { name: "Jamuna blue-black", color: "#14213d" },
  { name: "Padma teal",        color: "#0e7c7b" },
  { name: "Krishnachura red",  color: "#b3261e" },
  { name: "Shapla green",      color: "#2f5d3a" },
  { name: "Mango-leaf violet", color: "#5b3a8c" }
];

function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

function applyInk(color) {
  document.documentElement.style.setProperty("--ink", color);
  document.querySelector('meta[name="theme-color"]').setAttribute("content", color);
  document.querySelectorAll("#ink-row button").forEach(b =>
    b.setAttribute("aria-pressed", String(b.dataset.color === color)));
}

const inkRow = document.getElementById("ink-row");
INKS.forEach(ink => {
  const b = document.createElement("button");
  b.type = "button";
  b.dataset.color = ink.color;
  b.setAttribute("aria-pressed", "false");
  b.innerHTML = '<span class="dot" style="--c:' + ink.color + '"></span>' + ink.name;
  b.addEventListener("click", () => { applyInk(ink.color); safeSet("pen-ink", ink.color); });
  inkRow.appendChild(b);
});
applyInk(safeGet("pen-ink") || INKS[0].color);

/* ---------- mobile menu ---------- */
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
}));

/* ---------- reviews list ---------- */
function starsText(n) { return "★".repeat(n) + "☆".repeat(5 - n); }

const list = document.getElementById("review-list");
REVIEWS.forEach(r => {
  const fig = document.createElement("blockquote");
  fig.className = "review";
  const p = document.createElement("p");
  p.textContent = r.text;
  const f = document.createElement("footer");
  const s = document.createElement("span");
  s.className = "stars-out";
  s.textContent = starsText(r.rating);
  s.setAttribute("aria-label", r.rating + " out of 5");
  f.append(s, document.createTextNode(" " + r.name));
  fig.append(p, f);
  list.appendChild(fig);
});

/* ---------- review form ---------- */
let rating = 0;
const starsBox = document.getElementById("stars");
for (let i = 1; i <= 5; i++) {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = "★";
  b.setAttribute("aria-label", i + (i === 1 ? " star" : " stars"));
  b.addEventListener("click", () => {
    rating = i;
    starsBox.querySelectorAll("button").forEach((x, idx) =>
      x.dataset.on = String(idx < rating));
  });
  starsBox.appendChild(b);
}

const form = document.getElementById("review-form");
const statusEl = document.getElementById("review-status");

function say(msg, isErr) {
  statusEl.textContent = msg;
  statusEl.className = "status" + (isErr ? " err" : "");
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  const data = new FormData(form);
  if (data.get("website")) return; // spam trap filled in
  const name = String(data.get("name") || "").trim();
  const message = String(data.get("message") || "").trim();
  if (!name || !message) return say("Add your name and a short review.", true);
  if (!rating) return say("Choose a star rating.", true);

  if (FORM_ENDPOINT) {
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ name, rating, message })
      });
      if (!res.ok) throw new Error("bad status");
      form.reset(); rating = 0;
      starsBox.querySelectorAll("button").forEach(x => x.dataset.on = "false");
      say("Thank you. Your review will appear after the team reads it.");
    } catch (err) {
      say("The review could not be sent. Check your connection and try again.", true);
    }
  } else {
    const body = "Name: " + name + "\nRating: " + rating + "/5\n\n" + message;
    window.location.href = "mailto:" + REVIEW_EMAIL +
      "?subject=" + encodeURIComponent("Review for Bangladesh Pen Club") +
      "&body=" + encodeURIComponent(body);
    say("Your email app should open. Press send there to share your review.");
  }
});
