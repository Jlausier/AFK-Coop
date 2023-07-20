/**
 * Genre Checkboxes
 */
const genreLinks = [
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
    `<div id="${id}" data-state="" data-type="${type}" class="genre-btn p-2 m-1 select-none cursor-pointer rounded drop-shadow-sm flex flex-col justify-center items-center bg-gradient-to-b from-indigo-400 to-indigo-500 hover:bg-gradient-to-b hover:from-pink-500 hover:to-green-500 transition">
      <img src="${image}" class="w-12 m-2">
      <div class="pt-1 font-medium text-black text-sm">${title}</div>
     </div>`
  )
);

/**
 * Contact Links
 */
const contactLinks = [
  {
    github: "https://github.com/Jlausier",
    image: "./assets/images/contact/jake.jpg",
    name: "Jacob Lausier",
  },
  {
    github: "https://github.com/GormanBrian",
    image: "./assets/images/contact/brian.jpg",
    name: "Brian Gorman",
  },
  {
    github: "https://github.com/alfaro-matttthew",
    image: "./assets/images/contact/matthew.png",
    name: "Alfaro Matthew",
  },
].map(({ github, image, name }, index) =>
  $(
    `<a href="${github}" target="_blank" 
        class="p-2 ${
          index === 2 ? "mb-2" : ""
        } rounded-full shadow-lg relative opacity-60 bg-gray-800 flex items-center transition hover:opacity-100 hover:-translate-y-1"
     >
      <img src="${image}" class="h-12 w-12 object-cover rounded-full" />
      <p class="text-xl absolute m-auto left-0 right-0 text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500 text-center bg-clip-text font-bold">
        ${name}
      </p>
    </a>`
  )
);

$(() => {
  $("#genre-grid").append(...genreLinks);
  $("#contact-list").append(...contactLinks);
});
