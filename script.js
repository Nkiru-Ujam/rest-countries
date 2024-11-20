"use strict";
const dropdown = document.querySelector(".dropdown"); //used to handle dropdown actions
const select = document.querySelector(".select"); //refers to the clickable part of the dropdown where the selected value will appear
const caret = document.querySelector(".caret"); //toggled when dropdown is opened or closed
const menu = document.querySelector(".menu"); //contains dropdown options
const options = document.querySelectorAll(".menu li"); // items in the dropdown menu users can select
const selected = document.querySelector(".selected"); //updates the element with the user's selection
const toggleBtn = document.querySelector(".toggle"); // toggles btw darkmode and light mode

const containerEl = document.querySelector("main"); // contains countries that are mapped to the screen
const searchBtn = document.querySelector(".search-btn"); //tracks user's input for search functionality
const modalContainer = document.querySelector(".modal-container"); //manages modal visibility
const section = document.querySelector("#sec"); //decides if modal is shown or hidden

const modalImage = document.querySelector(".modal-image"); //displays the flag of the country
const modalDetails = document.querySelector(".country-lhs"); //displays additional country data
const modalInfo = document.querySelector(".country-rhs");
const modalBorder = document.querySelector(".border"); //displays the borders of the selcted country
const closeBtn = document.querySelector(".cancel-btn"); //closes the modal and restores the main view when clicked
// console.log(modalContainer, section, modalImage);

// enables dark mode functionality
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("darkmode");
});

// allows users to close and open the dropdow menu
select.addEventListener("click", () => {
  caret.classList.toggle("caret-rotate");
  menu.classList.toggle("menu-open");
});

// changes the display text to the text of the option clicked
options.forEach((option) => {
  option.addEventListener("click", () => {
    selected.innerText = option.innerText;
    caret.classList.remove("caret-rotate");
    menu.classList.remove("menu-open");

    //updates the selected region and call the fn to filter countries when the user clicks an option
    const region = option.getAttribute("data-region");
    filterByRegion(region);
  });
});

//generates the HTML for each country to be shown in the containerEl
function displayData(country) {
  return `
  <div class="country-cont" data-name="${country.name}">
   <div class="country-image">
  <img src="${country.flag}" class="image">
  </div>
          <div class="country-desc">
            <h4 class="country-name">${country.name}</h4>
            <p class="country-pop">Population: <span>${country.population}</span></p>
            <p class="country-reg">Region: <span>${country.region}</span></p>
            <p class="country-cap">Capital: <span>${country.capital}</span></p>
          </div>
          </div>
  `;
}

// retrives data for all countries, used in multiple places in the code
async function getData() {
  // fetch("./data/data.json")
  //   .then((res) => {
  //     return res.json();
  //   })
  //   .then((data) => {
  //     // allCountries = data;
  //     console.log(data);
  //     const mapped = data.slice(0, 24).map(displayData);
  //     containerEl.innerHTML = mapped.join(" ");
  //   });
  try {
    const response = await fetch("./data/data.json");
    const data = await response.json();
    // console.log(data);
    // countries = data;
    return data;
  } catch (error) {
    alert(error);
  }
}

//allows users to view detailed country info in a modal
function handleCountryClick(countries) {
  const countriesContainer = document.querySelectorAll(".country-cont");
  // console.log(countriesContainer);

  // attachs a click event to each country element so when clicked it displays additional info about d clicked country
  countriesContainer.forEach((countryCont, index) => {
    countryCont.addEventListener("click", () => {
      const countryName = countryCont.dataset.name;
      const countryData = countries.find((c) => c.name === countryName);
      // console.log(countries);
      // console.log(countryData);
      // countryPopulation.textContent = countryPop;

      if (countryData) {
        openModal(countryData);
        modalContainer.classList.add("active");
        section.classList.add("hidden");
        containerEl.classList.add("hidden");
      }
      // console.log(modalImage);
    });
  });
}

// console.log(getData());

//handles loading the initial set of countries and managing interactions
async function getCountryData() {
  const countries = await getData();
  const mapped = countries.slice(0, 32).map(displayData);

  // console.log(mapped);
  containerEl.innerHTML = mapped.join(" ");

  handleCountryClick(countries);
}

//provides functionality to exit the modal view
closeBtn.addEventListener("click", () => {
  modalContainer.classList.remove("active");
  section.classList.remove("hidden");
  containerEl.classList.remove("hidden");
});

//enables live search functionality to filter countries
searchBtn.addEventListener("input", async () => {
  const countries = await getData();

  const filteredCountries = countries.filter((country) => {
    const searched = searchBtn.value.toLowerCase();
    // const test = country.name.toLowerCase().includes(searched) ? country : "";
    // return test;
    let test;
    if (country.name.toLowerCase().startsWith(searched)) {
      test = country;
    } else {
      test = "";
    }

    // console.log(test);
    return test;
  });
  containerEl.innerHTML = filteredCountries.map(displayData).join(" ");
  console.log(containerEl);
  handleCountryClick(countries);
});

//updates the displayed countries based on the selcted region
async function filterByRegion(region) {
  // console.log("filter by region");
  const countries = await getData();
  const filteredRegion = countries.filter((country) => {
    const selectedRegion = selected.textContent;
    const demo = country.region.includes(selectedRegion) ? country : "";
    // console.log(demo);
    return demo;
    // country.region === region;
    // console.log(selectedRegion);
  });
  containerEl.innerHTML = filteredRegion.map(displayData).join(" ");
  handleCountryClick(countries);

  // console.log(selected.textContent);
}

//displays the country details in a modal for more info
function openModal(data) {
  modalImage.innerHTML = `
              <img src="${data.flag}" alt="" id="modal-img" />

`;

  modalDetails.innerHTML = `
  <h1 class="country-title">${data.name}</h1>
  <p class="native-name">Native Name: <span>${data.nativeName}</span></p>
  <p class="country-pop">Population: <span>${data.population}</span></p>
  <p class="country-reg">Region: <span>${data.region}</span></p>
  <p class="country-reg">Sub Region: <span>${data.subregion}</span></p>
  <p class="country-cap">Capital: <span>${data.capital}</span></p>
  `;
  const languages = data.languages.map((lang) => lang.name).join(",");
  const borders =
    data.borders && data.borders.length > 0 ? data.borders.join(" ") : "";
  const currencies = data.currencies.map((currency) => currency.name);
  // console.log(borders);
  modalInfo.innerHTML = `<p class="top-level">Top Level Domain: <span>${data.topLevelDomain[0]}</span></p>
  <p class="currencies">Currencies: <span>${currencies}</span></p>
  <p class="lang">
  Languages: <span>${languages}</span></p>`;

  modalBorder.innerHTML = `
  
  <p>Border Countries: <span>${borders}</span></p>
  `;
}

getCountryData();

// let currentSelectedCountry = {};
// let countryImage = countryCont.querySelector(".image").src;

// let countryName = countryCont.querySelector(".country-name").textContent;
// let countryPop = countryCont.querySelector(".country-pop").textContent;
// let countryReg = countryCont.querySelector(".country-reg").textContent;
// let countryCap = countryCont.querySelector(".country-cap").textContent;
// let countryNavName = country.querySelector(".native-name")
// currentSelectedCountry.countryName = countryName;
// currentSelectedCountry.countryImage = countryImage;
// currentSelectedCountry.countryPop = countryPop;
// currentSelectedCountry.countryReg = countryReg;
// currentSelectedCountry.countryCap = countryCap;
// modalImage.src = currentSelectedCountry.countryImage;
// countryTitle.textContent = currentSelectedCountry.countryName;
// countryPopulation.textContent = currentSelectedCountry.countryPop;
// countryRegion.textContent = currentSelectedCountry.countryReg;
// countryCapital.textContent = currentSelectedCountry.countryCap;
// console.log(modalImage.src);

// modalImage.src = countryImage;
