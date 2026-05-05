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

class AddTask {
  constructor(onAddTask, inputValue, onInputChange) {
    this.onAddTask = onAddTask;
    this.inputValue = inputValue;
    this.onInputChange = onInputChange;
  }

  render() {
    return createElement("div", { class: "add-todo" }, [
      createElement(
        "input",
        {
          id: "new-todo",
          type: "text",
          placeholder: "Задание",
          value: this.inputValue,
        },
        null,
        {
          input: this.onInputChange,
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
    ]);
  }
}

class Task {
  constructor(task, onToggle, onDelete) {
    this.task = task;
    this.onToggle = onToggle;
    this.onDelete = onDelete;
  }

  render() {
    return createElement("li", {}, [
      createElement(
        "input",
        { type: "checkbox" },
        null,
        { change: this.onToggle }
      ),

      createElement(
        "label",
        {
          style: this.task.done
            ? "color: gray; text-decoration: line-through;"
            : "",
        },
        this.task.text
      ),

      createElement(
        "button",
        {
          style: this.task.confirmDelete ? "background-color: red;" : "",
        },
        "🗑",
        { click: this.onDelete }
      ),
    ]);
  }
}

class TodoList extends Component {
  constructor() {
    super();

    const savedTasks = localStorage.getItem("tasks");

    this.state = {
      tasks: savedTasks
        ? JSON.parse(savedTasks)
        : [
            { text: "Сделать домашку", done: false, confirmDelete: false },
            { text: "Сделать практику", done: false, confirmDelete: false },
            { text: "Пойти домой", done: false, confirmDelete: false },
          ],
      inputValue: "",
    };
  }

  saveToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(this.state.tasks));
  }

  onAddInputChange = (e) => {
    this.state.inputValue = e.target.value;
  };

  onAddTask = () => {
    if (!this.state.inputValue.trim()) return;

    this.state.tasks.push({
      text: this.state.inputValue,
      done: false,
      confirmDelete: false,
    });

    this.state.inputValue = "";
    this.update();
    this.saveToLocalStorage();
  };

  toggleTask = (index) => {
    this.state.tasks[index].done = !this.state.tasks[index].done;
    this.update();
    this.saveToLocalStorage();
  };

  deleteTask = (index) => {
    const task = this.state.tasks[index];

    if (!task.confirmDelete) {
      task.confirmDelete = true;
    } else {
      this.state.tasks.splice(index, 1);
    }

    this.update();
    this.saveToLocalStorage();
  };

  render() {
    return createElement("div", { class: "todo-list" }, [
      createElement("h1", {}, "TODO List"),

      new AddTask(
        this.onAddTask,
        this.state.inputValue,
        this.onAddInputChange
      ).render(),

      createElement(
        "ul",
        { id: "todos" },
        this.state.tasks.map((task, index) =>
          new Task(
            task,
            () => this.toggleTask(index),
            () => this.deleteTask(index)
          ).render()
        )
      ),
    ]);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});
