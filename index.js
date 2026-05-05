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
    this.state = {};
  }

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }

  update() {
    const newNode = this.render();
    this._domNode.replaceWith(newNode);
    this._domNode = newNode;
  }
}

class TodoList extends Component {
  constructor() {
    super();

    this.state = {
      tasks: [
        {text: "Сделать домашку", done: false},
        {text: "Сделать практику", done: false},
        {text: "Пойти домой", done: false},
      ],
      inputValue: "",
    };
  }

  onAddInputChange = (e) => {
    this.state.inputValue = e.target.value;
  };

  onAddTask = () => {
    if (!this.state.inputValue.trim()) return;
    this.state.tasks.push({
      text: this.state.inputValue,
      done: false,
    });
    this.state.inputValue = "";
    this.update();
  };

  toggleTask = (index) => {
    this.state.tasks[index].done = !this.state.tasks[index].done;
    this.update();
  };

  deleteTask = (index) => {
    this.state.tasks.splice(index, 1);
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
            value: this.state.inputValue,
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
        this.state.tasks.map((task, index) =>
          createElement("li", {}, [
            createElement("input", { type: "checkbox" }, null, { change: () => this.toggleTask(index) }),
            createElement("label", {style: task.done ? "color: gray; text-decoration: line-through;" : "",}, task.text),
            createElement("button", {}, "🗑️", { click: () => this.deleteTask(index) }),
          ])
        )
      ),
    ]);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});
