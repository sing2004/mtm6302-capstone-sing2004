document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("ramneek-date");
  const button = document.getElementById("ramneek-button");
  const img = document.getElementById("ramneek-image");
  const desc = document.getElementById("ramneek-description");
  const addBtn = document.getElementById("ramneek-add");
  const favList = document.getElementById("ramneek-favourites");

  const API_KEY = "DEMO_KEY"; // Replace with your NASA API key
  let currentAPOD = null;

  // Limit to today's date
  dateInput.max = new Date().toISOString().split("T")[0];

  button.addEventListener("click", async () => {
    const date = dateInput.value;
    if (!date) return alert("Please select a date");

    const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`);
    const data = await res.json();

    if (data.media_type !== "image") {
      img.style.display = "none";
      desc.textContent = "The selected date contains a video, not an image.";
      return;
    }

    img.src = data.url;
    img.alt = data.title;
    img.style.display = "block";
    desc.textContent = data.explanation;
    currentAPOD = data;
  });

  addBtn.addEventListener("click", () => {
    if (!currentAPOD) return;

    const favs = JSON.parse(localStorage.getItem("ramneek_favs") || "{}");

    // Avoid duplicates
    if (favs[currentAPOD.date]) {
      alert("Already in favourites!");
      return;
    }

    favs[currentAPOD.date] = {
      date: currentAPOD.date,
      title: currentAPOD.title,
      url: currentAPOD.url
    };

    localStorage.setItem("ramneek_favs", JSON.stringify(favs));
    renderFavourites();
  });

  function renderFavourites() {
    const favs = JSON.parse(localStorage.getItem("ramneek_favs") || "{}");
    favList.innerHTML = "";

    if (Object.keys(favs).length === 0) {
      favList.innerHTML = "<p style='text-align:center;'>No favourites yet.</p>";
      return;
    }

    Object.values(favs).forEach(fav => {
      const div = document.createElement("div");
      div.className = "ramneek-fav-item";
      div.innerHTML = `
        <span>${fav.title}</span>
        <button onclick="removeFavourite('${fav.date}')">✕</button>
      `;
      favList.appendChild(div);
    });
  }

  window.removeFavourite = function (date) {
    const favs = JSON.parse(localStorage.getItem("ramneek_favs") || "{}");
    delete favs[date];
    localStorage.setItem("ramneek_favs", JSON.stringify(favs));
    renderFavourites();
  };

  renderFavourites();
});
