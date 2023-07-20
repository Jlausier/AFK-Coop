const genreGridItems = [
  {
    id: "5",
    image: "./assets/images/icons/rifle-100.png",
    title: "Shooter",
    type: "genres",
  },
  {
    id: "8",
    image: "./assets/images/icons/apple-arcade-100.png",
    title: "Platform",
    type: "genres",
  },
  {
    id: "10",
    image: "./assets/images/icons/racing-100.png",
    title: "Racing",
    type: "genres",
  },
  {
    id: "12",
    image: "./assets/images/icons/viking-helmet-100.png",
    title: "RPG",
    type: "genres",
  },
  {
    id: "14",
    image: "./assets/images/icons/exercise-100.png",
    title: "Sports",
    type: "genres",
  },
  {
    id: "31",
    image: "./assets/images/icons/map-100.png",
    title: "Adventure",
    type: "genres",
  },
  {
    id: "33",
    image: "./assets/images/icons/arcade-cabinet-100.png",
    title: "Arcade",
    type: "genres",
  },
  {
    id: "19",
    image: "./assets/images/icons/ghost-100.png",
    title: "Horror",
    type: "themes",
  },
  {
    id: "44",
    image: "./assets/images/icons/romance-100.png",
    title: "Romance",
    type: "themes",
  },
].map(({ id, image, title, type }) =>
  $(
    `<a id="${id}" data-state="" data-type="${type}" class="genre-btn p-2 m-1 select-none cursor-pointer rounded drop-shadow-sm flex flex-col justify-center items-center bg-gradient-to-b from-indigo-400 to-indigo-500 hover:bg-gradient-to-b hover:from-pink-500 hover:to-green-500 transition">
      <img src="${image}" class="w-12 m-2">
      <div class="pt-1 font-medium text-black text-sm">${title}</div>
     </a>`
  )
);

$(() => {
  $("#genre-grid").append(...genreGridItems);
});
