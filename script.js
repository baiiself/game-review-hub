const games = [
  {
    id: "elden-ring",
    name: "Elden Ring",
    genre: "Action RPG",
    categories: ["RPG", "Action", "Adventure"],
    score: 4.5,
    cover: "images/elden-ring/cover.jpg",
    screenshots: ["images/elden-ring/scene-1.jpg", "images/elden-ring/scene-2.jpg", "images/elden-ring/scene-3.jpg"],
    description: "Explore a vast fantasy world, discover hidden places, and face challenging enemies in an open-world action RPG.",
    shortDescription: "Explore a vast world full of secrets and challenging battles.",
    pros: ["Beautiful world design", "Freedom to explore", "Deep combat and builds"],
    cons: ["Can be very challenging", "Some quests are hard to follow"],
    thoughts: "A great choice for players who enjoy exploration, discovery, and overcoming difficult challenges."
  },
  {
    id: "genshin-impact",
    name: "Genshin Impact",
    genre: "Open-World RPG",
    categories: ["RPG", "Action", "Adventure"],
    score: 4.5,
    cover: "images/genshin impact/genshin-impact-cover.jpg",
    screenshots: ["images/genshin impact/scene-1.jpg", "images/genshin impact/scene-2.jpg", "images/genshin impact/scene-3.jpg"],
    description: "Travel across Teyvat, meet different characters, solve puzzles, and explore a colorful fantasy world.",
    shortDescription: "A colorful fantasy adventure with exploration and characters.",
    pros: ["Beautiful scenery", "Large world to explore", "Many playable characters"],
    cons: ["Progress can take time", "Some content uses gacha mechanics"],
    thoughts: "A fun game for players who enjoy collecting characters, exploring beautiful places, and following a fantasy story."
  },
  {
    id: "minecraft",
    name: "Minecraft",
    genre: "Sandbox / Survival",
    categories: ["Adventure", "Simulation", "Cozy"],
    score: 5,
    cover: "images/minecraft/cover.jpg",
    screenshots: ["images/minecraft/scene-1.jpg", "images/minecraft/scene-2.jpg", "images/minecraft/scene-3.jpg"],
    description: "Build anything you can imagine, gather resources, explore new places, or survive in a world made of blocks.",
    shortDescription: "Build, explore, and create your own world.",
    pros: ["Creative freedom", "Many ways to play", "Great with friends"],
    cons: ["Can feel directionless", "Some mechanics take time to learn"],
    thoughts: "A flexible game where you can relax, build something beautiful, or set your own challenges."
  },
  {
    id: "wuthering-waves",
    name: "Wuthering Waves",
    genre: "Open-World Action RPG",
    categories: ["RPG", "Action", "Adventure"],
    score: 4.5,
    cover: "images/wuthering waves/wuthering-waves-cover.jpg",
    screenshots: ["images/wuthering waves/scene-1.jpg", "images/wuthering waves/scene-2.jpg", "images/wuthering waves/scene-3.jpg"],
    description: "Explore a mysterious world, master fast-paced combat, and meet Resonators on a journey through Solaris-3.",
    shortDescription: "A stylish action RPG with fast combat and exploration.",
    pros: ["Fluid combat", "Expressive character designs", "Enjoyable movement and exploration"],
    cons: ["The story can feel complicated", "Requires time to learn combat systems"],
    thoughts: "Worth trying if you enjoy action combat, character collection, and exploring a mysterious world."
  },
  {
    id: "stardew-valley",
    name: "Stardew Valley",
    genre: "Farming Simulation",
    categories: ["Simulation", "Cozy", "Adventure"],
    score: 4.5,
    cover: "images/stardew-valley/cover.jpg",
    screenshots: ["images/stardew-valley/scene-1.jpg", "images/stardew-valley/scene-2.jpg", "images/stardew-valley/scene-3.jpg"],
    description: "Leave city life behind and build a new life by farming, fishing, making friends, and exploring the valley.",
    shortDescription: "A relaxing farming game with plenty to discover.",
    pros: ["Relaxing atmosphere", "Lots of activities", "Meaningful progression"],
    cons: ["Days can feel short", "Some goals require repetitive tasks"],
    thoughts: "A lovely option when you want to slow down, build a routine, and enjoy a cozy game at your own pace."
  }
];
function populateReviewGameOptions() {
  const select = document.getElementById("reviewGame");
  if (!select) return;

  select.innerHTML = '<option value="">Select a game</option>';

  games.forEach(game => {
    const option = document.createElement("option");
    option.value = game.name;
    option.textContent = game.name;
    select.appendChild(option);
  });
}

const STORAGE_KEYS = {
  reviews: "baiiself-community-reviews-v1",
  suggestions: "baiiself-game-suggestions-v1",
  theme: "baiiself-theme-v1"
};

let activeCategory = "All";
let currentGame = null;
let currentImageIndex = 0;

const $ = (selector) => document.querySelector(selector);
const gameGrid = $("#gameGrid");
const searchInput = $("#searchInput");
const reviewModal = $("#reviewModal");
const galleryImage = $("#galleryImage");
const galleryLabel = $("#galleryLabel");
const galleryCounter = $("#galleryCounter");
const galleryDots = $("#galleryDots");
const zoomView = $("#zoomView");
const zoomImage = $("#zoomImage");

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function readLocal(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function saveLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function ratingHTML(score) {
  const rounded = Math.max(0, Math.min(5, Number(score) || 0));
  const full = Math.floor(rounded);
  const half = rounded - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return `
    <div class="rating-row">
      <span class="rating-stars" aria-label="${rounded} out of 5 stars">
        ${"<span>★</span>".repeat(full)}
        ${half ? '<span class="half">★</span>' : ""}
        ${'<span style="color:#c5d8ee;">★</span>'.repeat(empty)}
      </span>
      <span class="rating-number">${rounded.toFixed(1)}/5</span>
    </div>`;
}

function renderGames() {
  const keyword = searchInput.value.trim().toLowerCase();
  const filtered = games.filter(game => {
    const matchesSearch = [game.name, game.genre, game.description, ...game.categories]
      .some(value => value.toLowerCase().includes(keyword));
    const matchesCategory = activeCategory === "All" || game.categories.includes(activeCategory);
    return matchesSearch && matchesCategory;
  });

  if (!filtered.length) {
    gameGrid.innerHTML = '<div class="no-results"><h3>No games found ✿</h3><p>Try another game name or category.</p></div>';
    return;
  }

gameGrid.innerHTML = filtered.map(game => `
  <article class="game-card">
    <div class="cover-wrap">
      <img
        src="${game.cover}"
        alt="${escapeHTML(game.name)} cover"
        loading="eager"
        onerror="this.style.display='none'; this.parentElement.querySelector('.image-placeholder').hidden=false;"
      >
      <span class="score-badge">★ ${game.score.toFixed(1)}/5</span>
      <span class="image-placeholder" hidden>
        Image failed to load
        <small>${escapeHTML(game.cover)}</small>
      </span>
    </div>

    <div class="card-content">
      <h3>${escapeHTML(game.name)}</h3>
      <div class="game-genre">${escapeHTML(game.genre)}</div>
      ${ratingHTML(game.score)}
      <p class="game-description">${escapeHTML(game.shortDescription)}</p>
      <button class="review-button" type="button"
        data-review-game="${escapeHTML(game.id)}">
        View Review →
      </button>
    </div>
  </article>
`).join("");


function getGalleryImages(game) {
  return [
    { src: game.cover, label: "Cover" },
    { src: game.screenshots[0], label: "Screenshot 1" },
    { src: game.screenshots[1], label: "Screenshot 2" },
    { src: game.screenshots[2], label: "Screenshot 3" }
  ];
}

function openReview(gameId) {
  currentGame = games.find(game => game.id === gameId);
  if (!currentGame) return;
  currentImageIndex = 0;

  $("#modalTitle").textContent = currentGame.name;
  $("#modalGenre").textContent = currentGame.genre;
  $("#modalRating").innerHTML = ratingHTML(currentGame.score);
  $("#modalDescription").textContent = currentGame.description;
  $("#modalThoughts").textContent = currentGame.thoughts;
  $("#modalPros").innerHTML = currentGame.pros.map(item => `<li>${escapeHTML(item)}</li>`).join("");
  $("#modalCons").innerHTML = currentGame.cons.map(item => `<li>${escapeHTML(item)}</li>`).join("");
  renderGallery();

  reviewModal.classList.add("open");
  reviewModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function renderGallery() {
  if (!currentGame) return;
  const images = getGalleryImages(currentGame);
  const image = images[currentImageIndex];

  galleryImage.hidden = false;
  galleryImage.src = image.src;
  galleryImage.alt = `${currentGame.name} - ${image.label}`;
  galleryLabel.textContent = image.label;
  galleryCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;

  galleryDots.innerHTML = images.map((item, index) => `
    <button type="button" class="gallery-dot ${index === currentImageIndex ? "active" : ""}"
      aria-label="Show ${item.label}" aria-current="${index === currentImageIndex}" data-gallery-index="${index}"></button>
  `).join("");

  galleryDots.querySelectorAll("[data-gallery-index]").forEach(button => {
    button.addEventListener("click", () => goToImage(Number(button.dataset.galleryIndex)));
  });

  galleryImage.onerror = () => {
    galleryImage.alt = `${image.label} not found. Check the image path in GitHub.`;
    galleryLabel.textContent = `${image.label} — image not found`;
  };
}

function goToImage(index) {
  if (!currentGame) return;
  const images = getGalleryImages(currentGame);
  currentImageIndex = (index + images.length) % images.length;
  renderGallery();
}

function closeReview() {
  reviewModal.classList.remove("open");
  reviewModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function openZoom() {
  if (!galleryImage.src || galleryImage.naturalWidth === 0) return;
  zoomImage.src = galleryImage.src;
  zoomView.classList.add("open");
}

function closeZoom() {
  zoomView.classList.remove("open");
  zoomImage.removeAttribute("src");
}
function populateReviewGameOptions() {
  const select = document.querySelector("#reviewGame");

  select.innerHTML = `
    <option value="">Select a game</option>
    ${games.map(game => `
      <option value="${escapeHTML(game.name)}">
        ${escapeHTML(game.name)}
      </option>
    `).join("")}
  `;
}

function renderCommunityReviews() {
  const feed = $("#communityFeed");
  const reviews = readLocal(STORAGE_KEYS.reviews).slice().reverse();
  if (!reviews.length) {
    feed.innerHTML = '<div class="empty-state">No community reviews yet. Be the first to share your thoughts! ♡</div>';
    return;
  }
  feed.innerHTML = reviews.map(review => `
    <article class="feed-card">
      <h4>${escapeHTML(review.game)}</h4>
      <div class="feed-meta">By ${escapeHTML(review.name)} · ${escapeHTML(review.date)}</div>
      <div class="feed-stars" aria-label="${review.score} out of 5 stars">${"★".repeat(review.score)}${"☆".repeat(5 - review.score)} <span class="feed-meta">${review.score}/5</span></div>
      <p>${escapeHTML(review.text)}</p>
    </article>`).join("");
}

function renderSuggestions() {
  const list = $("#suggestionList");
  const suggestions = readLocal(STORAGE_KEYS.suggestions).slice().reverse();
  if (!suggestions.length) {
    list.innerHTML = '<div class="empty-state">No suggestions yet. Recommend a game you love! ✧</div>';
    return;
  }
  list.innerHTML = suggestions.map(item => `
    <article class="suggestion-card">
      <h4>${escapeHTML(item.game)}</h4>
      <div class="feed-meta">Suggested ${escapeHTML(item.date)}</div>
      <span class="suggestion-tag">${escapeHTML(item.category)}</span>
      ${item.reason ? `<p>${escapeHTML(item.reason)}</p>` : ""}
    </article>`).join("");
}

function localDate() {
  return new Date().toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

$("#communityReviewForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = $("#reviewerName").value.trim();
  const game = $("#reviewGame").value.trim();
  const score = Number($("#reviewScore").value);
  const text = $("#reviewText").value.trim();
  if (!name || !game || !text) return;

  const reviews = readLocal(STORAGE_KEYS.reviews);
  reviews.push({ name, game, score, text, date: localDate() });
  const saved = saveLocal(STORAGE_KEYS.reviews, reviews);
  $("#reviewStatus").textContent = saved
    ? "Review added in this browser. Thank you for sharing! ♡"
    : "Could not save this review. Check your browser storage settings.";
  if (saved) {
    event.target.reset();
    renderCommunityReviews();
  }
});

$("#suggestionForm").addEventListener("submit", event => {
  event.preventDefault();
  const game = $("#suggestedGame").value.trim();
  const category = $("#suggestedCategory").value;
  const reason = $("#suggestedReason").value.trim();
  if (!game) return;

  const suggestions = readLocal(STORAGE_KEYS.suggestions);
  suggestions.push({ game, category, reason, date: localDate() });
  const saved = saveLocal(STORAGE_KEYS.suggestions, suggestions);
  $("#suggestionStatus").textContent = saved
    ? "Suggestion added in this browser. Thanks for the recommendation! ✧"
    : "Could not save this suggestion. Check your browser storage settings.";
  if (saved) {
    event.target.reset();
    renderSuggestions();
  }
});

$("#clearLocalReviews").addEventListener("click", () => {
  if (!confirm("Remove all community reviews saved in this browser?")) return;
  localStorage.removeItem(STORAGE_KEYS.reviews);
  renderCommunityReviews();
  $("#reviewStatus").textContent = "Local reviews cleared.";
});

$("#prevImage").addEventListener("click", () => goToImage(currentImageIndex - 1));
$("#nextImage").addEventListener("click", () => goToImage(currentImageIndex + 1));
$("#closeModal").addEventListener("click", closeReview);
$("#zoomClose").addEventListener("click", closeZoom);
galleryImage.addEventListener("click", openZoom);

reviewModal.addEventListener("click", event => {
  if (event.target === reviewModal) closeReview();
});
zoomView.addEventListener("click", event => {
  if (event.target === zoomView || event.target === zoomImage) closeZoom();
});

$("#reviewThisGame").addEventListener("click", () => {
  if (currentGame) $("#reviewGame").value = currentGame.name;
  closeReview();
  $("#community").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => $("#reviewerName").focus({ preventScroll: true }), 350);
});

searchInput.addEventListener("input", renderGames);

document.querySelectorAll(".category-button").forEach(button => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    document.querySelectorAll(".category-button").forEach(item => {
      item.classList.toggle("active", item === button);
    });
    renderGames();
  });
});

$("#themeButton").addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  $("#themeButton").textContent = isDark ? "☀ Light Mode" : "☾ Dark Mode";
  try { localStorage.setItem(STORAGE_KEYS.theme, isDark ? "dark" : "light"); } catch {}
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    if (zoomView.classList.contains("open")) closeZoom();
    else closeReview();
  }
  if (reviewModal.classList.contains("open") && !zoomView.classList.contains("open")) {
    if (event.key === "ArrowLeft") goToImage(currentImageIndex - 1);
    if (event.key === "ArrowRight") goToImage(currentImageIndex + 1);
  }
});

try {
  if (localStorage.getItem(STORAGE_KEYS.theme) === "dark") {
    document.body.classList.add("dark");
    $("#themeButton").textContent = "☀ Light Mode";
  }
} catch {}

populateReviewGameOptions();
renderGames();
renderCommunityReviews();
renderSuggestions();
