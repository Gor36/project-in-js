const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
  if (inputBox.value === "") {
    new Toast({
      text: "Поле не может быть пустым",
      type: "default",
      duration: 3000,
    })._show();
  } else if (inputBox.value.length > 75) {
    new Toast({
      text: "Текст не может быть длиннее 75 символов",
      type: "default",
      duration: 3000,
    })._show();
  } else {
    let li = document.createElement("li");
    li.innerHTML = inputBox.value;
    listContainer.appendChild(li);
    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);
  }
  inputBox.value = "";
  saveData();
}

listContainer.addEventListener(
  "click",
  function (e) {
    if (e.target.tagName === "LI") {
      e.target.classList.toggle("checked");
      saveData();
    } else if (e.target.tagName === "SPAN") {
      e.target.parentElement.remove();
      saveData();
    }
  },
  false
);

function saveData() {
  const tasks = [];
  const listItem = listContainer.querySelectorAll("li");

  listItem.forEach((item) => {
    tasks.push({
      title: item.textContent.replace("\u00d7", "").trim(),
      isDone: item.classList.contains("checked"),
    });
  });

  localStorage.setItem("data", JSON.stringify(tasks));
}

function showTask() {
  const tasks = JSON.parse(localStorage.getItem("data")) || [];

  listContainer.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = task.title;

    if (task.isDone) {
      li.classList.add("checked");
    }
    const span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);

    listContainer.appendChild(li);
  });
}
showTask();

if (!document.querySelector(".toast-container")) {
  const container = document.createElement("div");
  container.classList.add("toast-container");
  document.body.append(container);
}

class Toast {
  constructor(params) {
    this._text = params.text || "Сообщение";
    this._type = params.type || "default";
    this._duration = params.duration || 3000;
    this._create();
  }

  _create() {
    this._el = document.createElement("div");
    this._el.classList.add("toast", `toast_${this._type}`);
    this._el.innerHTML = `
      <div class="toast__header">Замечание</div>
      <div class="toast__body">${this._text}</div>
      <button class="toast__close" type="button"></button>
    `;
    document.querySelector(".toast-container").appendChild(this._el);

    this._el.querySelector(".toast__close").addEventListener("click", () => {
      this._hide();
    });
  }

  _show() {
    this._el.classList.add("toast_show");
    setTimeout(() => this._hide(), this._duration);
  }

  _hide() {
    this._el.classList.remove("toast_show");
    setTimeout(() => this._el.remove(), 300);
  }
}
