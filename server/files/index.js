class ElementCreator {
  constructor(tag) {
    this.element = document.createElement(tag);
  }

  id(id) {
    this.element.id = id;
    return this;
  }

  class(clazz) {
    this.element.classList.add(clazz);
    return this;
  }

  pluralizedText(content, array) {
    return this.text(array.length > 1 ? content + "s" : content);
  }

  text(content) {
    this.element.textContent = content;
    return this;
  }

  with(name, value) {
    this.element.setAttribute(name, value);
    return this;
  }

  listener(name, listener) {
    this.element.addEventListener(name, listener);
    return this;
  }

  append(child) {
    child.appendTo(this.element);
    return this;
  }

  appendTo(parent) {
    parent.append(this.element);
    return this.element;
  }

  insertBefore(parent, sibling) {
    parent.insertBefore(this.element, sibling);
    return this.element;
  }
}

class ParentChildCreator extends ElementCreator {
  constructor(parentTag, childTag) {
    super(parentTag);
    this.childTag = childTag;
  }

  append(text) {
    const childCreator = new ElementCreator(this.childTag).text(text);
    if (this.childClazz) {
      childCreator.class(this.childClazz);
    }

    super.append(childCreator);
  }

  childClass(childClazz) {
    this.childClazz = childClazz;
    return this;
  }

  items(items) {
    if (arguments.length === 1 && Array.isArray(arguments[0])) {
      arguments[0].forEach((item) => this.append(item));
    } else {
      for (var i = 0; i < arguments.length; i++) {
        this.append(arguments[i]);
      }
    }

    return this;
  }
}

class ParagraphCreator extends ParentChildCreator {
  constructor() {
    super("p", "span");
  }
}

class ListCreator extends ParentChildCreator {
  constructor() {
    super("ul", "li");
  }
}

function formatRuntime(runtime) {
  const hours = Math.trunc(runtime / 60);
  const minutes = runtime % 60;
  return hours + "h " + minutes + "m";
}

window.onload = function () {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const bodyElement = document.querySelector("body");
    if (xhr.status == 200) {
      const movies = JSON.parse(xhr.responseText);
      for (const movie of movies) {
        // Task 1.3. Add your code from exercise 1 here
        // 

      }

    } else {
      bodyElement.append(
        "Daten konnten nicht geladen werden, Status " +
          xhr.status +
          " - " +
          xhr.statusText
      );
    }
  };
  xhr.open("GET", "/movies");
  xhr.send();
};
