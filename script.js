
/* =========================================
   BaiiSelf | Game Review Hub
   Main JavaScript
   ========================================= */

/* ---------- Game data ---------- */

const games = [
  {
    id: "elden-ring",
    name: "Elden Ring",
    genre: "Action RPG",
    categories: ["RPG", "Action", "Adventure"],
    score: 4.5,
    cover: "images/elden-ring/cover.jpg",
    screenshots: [
      "images/elden-ring/scene-1.jpg",
      "images/elden-ring/scene-2.jpg",
      "images/elden-ring/scene-3.jpg"
    ],
    description:
      "Explore a vast fantasy world, discover hidden places, and face challenging enemies in an open-world action RPG.",
    shortDescription:
      "Explore a vast world full of secrets and challenging battles.",
    pros: [
      "Beautiful world design",
      "Freedom to explore",
      "Deep combat and builds"
    ],
    cons: [
      "Can be very challenging",
      "Some quests are hard to follow"
    ],
    thoughts:
      "A great choice for players who enjoy exploration, discovery, and overcoming difficult challenges."
  },
  {
    id: "genshin-impact",
    name: "Genshin Impact",
    genre: "Open-World RPG",
    categories: ["RPG", "Action", "Adventure"],
    score: 4.5,
    cover: "images/genshin impact/genshin-impact-cover.jpg",
    screenshots: [
      "images/genshin impact/scene-1.jpg",
      "images/genshin impact/scene-2.jpg",
      "images/genshin impact/scene-3.jpg"
    ],
    description:
      "Travel across Teyvat, meet different characters, solve puzzles, and explore a colorful fantasy world.",
    shortDescription:
      "A colorful fantasy adventure with exploration and characters.",
    pros: [
      "Beautiful scenery",
      "Large world to explore",
      "Many playable characters"
    ],
    cons: [
      "Progress can take time",
      "Some content uses gacha mechanics"
    ],
    thoughts:
      "A fun game for players who enjoy collecting characters, exploring beautiful places, and following a fantasy story."
  },
  {
    id: "minecraft",
    name: "Minecraft",
    genre: "Sandbox / Survival",
    categories: ["Adventure", "Simulation", "Cozy"],
    score: 5,
    cover: "images/minecraft/cover.jpg",
    screenshots: [
      "images/minecraft/scene-1.jpg",
      "images/minecraft/scene-2.jpg",
      "images/minecraft/scene-3.jpg"
    ],
    description:
      "Build anything you can imagine, gather resources, explore new places, or survive in a world made of blocks.",
    shortDescription:
      "Build, explore, and create your own world.",
    pros: [
      "Creative freedom",
      "Many ways to play",
      "Great with friends"
    ],
    cons: [
      "Can feel directionless",
      "Some mechanics take time to learn"
    ],
    thoughts:
      "A flexible game where you can relax, build something beautiful, or set your own challenges."
  },
  {
    id: "wuthering-waves",
    name: "Wuthering Waves",
    genre: "Open-World Action RPG",
    categories: ["RPG", "Action", "Adventure"],
    score: 4.5,
    cover: "images/wuthering waves/wuthering-waves-cover.jpg",
    screenshots: [
      "images/wuthering waves/scene-1.jpg",
      "images/wuthering waves/scene-2.jpg",
      "images/wuthering waves/scene-3.jpg"
    ],
    description:
      "Explore a mysterious world, master fast-paced combat, and meet Resonators on a journey through Solaris-3.",
    shortDescription:
      "A stylish action RPG with fast combat and exploration.",
    pros: [
      "Fluid combat",
      "Expressive character designs",
      "Enjoyable movement and exploration"
    ],
    cons: [
      "The story can feel complicated",
      "Requires time to learn combat systems"
    ],
    thoughts:
      "Worth trying if you enjoy action combat, character collection, and exploring a mysterious world."
  },
  {
    id: "stardew-valley",
    name: "Stardew Valley",
    genre: "Farming Simulation",
    categories: ["Simulation", "Cozy", "Adventure"],
    score: 4.5,
    cover: "images/stardew-valley/cover.jpg",
    screenshots: [
      "images/stardew-valley/scene-1.jpg",
      "images/stardew-valley/scene-2.jpg",
      "images/stardew-valley/scene-3.jpg"
    ],
    description:
      "Leave city life behind and build a new life by farming, fishing, making friends, and exploring the valley.",
    shortDescription:
      "A relaxing farming game with plenty to discover.",
    pros: [
      "Relaxing atmosphere",
      "Lots of activities",
      "Meaningful progression"
    ],
    cons: [
      "Days can feel short",
      "Some goals require repetitive tasks"
    ],
    thoughts:
      "A lovely option when you want to slow down, build a routine, and enjoy a cozy game at your own pace."
  }
];


/* ---------- Storage and state ---------- */

const STORAGE_KEYS = {
  reviews: "baiiself-community-reviews-v1",
  suggestions: "baiiself-game-suggestions-v1",
  theme: "baiiself-theme-v1"
};

let activeCategory = "All";
let currentGame = null;
let currentImageIndex = 0;

const $ = selector => document.querySelector(selector);

const gameGrid = $("#gameGrid");
const searchInput = $("#searchInput");
const reviewModal = $("#reviewModal");
const galleryImage = $("#galleryImage");
const galleryLabel = $("#galleryLabel");
const galleryCounter = $("#galleryCounter");
const galleryDots = $("#galleryDots");
const zoomView = $("#zoomView");
const zoomImage = $("#zoomImage");


/* ---------- Helpers ---------- */

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
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
        ${'<span class="empty-star">★</span>'.repeat(empty)}
      </span>
      <span class="rating-number">${rounded.toFixed(1)}/5</span>
    </div>`;
}

function localDate() {
  return new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}


/* ---------- Community game dropdown ---------- */

function populateReviewGameOptions() {
  const select = $("#reviewGame");
  if (!select) return;

  const previousValue = select.value;

  select.innerHTML = `
    <option value="">Select a game</option>
    ${games.map(game => `
      <option value="${escapeHTML(game.name)}">
        ${escapeHTML(game.name)}
      </option>
    `).join("")}
  `;

  if (games.some(game => game.name === previousValue)) {
    select.value = previousValue;
  }
}


/* ---------- Game cards ---------- */

function renderGames() {
  if (!gameGrid || !searchInput) {
    console.error("BaiiSelf: #gameGrid or #searchInput was not found.");
    return;
  }

  const keyword = searchInput.value.trim().toLowerCase();

  const filtered = games.filter(game => {
    const searchable = [
      game.name,
      game.genre,
      game.description,
      game.shortDescription,
      ...(game.categories || [])
    ];

    const matchesSearch = searchable.some(value =>
      String(value ?? "").toLowerCase().includes(keyword)
    );

    const matchesCategory =
      activeCategory === "All" ||
      (game.categories || []).includes(activeCategory);

    return matchesSearch && matchesCategory;
  });

  if (filtered.length === 0) {
    gameGrid.innerHTML = `
      <div class="no-results">
        <h3>No games found ✿</h3>
        <p>Try another game name or category.</p>
      </div>`;
    return;
  }

  gameGrid.innerHTML = filtered.map(game => `
    <article class="game-card">
      <div class="cover-wrap">
        <img
          class="game-cover"
          src="${escapeHTML(game.cover)}"
          alt="${escapeHTML(game.name)} cover"
          loading="eager"
        >

        <span class="score-badge">
          ★ ${Number(game.score).toFixed(1)}/5
        </span>

        <span class="image-placeholder" hidden>
          Image unavailable
          <small>${escapeHTML(game.cover)}</small>
        </span>
      </div>

      <div class="card-content">
        <h3>${escapeHTML(game.name)}</h3>

        <div class="game-genre">
          ${escapeHTML(game.genre)}
        </div>

        ${ratingHTML(game.score)}

        <p class="game-description">
          ${escapeHTML(game.shortDescription)}
        </p>

        <button
          class="review-button"
          type="button"
          data-review-game="${escapeHTML(game.id)}"
        >
          View Review →
        </button>
      </div>
    </article>
  `).join("");

  // Show a fallback only when the cover really fails to load.
  gameGrid.querySelectorAll(".game-cover").forEach(img => {
    img.addEventListener("error", () => {
      img.hidden = true;

      const placeholder =
        img.parentElement.querySelector(".image-placeholder");

      if (placeholder) {
        placeholder.hidden = false;
      }
    }, { once: true });
  });

  // Open the correct game's review.
  gameGrid.querySelectorAll("[data-review-game]").forEach(button => {
    button.addEventListener("click", () => {
      openReview(button.dataset.reviewGame);
    });
  });
}


/* ---------- Review gallery ---------- */

function getGalleryImages(game) {
  return [
    { src: game.cover, label: "Cover" },
    ...(game.screenshots || []).map((src, index) => ({
      src,
      label: `Screenshot ${index + 1}`
    }))
  ];
}

function openReview(gameId) {
  currentGame = games.find(game => game.id === gameId);
  if (!currentGame || !reviewModal) return;

  currentImageIndex = 0;

  $("#modalTitle").textContent = currentGame.name;
  $("#modalGenre").textContent = currentGame.genre;
  $("#modalRating").innerHTML = ratingHTML(currentGame.score);
  $("#modalDescription").textContent = currentGame.description;
  $("#modalThoughts").textContent = currentGame.thoughts;

  $("#modalPros").innerHTML = currentGame.pros
    .map(item => `<li>${escapeHTML(item)}</li>`)
    .join("");

  $("#modalCons").innerHTML = currentGame.cons
    .map(item => `<li>${escapeHTML(item)}</li>`)
    .join("");

  renderGallery();

  reviewModal.classList.add("open");
  reviewModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function renderGallery() {
  if (!currentGame || !galleryImage) return;

  const images = getGalleryImages(currentGame);
  const image = images[currentImageIndex];

  galleryImage.hidden = false;
  galleryImage.src = image.src;
  galleryImage.alt = `${currentGame.name} - ${image.label}`;

  if (galleryLabel) galleryLabel.textContent = image.label;

  if (galleryCounter) {
    galleryCounter.textContent =
      `${currentImageIndex + 1} / ${images.length}`;
  }

  if (galleryDots) {
    galleryDots.innerHTML = images.map((item, index) => `
      <button
        type="button"
        class="gallery-dot ${index === currentImageIndex ? "active" : ""}"
        aria-label="Show ${item.label}"
        aria-current="${index === currentImageIndex}"
        data-gallery-index="${index}"
      ></button>
    `).join("");

    galleryDots.querySelectorAll("[data-gallery-index]")
      .forEach(button => {
        button.addEventListener("click", () => {
          goToImage(Number(button.dataset.galleryIndex));
        });
      });
  }

  galleryImage.onerror = () => {
    if (galleryLabel) {
      galleryLabel.textContent = `${image.label} — image not found`;
    }
  };
}

function goToImage(index) {
  if (!currentGame) return;

  const images = getGalleryImages(currentGame);
  currentImageIndex = (index + images.length) % images.length;

  renderGallery();
}

function closeReview() {
  if (!reviewModal) return;

  reviewModal.classList.remove("open");
  reviewModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}


/* ---------- Image zoom ---------- */

function openZoom() {
  if (!galleryImage || !zoomImage || !zoomView) return;
  if (!galleryImage.src || galleryImage.naturalWidth === 0) return;

  zoomImage.src = galleryImage.src;
  zoomView.classList.add("open");
}

function closeZoom() {
  if (!zoomView || !zoomImage) return;

  zoomView.classList.remove("open");
  zoomImage.removeAttribute("src");
}


/* ---------- Community reviews ---------- */

function renderCommunityReviews() {
  const feed = $("#communityFeed");
  if (!feed) return;

  const reviews = readLocal(STORAGE_KEYS.reviews).slice().reverse();

  if (reviews.length === 0) {
    feed.innerHTML = `
      <div class="empty-state">
        No community reviews yet. Be the first to share your thoughts! ♡
      </div>`;
    return;
  }

  feed.innerHTML = reviews.map(review => {
    const score = Math.max(0, Math.min(5, Number(review.score) || 0));

    return `
      <article class="feed-card">
        <h4>${escapeHTML(review.game)}</h4>

        <div class="feed-meta">
          By ${escapeHTML(review.name)} · ${escapeHTML(review.date)}
        </div>

        <div class="feed-stars" aria-label="${score} out of 5 stars">
          ${"★".repeat(score)}${"☆".repeat(5 - score)}
          <span class="feed-meta">${score}/5</span>
        </div>

        <p>${escapeHTML(review.text)}</p>
      </article>`;
  }).join("");
}


/* ---------- Game suggestions ---------- */

function renderSuggestions() {
  const list = $("#suggestionList");
  if (!list) return;

  const suggestions = readLocal(STORAGE_KEYS.suggestions)
    .slice()
    .reverse();

  if (suggestions.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        No suggestions yet. Recommend a game you love! ✧
      </div>`;
    return;
  }

  list.innerHTML = suggestions.map(item => `
    <article class="suggestion-card">
      <h4>${escapeHTML(item.game)}</h4>

      <div class="feed-meta">
        Suggested ${escapeHTML(item.date)}
      </div>

      <span class="suggestion-tag">
        ${escapeHTML(item.category)}
      </span>

      ${item.reason
        ? `<p>${escapeHTML(item.reason)}</p>`
        : ""}
    </article>
  `).join("");
}


/* ---------- Community review form ---------- */

const communityReviewForm = $("#communityReviewForm");

if (communityReviewForm) {
  communityReviewForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = $("#reviewerName")?.value.trim() || "";
    const game = $("#reviewGame")?.value.trim() || "";
    const score = Number($("#reviewScore")?.value);
    const text = $("#reviewText")?.value.trim() || "";

    if (!name || !game || !text) return;

    const reviews = readLocal(STORAGE_KEYS.reviews);

    reviews.push({
      name,
      game,
      score,
      text,
      date: localDate()
    });

    const saved = saveLocal(STORAGE_KEYS.reviews, reviews);
    const status = $("#reviewStatus");

    if (status) {
      status.textContent = saved
        ? "Review added in this browser. Thank you for sharing! ♡"
        : "Could not save this review. Check your browser storage settings.";
    }

    if (saved) {
      event.target.reset();
      renderCommunityReviews();
    }
  });
}


/* ---------- Game suggestion form ---------- */

const suggestionForm = $("#suggestionForm");

if (suggestionForm) {
  suggestionForm.addEventListener("submit", event => {
    event.preventDefault();

    const game = $("#suggestedGame")?.value.trim() || "";
    const category = $("#suggestedCategory")?.value || "";
    const reason = $("#suggestedReason")?.value.trim() || "";

    if (!game) return;

    const suggestions = readLocal(STORAGE_KEYS.suggestions);

    suggestions.push({
      game,
      category,
      reason,
      date: localDate()
    });

    const saved = saveLocal(STORAGE_KEYS.suggestions, suggestions);
    const status = $("#suggestionStatus");

    if (status) {
      status.textContent = saved
        ? "Suggestion added in this browser. Thanks for the recommendation! ✧"
        : "Could not save this suggestion. Check your browser storage settings.";
    }

    if (saved) {
      event.target.reset();
      renderSuggestions();
    }
  });
}


/* ---------- Clear local reviews ---------- */

const clearReviewsButton = $("#clearLocalReviews");

if (clearReviewsButton) {
  clearReviewsButton.addEventListener("click", () => {
    if (!confirm("Remove all community reviews saved in this browser?")) {
      return;
    }

    localStorage.removeItem(STORAGE_KEYS.reviews);
    renderCommunityReviews();

    const status = $("#reviewStatus");
    if (status) status.textContent = "Local reviews cleared.";
  });
}


/* ---------- Gallery controls ---------- */

$("#prevImage")?.addEventListener("click", () => {
  goToImage(currentImageIndex - 1);
});

$("#nextImage")?.addEventListener("click", () => {
  goToImage(currentImageIndex + 1);
});

$("#closeModal")?.addEventListener("click", closeReview);
$("#zoomClose")?.addEventListener("click", closeZoom);

galleryImage?.addEventListener("click", openZoom);

reviewModal?.addEventListener("click", event => {
  if (event.target === reviewModal) closeReview();
});

zoomView?.addEventListener("click", event => {
  if (event.target === zoomView || event.target === zoomImage) {
    closeZoom();
  }
});


/* ---------- Review this game ---------- */

$("#reviewThisGame")?.addEventListener("click", () => {
  if (currentGame && $("#reviewGame")) {
    $("#reviewGame").value = currentGame.name;
  }

  closeReview();
  $("#community")?.scrollIntoView({ behavior: "smooth" });

  $("#reviewerName")?.focus({ preventScroll: true });
});


/* ---------- Search ---------- */

searchInput?.addEventListener("input", renderGames);


/* ---------- Category filters ---------- */

document.querySelectorAll(".category-button").forEach(button => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category || "All";

    document.querySelectorAll(".category-button").forEach(item => {
      item.classList.toggle("active", item === button);
    });

    renderGames();
  });
});


/* ---------- Theme switch ---------- */

const themeButton = $("#themeButton");

if (themeButton) {
  themeButton.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");

    themeButton.textContent = isDark
      ? "☀ Light Mode"
      : "☾ Dark Mode";

    try {
      localStorage.setItem(
        STORAGE_KEYS.theme,
        isDark ? "dark" : "light"
      );
    } catch {}
  });
}


/* ---------- Keyboard controls ---------- */

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    if (zoomView?.classList.contains("open")) {
      closeZoom();
    } else {
      closeReview();
    }
  }

  if (
    reviewModal?.classList.contains("open") &&
    !zoomView?.classList.contains("open")
  ) {
    if (event.key === "ArrowLeft") {
      goToImage(currentImageIndex - 1);
    }

    if (event.key === "ArrowRight") {
      goToImage(currentImageIndex + 1);
    }
  }
});


/* ---------- Initialize ---------- */

try {
  if (localStorage.getItem(STORAGE_KEYS.theme) === "dark") {
    document.body.classList.add("dark");

    if (themeButton) {
      themeButton.textContent = "☀ Light Mode";
    }
  }
} catch {}

// Populate the dropdown before users open the form.
populateReviewGameOptions();

// Render the game cards and other sections.
renderGames();
renderCommunityReviews();
renderSuggestions();
