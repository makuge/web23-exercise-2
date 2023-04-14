# Web Technologies - Exercise 2

The second exercise in Web Technologies consists of three tasks, each of which contains a series of subtasks. All in all, there are **ten** tests run, each for one subtask. These subtasks are either implemented on the client- or on the server-side. You find detailed information about them in the **Tasks** section below.

To set up your working environment for the project, you will have to perform the same steps you already used in exercise 1. First, you **clone** the project and configure it in an IDE, then you **install** the project's dependencies. To do so, run 

    npm install

in the project's root directory, where this `README.md` file is located. 

Use 

    npm start

or using `nodemon` (the **recommended** option)

    npm run start-nodemon

to start the server. In any case the server will be running on port 3000. You should see the message

    Server now listening on http://localhost:3000/

in your terminal. Navigate to [http://localhost:3000/](http://localhost:3000/) to test the application manually.

## Project structure

Since the first exercise, the application has grown. The server-side now consists of two files:
+ `server/server.js` containing the start up code and the endpoints,
+ `server/movie-model.js` will contain the data structure in which the movies are held.

On the client-side you will find:
+ `server/files/index.html` the overview page showing all movies,
+ `server/files/index.js` now holds the JavaScript code of `index.html`
+ `server/files/index.css` containing the stylesheet for `index.html` file.
+ `server/files/base.css` contains a base stylesheet, which is used in `index.css`
+ `server/files/edit.css` is ready for you to use in the new file `server/files/edit.html` and contains some styling for the `form` 
+ `server/files/edit.js` holds the JavaScript code for `edit.html`, most of which already exists.

## Tasks
Here are the details for the three tasks. First off, as already mentioned, the tasks now have subtasks, the first one has three subtasks, the second one four, and the third one again three subtasks.

Here is a first overview of what the three tasks entail, a detailed description can be found in the corresponding sections below.

1. In the first task we are going to change the way in which the movies are held on the server. We move the movie data to the movie model module `server/movie-model.js`. Also, we will have to re-implement the endpoint that we already used in exercise 1, `GET /movies`, to adapt to the introduced created movie module.

2. In the second task you will code your first `form`. This is the biggest of the three tasks. In our form, the user will be able to edit the data of one specific movie. 
    
    For this to work you will first add a new GET endpoint - namely `GET /movies/:imdbID` - to request the data of a single movie from the server. 
    
    Then, you will add navigation from the overview page `index.html` to the edit page `edit.html`. This navigation is triggered when the user clicks the `Edit` button of a movie.

    Finally, we will add the `Save` and `Cancel` buttons. The `Save` button will be implemented in task 3 (for the moment is does nothing), the `Cancel` button navigates back to the `index.html` file, our movie overview page.

3. The third task finally adds the code to update the movie data entered by the user. This is triggered when the user clicks the `Save` button in our movie form. Saving a modified movie involves another endpoint on the server, the `PUT /movies:/imdbID` endpoint, which you will also implement.

### Checking your implementation
As in exercise 1, to check whether your implementation is working as expected you **run** Cypress end-to-end tests. These tests are the exact same tests we will use to assess your implementation once you commit it to the GitHub repository. In this exercise there are a total of 10 tests, each for one of the subtasks.

To start the tests, run

    npm run cypress

Here is the scheme we will use to award the points:

+ 1.1. 1.1. movie-model.js exports the movies object containing at least 3 movies: **0.4 points**
+ 1.2. GET endpoint /movies returns at least three correctly formatted movies: **0.4 points**
+ 1.3. Movie overview rendering is correct: **0.2 points**
+ 2.1. GET endpoint /movies/:imdbID returns correctly formatted movie data: **0.2 points**
+ 2.2. Navigation to edit mode and back to the overview works: **0.2 points**
+ 2.3. Movie form rendering is correct: **0.5 points**
+ 2.4. Styling of edit.html is set up correctly: **0.1 points**
+ 3.1. PUT endpoint /movies/:imdbID accepts a modified movie and updates it in the server-side object: **0.33 points**
+ 3.2. PUT endpoint /movies/:imdbID accepts a new movie and inserts it in the server-side object: **0.33 points**
+ 3.3. Movie form uses PUT endpoint /movies/:imdbID to update the movie: **0.34 points**

Use the configured test specification file `cypress/e2e/assessment.cy.js` to run the tests.

### Task 1: Move the movie data to the movie model

Here is what you need to do for the three subtasks to pass:

**1.1.** Instead of storing the movies in an array, store them in a JavaScript object. Use the `imdbID` as key and the array with all the movie data from the first exercise as value, e.g., one property of your movies object might look like this:
```js
  tt0084787: {
    imdbID: `tt0084787`,
    Title: `The Thing`,
    Released: `1982-06-25`,
    Runtime: 109,
    Genres: [`Horror`, `Mystery`, `Sci-Fi`],
    Directors: [`John Carpenter`],
    Writers: [`Bill Lancaster`, `John W. Campbell Jr.`],
    Actors: [`Kurt Russell`, `Wilford Brimley`, `Keith David`],
    Plot: `A research team in Antarctica is hunted by a shape-shifting alien that assumes the appearance of its victims.`,
    Poster:
      `https://m.media-amazon.com/images/M/MV5BNGViZWZmM2EtNGYzZi00ZDAyLTk3ODMtNzIyZTBjN2Y1NmM1XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg`,
    Metascore: 57,
    imdbRating: 8.2,
  }
```
 Make sure to `export` the complete movie object from the `movie-model.js` module, so that `server.js` is able to find it. The import of the `movie-model.js` is already included in the skeleton code. 
 
 Refer to the material in the Moodle course for details.

**1.2.** Add the code to the `GET /movies` endpoint that you already are familiar with from the first exercise. Make sure you return all the movies of the model as an array. This can be accomplished using [Object.values(...)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Object/values).

**1.3.** Copy the code you wrote in exercise 1 to render the elements to the right place in `index.js`, then you should be fine.

**Caution:** For this test to pass, you will have to render the `Edit` button that is described in Subtask 2.2. The `button` does not have to do anything just yet, but it has to exist for this test to pass...

### Task 2: Add a form to edit a movie

In the second task we add a form to edit an individual movie. For this to work, we first need a way to request an individual movie from the server.

**2.1.** Implement the `GET /movies/:imdbID` endpoint. Here we work with a **path parameter** for the first time. 

The client passes the `imdbId` of the movie as a path parameter named `imdbID` in the corresponding endpoint in `server.js`. Now you can access the parameter in your endpoint code using `reg.params.imdbID`, using it to look up the requested movie in the movie model.

Depending on whether you find the movie with the given `imdbID` in the model, you do two things: Either you
+ find the movie. Send it to the client using `res.send(...)`
+ do **not** find the movie. Send back a status code of 404 using `res.sendStatus(404)`

**2.2.** Navigate between `index.html` and `edit.html`.

For this to work, you will have to
+ create the `edit.html` page and add a basic `form` (for details refer to the end of this section)
+ a button on the overview page (`index.html`) that triggers the navigation to the `edit.html` page and 
+ another button on the `edit.html` page triggering navigation back to the `index.html`.

Navigating to another URL can be done using the following JavaScript snippet:

```js
    location.href = "edit.html?imdbID=tt1234567"
```

In this example, the key-value pair after the page name (`imdbID=tt1234567`) is a [query parameter](https://en.wikipedia.org/wiki/Query_string), that we pass to the `edit.html` page. In `edit.js` we will use this parameter to load the movie with the specified id - in this example `tt1234567`.

The tricky part is that you will have to add this code dynamically to a `button` element in your DOM manipulation code from exercise 1.

This then will look something like this:
```js
// Code from exercise 1
const movie = ... // The movie you are currently adding element for
const articleElement = ... // The article element you created for that movie

// New code starting here
const buttonElement = document.createElement('button')
buttonElement.textContent = 'Edit'
buttonElement.onclick = function() {
    location.href = 'edit.html?imdbID=' + movie.imdbID
}

/*... and then you wrap the button element in a p element and 
      add the p element after the h1 element that contains
      the movie's title...*/
```

To satisfy the test, please make sure to wrap the `button` element in a `p` and add this paragraph right after the `h1` element which contains the title of the movie.

In the other direction, that is, from the `edit.html` back to `index.html` you can use the same concept. Here, your HTML code is static and there is no need for a parameter, so it's simpler. Still, you have to add a `form` element to `edit.html` containing a `button` element with the Text *Cancel* and a `onclick` attribute containing the navigation code.

**2.3.** Now you extend the HTML page `edit.html` that you added in 2.2.

This page already contains a `form` element. Now you will att elements for all the properties of a movie. A form can contain different HTML elements. In our case, we are going to use
+ `input` elements for strings, numbers, dates, and also for the lists we have of actors, writers and directors
+ a `select` element for the genres,
+ a `textarea` for the plot. 

In contrast to what we did in exercise 1, this time you write your HTML code **statically**, you do not create in using `document.createElement(...)`.

Here are some more details:

+ For the `input` elements to work properly, you will have to 
    + choose an appropriate `type` attribute, e.g., `hidden`, `text`, `number`, `url` or `date`
    + set the `id` attribute of the element, for which you use the name of the property as **id**. 
    + for numerical `input` elements you may also need add the attributes `min`, `max`, and, if necessary, `step`.
    <br><br>

    Examples for `input` elements are: 
    ```html
    <input type="text" id="Title">
    <input type="number" id="Runtime" min="0">
    ```

    Make sure to wrap all elements in a `div` and add a `label` for each of them, e.g.,

    ```html
    <div>
        <label for="Released">Released On</label>
        <input type="date" id="Released">
    </div>
    <div>
        <label for="Directors">Directors</label>
        <input type="text" id="Directors">
    </div>
    ```

    Make sure that each `label` has a `for` attribute which references the `id` attribute of the `input` element it belongs to.

    A special case is the `input` element for the `imdbID`. Since the user is not going to be able to edit the id, we will use `type="hidden"`. There is also no need for a `div` and a `label`, but be sure to add the `id` attribute.

+ We are only going to use one `select` element, namely for the list of genres. For each genre, the `select` element will contains an `option` child element. The `select` element has not `type` attribute like the `input` element, but you need to configure the `id` attribute on this element also. Add the following 24 genres as options: `Action`, `Adventure`, `Animation`, `Biography`, `Comedy`, `Crime`, `Documentary`, `Drama`, `Family`, `Fantasy`, `Film Noir`, `History`, `Horror`, `Music`, `Musical`, `Mystery`, `Romance`, `Sci-Fi`, `Short Film`, `Sport`, `Superhero`, `Thriller`, `War`, `Western`.<br>

    Make sure to add each of these values as the `value` attribute and as the text of the element, e.g., 

    ```html
    <select id="Genres" multiple>
        <option value="Action">Action</option>
        <option value="Adventure">Adventure</option>
        <option value="Animation">Animation</option>
        ...
    </select>
    ```

    As you see, the `select` element also has the `multiple` boolean attribute, meaning that the user can select more than one genre.

    Wrap the `select` element in a `div` and add a `label` as we did with the `input` elements.
+ Finally, there is one `textarea` for the `Plot` property. It also has no `type`, but you will need the `id` as with the other elements. In addition, include a `row` attribute and assign a value of **5**.

    The `textarea`, like `input` and `select` elements is wrapped in a `div` element and has its own `label`.

There one last missing puzzle piece, the buttons. There are two of them:
+ The `button` *Save* is going to call the JavaScript function `putMovie()`. You will need to look up how to use an onclick attribute.

So much for the construction of the form. If everything is set up correctly, the movie data should now be shown in the form :).

**2.4** Make sure to reference the given `edit.css` file in `edit.html` to make this subtask work.

### Task 3: Store the modified movie data on the server

Storing the data involves two use cases (although at the moment we only use one):
+ we PUT a modified movie with an `imdbID` that already exists on the server - that's an update
+ we PUT a new movie with an `imdbID` that does not yet exists - that's a creation.

For both cases, you need to add a new endpoint in `server.js`, the `PUT /movies/:imdbID` endpoint.

**3.1.** The Update

Now you check whether the `imdbID` given in the request alredy exists. If it does you **replace** the existing movie data on the server and send back a status code 200 using 

```js
res.sendStatus(...)
```

**3.2.** The Creation

If your checks finds that the `imdbID` does not exist, then you **add** the movie data given in the request to the server-side data model. In this case, you send back status code 201 and the movie object you stored.

**3.3.** Trigger the PUT on the client side

On the client side, in function `putMovie()` in `edit.js`, you will need to send the movie data that `getMovie()` collects from the form to the newly creates endpoint `PUT /movies/:imdbID`. Some code is already there, but you will have to find the missing pieces on yourself!

You have finished the seconds exercise: **Congratulations, all tests pass!** 
