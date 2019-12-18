const tasks = [
  {
    _id: "5d2ca9e2e03d40b326596aa7",
    completed: true,
    body:
      "Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n",
    title: "Eu ea incididunt sunt consectetur fugiat non."
  },
  {
    _id: "5d2ca9e29c8a94095c1288e0",
    completed: false,
    body:
      "Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.\r\n",
    title:
      "Deserunt laborum id consectetur pariatur veniam occaecat occaecat tempor voluptate pariatur nulla reprehenderit ipsum."
  },
  {
    _id: "5d2ca9e2e03d40b3232496aa7",
    completed: true,
    body:
      "Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n",
    title: "Eu ea incididunt sunt consectetur fugiat non."
  },
  {
    _id: "5d2ca9e29c8a94095564788e0",
    completed: false,
    body:
      "Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.\r\n",
    title:
      "Deserunt laborum id consectetur pariatur veniam occaecat occaecat tempor voluptate pariatur nulla reprehenderit ipsum."
  }
];

(function(arrOfTasks) {
  const objOfTasks = arrOfTasks.reduce((accum, task) => {
    accum[task._id] = task;
    return accum;
  }, {});

  // Elements UI
  const listOfTasks = document.querySelector(".row .list-group");
  const form = document.forms["addTasks"];
  const inputTitle = form.elements["title"];
  const inputBody = form.elements["body"];

  // Events
  form.addEventListener("submit", onFormSubmitHandler);
  listOfTasks.addEventListener("click", onDeleteHandler);

  renderAllTasks(objOfTasks);

  function renderAllTasks(tasksList) {
    const rendered = renderEmptyTaskList();
    if (rendered) return;

    const fragment = document.createDocumentFragment();
    Object.values(tasksList).forEach(task => {
      const li = listItemTemplate(task);
      fragment.appendChild(li);
    });

    listOfTasks.appendChild(fragment);
  }

  function listItemTemplate({ _id, body, title } = {}) {
    const li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "d-flex",
      "align-items-center",
      "flex-wrap",
      "mt-2"
    );
    li.dataset.taskId = _id;

    const span = document.createElement("span");
    span.textContent = title;

    const button = document.createElement("button");
    button.classList.add("btn", "btn-danger", "ml-auto", "delete-btn");
    button.textContent = "Delete";

    const paragraph = document.createElement("p");
    paragraph.classList.add("mt-2", "w-100");
    paragraph.textContent = body;

    li.appendChild(span);
    li.appendChild(button);
    li.appendChild(paragraph);

    return li;
  }

  function onFormSubmitHandler(event) {
    event.preventDefault();

    const titleValue = inputTitle.value;
    const bodyValue = inputBody.value;

    if (!titleValue || !bodyValue) {
      alert("Пожалуйста, введите Заголовок и Текст");
      return;
    }

    const task = createNewTask(titleValue, bodyValue);
    const listItem = listItemTemplate(task);

    listOfTasks.insertAdjacentElement("afterbegin", listItem);
    form.reset();

    const emptyTaskList = taskListIsEmpty();
    const emptyTaskCard = document.querySelector("[data-empty-list-card]");
    deleteFromHtml(!emptyTaskList, emptyTaskCard);
  }

  function createNewTask(title, body) {
    const task = {
      title,
      body,
      completed: false,
      _id: `task-${Math.random()}`
    };

    objOfTasks[task._id] = task;

    return { ...task };
  }

  function deleteTask(id) {
    const { title } = objOfTasks[id];
    const isConfirm = confirm(`Вы уверены, что хотите удалить задачу ${title}`);
    if (!isConfirm) return isConfirm;
    delete objOfTasks[id];
    return isConfirm;
  }

  function onDeleteHandler({ target }) {
    if (target.classList.contains("delete-btn")) {
      const parent = target.closest("[data-task-id]");
      const id = parent.dataset.taskId;
      const confirmed = deleteTask(id);
      deleteFromHtml(confirmed, parent);
      renderEmptyTaskList();
    }
  }

  function deleteFromHtml(confirmed, element) {
    if (!confirmed) return;
    if (!element) return;

    element.remove();
  }

  function createCardTemplate() {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emptyListCard = "on";

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent =
      "Пока ваш список задач пуст... Добавьте новую задачу!";

    cardBody.appendChild(cardTitle);
    card.appendChild(cardBody);

    return card;
  }

  function renderEmptyTaskList() {
    if (taskListIsEmpty()) {
      const card = createCardTemplate();

      listOfTasks.insertAdjacentElement("afterend", card);

      return true;
    }
    return false;
  }

  function taskListIsEmpty() {
    return Object.keys(objOfTasks).length === 0;
  }
})(tasks);
