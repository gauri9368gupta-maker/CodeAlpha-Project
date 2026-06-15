console.log("Image Gallery Loaded");

const uploadBtn = document.querySelector(".upload-btn");
const uploadInput = document.getElementById("upload");
const gallery = document.getElementById("gallery");
const searchInput = document.getElementById("search");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const closeBtn = document.getElementById("closeBtn");

const filterBtns =
  document.querySelectorAll(".filter-btn");

let currentIndex = 0;
let currentView = "all";


let images =
  JSON.parse(
    localStorage.getItem("galleryImages")
  ) || [];

images = images.map(img => ({
  favorite: false,
  deleted: false,
  uploadedAt: Date.now(),
  ...img
}));

// ======================
// Upload Button
// ======================

uploadBtn.addEventListener("click", () => {
  uploadInput.click();
});

// ======================
// Save Images
// ======================

function saveImages() {
  localStorage.setItem(
    "galleryImages",
    JSON.stringify(images)
  );
}

// ======================
// Render Current View
// ======================

function renderCurrentView() {
  renderImages(searchInput.value);
}

// ======================
// Render Gallery
// ======================

function renderImages(search = "") {

  gallery.innerHTML = "";

  let filteredImages = [...images];

  if (currentView === "favorites") {

    filteredImages =
      filteredImages.filter(
        img => img.favorite && !img.deleted
      );

  } else if (currentView === "trash") {

    filteredImages =
      filteredImages.filter(
        img => img.deleted
      );

  } else if (currentView === "recent") {

    filteredImages =
      filteredImages
        .filter(img => !img.deleted)
        .sort(
          (a, b) =>
            b.uploadedAt - a.uploadedAt
        );

  } else {

    filteredImages =
      filteredImages.filter(
        img => !img.deleted
      );
  }

  filteredImages =
    filteredImages.filter(img =>
      img.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  // gallery count
  const galleryCount =
    document.querySelector(".gallery-count");

  galleryCount.textContent =
    `${filteredImages.length} Images`;

  // empty gallery state
  if (filteredImages.length === 0) {

    gallery.innerHTML = `
    <div class="empty-state">
      <h2>No Images Found</h2>
      <p>Upload some images to get started.</p>
    </div>
  `;

    return;
  }

  filteredImages.forEach((image) => {

    const card =
      document.createElement("div");

    card.classList.add("card");

    card.innerHTML = `

      <div class="card-actions">
${image.deleted
        ?
        `
  <button class="restore-btn">♻️</button>

  <button class="permanent-delete-btn">
    ❌
  </button>
  `
        :
        `
  <button class="favorite-btn">
    ${image.favorite ? "❤️" : "🤍"}
  </button>

  <button class="delete-btn">🗑️</button>
`
      }

      </div>

      <img src="${image.url}" alt="${image.name}">

      <h3>${image.name}</h3>
    `;

    // Favorite

    const favoriteBtn =
      card.querySelector(".favorite-btn");

    if (favoriteBtn) {

      favoriteBtn.addEventListener(
        "click",
        (e) => {

          e.stopPropagation();

          image.favorite =
            !image.favorite;

          saveImages();
          renderCurrentView();

        }
      );
    }

    // Delete

    const deleteBtn =
      card.querySelector(".delete-btn");

    if (deleteBtn) {

      deleteBtn.addEventListener(
        "click",
        (e) => {

          e.stopPropagation();

          image.deleted = true;

          saveImages();
          renderCurrentView();

        }
      );
    }

    // Restore

    const restoreBtn =
      card.querySelector(".restore-btn");

    if (restoreBtn) {

      restoreBtn.addEventListener(
        "click",
        (e) => {

          e.stopPropagation();

          image.deleted = false;

          saveImages();
          renderCurrentView();

        }
      );
    }

    // Permanent Delete

    const permanentDeleteBtn =
      card.querySelector(".permanent-delete-btn");

    if (permanentDeleteBtn) {

      permanentDeleteBtn.addEventListener(
        "click",
        (e) => {

          e.stopPropagation();

          const confirmDelete = confirm(
            "Delete this image permanently?"
          );

          if (confirmDelete) {

            images = images.filter(
              img => img.url !== image.url
            );

            saveImages();
            renderCurrentView();

          }

        }
      );

    }

    // Open Lightbox

    card.addEventListener("click", () => {

      currentIndex =
        images.findIndex(
          img => img.url === image.url
        );

      openLightbox();

    });

    gallery.appendChild(card);

  });

}

// ======================
// Upload Images
// ======================

uploadInput.addEventListener(
  "change",
  (e) => {

    const files =
      Array.from(e.target.files);

    files.forEach(file => {

      const reader =
        new FileReader();

      reader.onload = (event) => {

        images.push({

          name: file.name,
          url: event.target.result,

          favorite: false,
          deleted: false,

          uploadedAt:
            Date.now()

        });

        saveImages();
        renderCurrentView();

      };

      reader.readAsDataURL(file);

    });

  }
);

// ======================
// Search
// ======================

searchInput.addEventListener(
  "input",
  () => {

    renderCurrentView();

  }
);

// ======================
// Filters
// ======================

filterBtns.forEach(btn => {

  btn.addEventListener(
    "click",
    () => {

      filterBtns.forEach(
        b => b.classList.remove("active")
      );

      btn.classList.add("active");

      currentView =
        btn.dataset.filter;

      renderCurrentView();

    }
  );

});

// ======================
// Lightbox
// ======================

function openLightbox() {

  lightbox.style.display = "flex";

  lightboxImg.src =
    images[currentIndex].url;

}

function closeLightbox() {

  lightbox.style.display = "none";

}

closeBtn.addEventListener(
  "click",
  closeLightbox
);

// Next

nextBtn.addEventListener(
  "click",
  () => {

    currentIndex++;

    if (currentIndex >= images.length) {
      currentIndex = 0;
    }

    lightboxImg.src =
      images[currentIndex].url;

  }
);

// Previous

prevBtn.addEventListener(
  "click",
  () => {

    currentIndex--;

    if (currentIndex < 0) {
      currentIndex =
        images.length - 1;
    }

    lightboxImg.src =
      images[currentIndex].url;

  }
);

// ESC + Arrow Keys

document.addEventListener(
  "keydown",
  (e) => {

    if (e.key === "Escape") {
      closeLightbox();
    }

    if (e.key === "ArrowRight") {
      nextBtn.click();
    }

    if (e.key === "ArrowLeft") {
      prevBtn.click();
    }

  }
);

// Click Outside Close

lightbox.addEventListener(
  "click",
  (e) => {

    if (e.target === lightbox) {
      closeLightbox();
    }

  }
);

// Initial Render

renderCurrentView();