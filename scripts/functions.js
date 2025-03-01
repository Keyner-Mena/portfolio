window.addEventListener("DOMContentLoaded", adjustCarousel);
window.addEventListener("resize", adjustCarousel);
window.onload = function () {
  window.scrollTo(0, 0);
};

const carouselContent = document.getElementById("carousel-content");

function adjustCarousel() {
  const isSmallScreen = window.innerWidth < 1201;
  carouselContent.innerHTML = "";

  let carouselItems = 0;
  if (isSmallScreen) {
    carouselItems = 1;
  } else {
    carouselItems = 2;
  }

  generateCarousel(carouselItems);
}
$(document).ready(function () {
  /* Redirect Buttons */
  let btns_redirect = document.getElementsByClassName("redirect");
  Array.from(btns_redirect).forEach((btn) => {
    btn.addEventListener("click", function () {
      const navHeight = document.querySelector("nav").offsetHeight;
      const collapsiblePart = $("#navbarColor02");
      let visibleNavHeight;
      if (collapsiblePart.hasClass("show")) {
        const collapsibleHeight = collapsiblePart.outerHeight();
        visibleNavHeight = navHeight - collapsibleHeight;
      } else {
        visibleNavHeight = navHeight;
      }
      let name_section = btn.getAttribute("name");
      let section = document.getElementById(name_section);
      let topPos =
        section.getBoundingClientRect().top +
        window.scrollY -
        (visibleNavHeight + 30);
      window.scrollTo({ top: topPos, behavior: "smooth" });
    });
  });
  $(".navbar-nav a").on("click", function () {
    $(".navbar-collapse").collapse("hide");
  });
});

// Typed text
var typed = new Typed("#typed-text", {
  strings: [
    "Hi! Welcome to <span class='text-color'> my portfolio</span> ;)",
    "Im <span class='text-color'> Keyner Mena</span>.",
    "A <span class='text-color'> Computer Engineer</span>.",
    "So...",
  ],
  typeSpeed: 100,
  backSpeed: 50,
  loop: true,
});

// Sections Animation
document.addEventListener("DOMContentLoaded", function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated");
        observer.unobserve(entry.target);
      }
    });
  });

  document.querySelectorAll(".terminal-loader").forEach((element) => {
    observer.observe(element);
  });
});

// Project Cards Data
const cardsData = [
  {
    header: "CRUD in JS",
    technologies:
      "<li><b> HTML </b></li> <li><b> CSS </b></li> <li><b> JS </b></li> <li><b> PHP </b></li> <li><b> AJAX </b></li> <li><b> Bootstrap </b></li> <li><b> API </b></li> <li><b> PHPMyAdmin </b></li>",
    img: "./images/interface-crud-js.png",
    text: "Consists in a structured project in which I create an API using PHP to connect the DB of PHPMyAdmin with the Frontend by using the different endpoints.",
    link: "https://github.com/Keyner-Mena/CRUD-JS-PHP.git",
  },
  {
    header: "E-Commerce",
    technologies:
      "<li><b> HTML </b></li> <li><b> CSS </b></li> <li><b> JS </b></li> <li><b> Bootstrap </b></li>",
    img: "./images/interface-e-commerce.png",
    text: "This website is an e-commerce with a cafeteria theme, which includes sections/modules as: Welcome(Home), Menu, Shopping Cart, Billing and a comments/contact section.",
    link: "https://github.com/Keyner-Mena/Proyecto-Cafeteria.git",
  },
  {
    header: "Web with AJAX",
    technologies:
      "<li><b> HTML </b></li> <li><b> CSS </b></li> <li><b> JS </b></li> <li><b> AJAX </b></li> <li><b> JSON </b></li> <li><b> JSON Server </b></li> <li><b> Bootstrap </b></li>",
    img: "./images/interface-ajax.png",
    text: "This Web site is an implementation of AJAX for a HTML form that handles the data that is sent to a JSON which works as a DB. Include different validation rules.",
    link: "https://github.com/Keyner-Mena/Web-AJAX.git",
  },
  {
    header: "Tasks App",
    technologies:
      "<li><b> HTML </b></li> <li><b> Bootstrap </b></li> <li><b> JS </b></li> <li><b> JQuery </b></li> <li><b> PHP </b></li> <li><b> PHPMyAdmin </b></li>",
    img: "./images/interface-tasks-app.png",
    text: "This web site consists in the administration of personal tasks. I did it to increase my skills in the technologies I use. (It includes CRUD operations).",
    link: "https://github.com/Keyner-Mena/Tasks-App.git",
  },
  {
    header: "Memory Game",
    technologies: "<li> <b> Visual Basic </b> </li>",
    img: "./images/interface-memory.png",
    text: "Consists in a game in the Visual Studio 2022, making use of Visual Basic in Windows Form (.NET Framework) applications and the tools for the development of desktop applications.",
    link: "https://github.com/Keyner-Mena/Memory-game-VB.git",
  },
  {
    header: "Pokedex",
    technologies:
      "<li> <b> Python </b> </li> <li> <b> Flet (from Flutter) </b> </li> <li> <b> API </b> </li>",
    img: "./images/interface-pokedex.png",
    text: "I made this application to learn how Flet works, and also integrate it in a asynchronous way to be able to make requests to an API like the <a href='https://pokeapi.co/'>PokeAPI</a> and display the info on screen as a pokedex.",
    link: "https://github.com/Keyner-Mena/Pokedex-Python.git",
  },
  {
    header: "CRUD (ANGULAR)",
    technologies:
      "<li><b> ANGULAR </b></li> <li><b> Bootstrap </b></li> <li><b> PHP </b></li> <li><b> PHPMyAdmin </b></li>",
    img: "./images/interface-crud-angular.png",
    text: "I built a CRUD integrated with PHP to manage the API that connects to a SQL DB. And then I integrate it with the Frontend by using ANGULAR. It also uses Bootstrap as other framework to the app.",
    link: "https://github.com/Keyner-Mena/CRUD-ANGULAR.git",
  },
  {
    header: "Project in Figma",
    technologies: "<li><b> Figma </b></li>",
    img: "./images/interface-figma-app.png",
    text: "This interface is for a multifunctional tourism system that allows users to easily search and find information about points of interest and services in the country they are visiting.",
    link: "https://www.figma.com/file/YhBYQLV2blY8IKKqR68eOC/Untitled?type=design&node-id=0%3A1&mode=design&t=aVYGbIL2rBtHXK19-1",
  },
];

/* Generate carousel */
function generateCarousel(numOfItems) {
  let carouselItems = "";
  for (let i = 0; i < cardsData.length; i += numOfItems) {
    carouselItems += `
      <div class="carousel-item ${i === 0 ? "active" : ""}">
        <div class="row justify-content-center">
          ${cardsData
            .slice(i, i + numOfItems)
            .map(
              (card) => `
              <div class="col-md-4 col-12 background-card">
                <div class="card mb-2">
                  <h3 class="card-header">${card.header}</h3>
                  <img src="${
                    card.img
                  }" alt="Project image"  class="project-image d-block user-select-none">
                  <div class="card-body">
                    <h5 class="card-title">Made with:</h5>
                    <ul class="tech-items">${card.technologies}</ul>
                  </div>
                  <div class="card-body">
                    <p class="card-text">${card.text}</p>
                  </div>
                  <div class="card-body">
                    <a type="button" class="neon-button" href="${
                      card.link
                    }" target="_blank" rel="noopener"> 
                      <img
                        src="${
                          card.header == "Project in Figma"
                            ? "./images/figma.png"
                            : "./images/github.png"
                        }"
                        alt="Logo"
                        class="logo"
                      />
                      ${
                        card.header == "Project in Figma"
                          ? "View in Figma"
                          : "View repository"
                      }
                    </a>
                  </div>
                </div>
              </div>
              `
            )
            .join("")}
        </div>
      </div>
    `;
  }
  carouselContent.innerHTML = carouselItems;
}
