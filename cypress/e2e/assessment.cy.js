import {
  StyleChecker,
  ValueChecker,
} from "./checkers.mjs";
import { checkMovie } from "./movieChecks.mjs";

import movies from "../../server/movie-model.js";

const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Film Noir",
  "History",
  "Horror",
  "Music",
  "Musical",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Short Film",
  "Sport",
  "Superhero",
  "Thriller",
  "War",
  "Western",
];

describe("Testing Exercise 2", () => {

  const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  function sampleString(length) {
    return _sampleString(ALPHABET, length)
  }

  function sampleURL() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    return `https://${_sampleString(alphabet, 1)}.${_sampleString(alphabet, 1)}/${_sampleString(alphabet, 1)}.jpg`
  }

  function _sampleString(alphabet, length) {
    
    return Array(length).join().split(',').map(function() { return alphabet.charAt(Math.floor(Math.random() * alphabet.length)); }).join('')
  }

  function sampleStringArray(min, max, length) {
    const result = []

    for (let i = 0; i < sampleInteger(min, max); i++) {
      result.push(sampleString(length))
    }

    return result;
  }

  function sampleGenreArray(min, max) {

    const indices = [];

    let n = sampleInteger(min, max);
    do {
      const i = sampleInteger(0, 23)
      if (indices.indexOf(i) == -1) {
        indices.push(i);
        n--
      }
    } while (n > 0)

    indices.sort((a, b) => a-b)

    const result = []

    for (let index of indices) {
      result.push(GENRES[index])
    }

    return result;
  }

  function sampleInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function createSampleMovie() {

    return {
      Title: sampleString(2),
      Released: "1970-01-01",
      Runtime: sampleInteger(30, 180),
      Genres: sampleGenreArray(1, 3),
      Directors: sampleStringArray(1, 3, 3),
      Writers: sampleStringArray(1, 3, 3),
      Actors: sampleStringArray(1, 3, 3),
      Plot: sampleString(16),
      Poster: sampleURL(),
      Metascore: sampleInteger(1, 100),
      imdbRating: sampleInteger(1, 100) / 10,
    };
  }

  it("1.1. movie-model.js exports the movies object containing at least 3 movies", () => {
    expect( movies, `Expected movies to be an object, but is of type '${typeof movies}'`).to.be.an("object");
    expect(Object.entries(movies).length).to.be.at.least(3);
    for (const [imdbID, movie] of Object.entries(movies)) {
      expect(imdbID, `Expected the movie id '${imdbID}' to be equal to the one inside the movie object, which is '${movie.imdbID}'`).to.be.eq(movie.imdbID);
      checkMovie(movie);
    }
  });

  it("1.2. GET endpoint /movies returns at least three correctly formatted movies", () => {
    cy.request("/movies").as("movies");
    cy.get("@movies").its("status").should("eq", 200);
    cy.get("@movies").should((response) => {
      expect(response.body, "Response expected to be an array").to.be.a("array");
      expect(response.body.length,"Response array expected to contain at least 3 movies").to.be.at.least(3);

      response.body.forEach((movie) => checkMovie(movie));
    });
  });

  function toChildTagNames(element) {
    return Array.from(element.children).map((e) => e.tagName);
  }

  function checkList(element, index, elements, parentTag = "P", childTag = "SPAN") {
    const child = element.children[index];
    expect(child.tagName).to.be.eq(parentTag);
    elements.forEach((e) => expect(child.textContent).to.contain(e));
    expect(toChildTagNames(child)).to.deep.eq(Array(elements.length).fill(childTag));
  }

  function checkLabeledList(label, element, index, elements) {
    expect(element.children[index - 1]).to.contain(label);
    checkList(element, index, elements, "UL", "LI");
  }

  it("1.3. Movie overview rendering is correct", () => {
    cy.visit("/").then(() => {
      cy.request("/movies").then((response) => {
        const movies = response.body;

        cy.get("article").then((movieElements) => {
          expect(movieElements.length).to.be.eq(movies.length);

          for (let i = 0; i < movieElements.length; i++) {
            const movieElement = movieElements[i];
            const movie = movies[i];

            expect(
              movieElement.children.length,
              `Movie article must have exacly 12 child elements, but has ${movieElement.children.length}`
            ).to.eq(12);
            expect(movieElement.id, `Movie id '${movieElement.id}' must match the IMDb id'${movie.imdbID}'`).to.eq(movie.imdbID);
            expect(toChildTagNames(movieElement),"Movie article child elements must be correct")
              .to.deep.eq(["IMG", "H1", "P", "P", "P", "P", "H2", "UL", "H2", "UL", "H2", "UL"]);

            expect(movieElement.children[0].src).contains(movie.Poster, {matchCase: false});
            expect(movieElement.children[1]).to.contain(movie.Title);

            const buttonElement = movieElement.children[2].children;
            expect(
              buttonElement.length,
              "Edit button paragraph must have one children, but has " +
                buttonElement.length
            ).to.eq(1);
            expect(buttonElement[0].tagName).to.be.eq("BUTTON");

            const infoElements = movieElement.children[3].children;

            expect(
              infoElements.length,
              "Movie information paragraph must have three children, but has " +
                infoElements.length
            ).to.eq(3);
            expect(infoElements[0]).to.contain("Runtime");
            const r = infoElements[0].innerText.match(/(\d+)h (\d+)m/);
            expect(parseInt(r[1]) * 60 + parseInt(r[2])).to.be.eq(
              parseInt(movie.Runtime)
            );
            expect(infoElements[1]).to.contain("\u2022");
            expect(infoElements[2])
              .to.contain("Released on")
              .and.to.contain(new Date(movie.Released).toLocaleDateString());

            checkList(movieElement, 4, movie.Genres);
            const genreElements = movieElement.children[4].children;
            for (let j = 0; j < genreElements.length; j++) {
              expect(genreElements[j]).to.have.class("genre");
            }

            expect(movieElement.children[5]).to.contain(movie.Plot);
            checkLabeledList("Director", movieElement, 7, movie.Directors);
            checkLabeledList("Writer", movieElement, 9, movie.Writers);
            checkLabeledList("Actor", movieElement, 11, movie.Actors);
          }
        });
      });
    });
  });

  it("2.1. GET endpoint /movies/:imdbID returns correctly formatted movie data", () => {
    const imdbID = Object.keys(movies)[0];

    cy.request(`/movies/${imdbID}`).as("movie");
    cy.get("@movie").its("status").should("eq", 200);
    cy.get("@movie").should((response) => {
      expect(imdbID, `Expected the requested id '${imdbID}' to be equal to the one in the response, which is '${response.body.imdbID}'`).to.be.eq(response.body.imdbID);
      checkMovie(response.body);
    });
  });

  it("2.2. Navigation to edit mode and back to the overview works", () => {
    cy.visit("/").then(() => {
      cy.request("/movies").then((response) => {
        const movie = response.body[0];

        cy.get(`article#${movie.imdbID}`).then(() => {
          cy.get(`article#${movie.imdbID} button:contains('Edit')`).click();

          cy.location("pathname").should("eq", "/edit.html");

          cy.get('button:contains("Cancel")').click();

          cy.location("pathname").should("eq", "/index.html");
        });
      });
    });
  });

  it("2.3. Movie form rendering is correct and movie data is set correctly", () => {
    cy.request("/movies").then((response) => {
      const movie = response.body[0];

      cy.visit(`/edit.html?imdbID=${movie.imdbID}`).then(() => {
        const document = cy.state("document");
        const formElements = document.forms[0].elements;
        const inputTags = Array.from(formElements).map((e) => e.tagName);

        expect(inputTags, "Form child elements must be correct")
          .to.deep.eq([ "INPUT", "INPUT", "INPUT", "INPUT", "TEXTAREA", "INPUT", "INPUT", "INPUT", "SELECT", "INPUT", "INPUT", "INPUT", "BUTTON", "BUTTON"]);

        cy.get("input#imdbID")
          .should("exist")
          .should("have.attr", "type", "hidden")
          .should("have.value", movie.imdbID);
        cy.get("input#Title")
          .should("exist")
          .should("have.attr", "type", "text")
          .should("have.value", movie.Title)
          .should("have.attr", "required");
        cy.get("input#Released")
          .should("exist")
          .should("have.attr", "type", "date")
          .should("have.value", movie.Released)
          .should("have.attr", "required");
        cy.get("input#Runtime")
          .should("exist")
          .should("have.attr", "type", "number")
          .should("have.attr", "min", "0")
          .should("have.value", movie.Runtime)
          .should("have.attr", "required");
        cy.get("textarea#Plot")
          .should("exist")
          .should("have.attr", "row", "5")
          .should("have.value", movie.Plot)
          .should("have.attr", "required");
        cy.get("input#Poster")
          .should("exist")
          .should("have.attr", "type", "url")
          .should("have.value", movie.Poster)
          .should("have.attr", "required");
        cy.get("input#Metascore")
          .should("exist")
          .should("have.attr", "type", "number")
          .should("have.attr", "min", "0")
          .should("have.attr", "max", "100")
          .should("have.value", movie.Metascore)
          .should("have.attr", "required");
        cy.get("input#imdbRating")
          .should("exist")
          .should("have.attr", "type", "number")
          .should("have.attr", "min", "0")
          .should("have.attr", "max", "10")
          .should("have.attr", "step", "0.1")
          .should("have.value", movie.imdbRating)
          .should("have.attr", "required");
        cy.get("select#Genres")
          .should("exist")
          .should("have.attr", "multiple");
        cy.get("select#Genres")
          .should("have.attr", "required");

        cy.get("select#Genres>option")
          .should("exist")
          .then((options) => {
            expect(options.length,`Expected 24 genres to be available in the Genre select element: ${GENRES.join(", ")}`).to.be.eq(24);

            const values = [];
            for (let option of options) {
              expect(option.value === option.textContent, `Expected the value and the text of genre option ${option.value} to be equal, but they differ.`)
              values.push(option.value)
            }

            for (const genre of GENRES) {
              const indexOfGenre = values.indexOf(genre);
              expect(
                indexOfGenre,
                `Expected to find genre '${genre}' in the Genre select element`
              ).to.be.at.least(0);
            }
          });

        cy.get("input#Directors")
          .should("exist")
          .should("have.attr", "type", "text")
          .should("have.value", movie.Directors.join(","))
          .should("have.attr", "required");
        cy.get("input#Writers")
          .should("exist")
          .should("have.attr", "type", "text")
          .should("have.value", movie.Writers.join(","))
          .should("have.attr", "required");
        cy.get("input#Actors")
          .should("exist")
          .should("have.attr", "type", "text")
          .should("have.value", movie.Actors.join(","))
          .should("have.attr", "required");

        for (const formElement of formElements) {
          if (formElement.type === "hidden" || formElement.type === "button" ) continue;
          cy.get(`label[for="${formElement.id}"]`)
            .should('exist')
            .should('not.be.empty')
        }

        cy.get('form button:contains("Save")').should('exist')
      });
    });
  });

  it("2.4. Styling of edit.html is set up correctly", () => {
    cy.visit("/edit.html").then(() => {
      const document = cy.state("document");
      expect(document.styleSheets.length, "Expect document to contain one style sheet").to.eq(1);

      const sheet = document.styleSheets[0];

      const importRule = sheet.rules[0];
      expect(importRule.type, "Expect the first rule of the style sheet to be an import rule").to.be.eq(3);
      expect(importRule.href, "Expect the import rule to reference 'base.css'" ).to.be.eq("base.css");

      new StyleChecker("body", importRule.styleSheet).eq("font-family", '"Trebuchet MS", sans-serif');

      new StyleChecker("button", importRule.styleSheet)
        .compound("padding", new ValueChecker(0, 16).first(), new ValueChecker(0, 16).second())
        .compound("margin-right", new ValueChecker(2, 16))
        .compound("border-width", new ValueChecker(0, 4))
        .compound("border-radius", new ValueChecker(2, 32))
        .compound("font-size", new ValueChecker(110, 150, "%"));

      new StyleChecker("input, select, textarea", sheet).compound("width", new ValueChecker(100, 100, "%"))
    });

    
  });

  it("3.1. PUT endpoint /movies/:imdbID accepts a modified movie and updates it in the server-side object", () => {

    cy.request("/movies").as("movies");
    cy.get("@movies").its("status").should("eq", 200);
    cy.get("@movies").then(response => {

      const movie = response.body[0];

      const sampleMovie = createSampleMovie()

      const data = {
        ...sampleMovie,
        imdbID: movie.imdbID,
        Title: "Modified " + (movie.Title.startsWith("Modified ") ? Number(movie.Title.substring(9)) + 1 : 0),
      };
  
      cy.request({ method: "PUT", url: `/movies/${movie.imdbID}`, body: data }).as(
        "response"
      );
      cy.get("@response").then((response) => {
        expect(response.status).to.be.oneOf([200, 204]);
      });
  
      cy.request(`/movies/${movie.imdbID}`).as("movie");
      cy.get("@movie").its("status").should("eq", 200);
      cy.get("@movie").should((response) => {
        expect(response.body).to.deep.equal(data);
      });

    });

  });

  it("3.2. PUT endpoint /movies/:imdbID accepts a new movie and inserts it in the server-side object", () => {
    cy.request("/movies").as("movies");
    cy.get("@movies").its("status").should("eq", 200);
    cy.get("@movies").then((response) => {
      const movieCount = response.body.length;

      let imdbID = "tt" + ("0000000" + movieCount).slice(-7);

      const sampleMovie = createSampleMovie()

      const data = { ...sampleMovie, imdbID, Title: "New " + movieCount };

      cy.request({ method: "PUT", url: `/movies/${imdbID}`, body: data }).as(
        "response"
      );
      cy.get("@response").then((response) => {
        expect(response.status).to.be.eq(201);
      });

      cy.request(`/movies/${imdbID}`).as("movie");
      cy.get("@movie").its("status").should("eq", 200);
      cy.get("@movie").should((response) =>
        expect(response.body).to.deep.equal(data)
      );

      cy.request("/movies").as("movies");
      cy.get("@movies").its("status").should("eq", 200);
      cy.get("@movies").should((response) => {
        const updatedMovies = response.body;
        expect(updatedMovies, "Response expected to be an array").to.be.an(
          "array"
        );
        expect(
          updatedMovies.length,
          "Response array expected to contain an additional movie"
        ).to.be.eq(movieCount + 1);

        const newMovie = updatedMovies.find((movie) => movie.imdbID === imdbID);
        expect(newMovie).to.deep.equal(data);

        response.body.forEach((movie) => checkMovie(movie));
      });
    });
  });
  
  it("3.3. Movie form uses PUT endpoint /movies/:imdbID to update the movie", () => {
    cy.request("/movies").then((response) => {
      const movie = response.body[0];

      cy.visit(`/edit.html?imdbID=${movie.imdbID}`).then(() => {

        cy.get('input#imdbID').should('have.value', movie.imdbID).then(() => {

          const document = cy.state("document");
          const formElements = Array.from(document.forms[0].elements).filter(element => element.id)

          const sampleMovie = createSampleMovie()
  
          for (const formElement of formElements) {
            if (formElement.id === 'imdbID') continue;

            if (formElement.id === 'Genres') {
              for (const option of formElement.options) {
                option.selected = sampleMovie[formElement.id].indexOf(option.value) >= 0
              }
            } else {
              formElement.value = sampleMovie[formElement.id]
            }
          }
  
          cy.intercept('PUT', `/movies/${document.forms[0].imdbID.value}`).as('updateMovie')
  
          cy.get('form button:contains("Save")').click()
  
          cy.wait('@updateMovie').then(({request}) => {
            const expectedData = {... sampleMovie, imdbID: movie.imdbID}
            expect(request.body, `Expected data PUT to the server to be '${JSON.stringify(expectedData)}', but was '${JSON.stringify(request.body)}'`).to.deep.equal(expectedData)
          })

        })
      })
    })
  });


});
