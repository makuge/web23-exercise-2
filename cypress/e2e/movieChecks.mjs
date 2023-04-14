const DATE_REGEX = new RegExp("^\\d{4}-\\d{2}-\\d{2}$");
const ID_REGEX = new RegExp("^tt\\d{7}$")

function checkArray(array, name, type) {
  expect(array, `Movie property "${name}" expected to be an Array`).to.be.an(
    "array"
  );
  array.forEach((item) =>
    expect(
      item,
      `Each item contained in Movie property "${name}" is expected to be of type "${type}"`
    ).to.be.a(type)
  );
}

function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

export function checkMovie(movie) {
  expect(movie, "Movie expected to have 12 pre-defined keys").to.have.keys(
    "imdbID",
    "Title",
    "Released",
    "Runtime",
    "Genres",
    "Directors",
    "Writers",
    "Actors",
    "Plot",
    "Poster",
    "Metascore",
    "imdbRating"
  );
  expect(movie.imdbID).to.be.a("string");
  expect(movie.imdbID, 'Movie property "imdbID" is expected to match the IMDB id format').to.match(ID_REGEX)

  expect(movie.Title).to.be.a("string");
  expect(
    movie.Released,
    'Movie property "Released" is expected to be a ISO 8601 formatted date string'
  ).to.match(DATE_REGEX);

  expect(
    movie.Runtime,
    'Movie property "Runtime" is expected to be a number greater or equal to 1'
  )
    .to.be.a("number")
    .and.to.be.at.least(1);

  const stringArrayNames = ["Genres", "Directors", "Writers", "Actors"];
  stringArrayNames.forEach((name) => checkArray(movie[name], name, "string"));

  expect(movie.Plot).to.be.a("string");
  expect(movie.Poster).to.be.a("string");
  expect(
    isValidURL(movie.Poster),
    'Movie property "Poster" is expected to be a URL'
  ).to.be.eq(true);

  expect(
    movie.Metascore,
    'Movie property "Metascore" is expected to be a number greater than 0 and less or equal to 100'
  )
    .to.be.a("number")
    .and.to.be.greaterThan(0)
    .and.to.be.at.most(100);
  expect(
    movie.imdbRating,
    'Movie property "imdbRating" is expected to be a number greater than 0 and less or equal to 10'
  )
    .to.be.a("number")
    .and.to.be.greaterThan(0)
    .and.to.be.at.most(10);
}
