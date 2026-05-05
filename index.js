function createElement(tag, attributes, children, events = {}) {
  const element = document.createElement(tag);

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key]);
    });
  }

  Object.keys(events).forEach((eventName) => {
    element.addEventListener(eventName, events[eventName]);
  });

  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
  } else if (typeof children === "string") {
    element.appendChild(document.createTextNode(children));
  } else if (children instanceof HTMLElement) {
    element.appendChild(children);
  }

  return element;
}

class Component {
  constructor() {
  }

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }
}

class TodoList extends Component {
  constructor() {
    super();

    this.state = {
      tasks: [
        "Сделать домашку",
        "Сделать практику",
        "Пойти домой",
      ],
      inputValue: "",
    };
  }

  onAddInputChange = (e) => {
    this.state.inputValue = e.target.value;
  };

  onAddTask = () => {
    if (!this.state.inputValue.trim()) return;
    this.state.tasks.push(this.state.inputValue);
    this.state.inputValue = "";
    this.update();
  };

  render() {
    return createElement("div", { class: "todo-list" }, [
      createElement("h1", {}, "TODO List"),
      createElement("div", { class: "add-todo" }, [
        createElement(
          "input",
          {
            id: "new-todo",
            type: "text",
            placeholder: "Задание",
          },
          null,
          {
            input: this.onAddInputChange,
          }
        ),

        createElement(
          "button",
          { id: "add-btn" },
          "+",
          {
            click: this.onAddTask,
          }
        ),
      ]),

      createElement(
        "ul",
        { id: "todos" },
        this.state.tasks.map((task) =>
          createElement("li", {}, [
            createElement("input", { type: "checkbox" }),
            createElement("label", {}, task),
            createElement("button", {}, "🗑️"),
          ])
        )
      ),
    ]);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});
