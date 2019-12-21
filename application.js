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
  listOfTasks.addEventListener("click", onEditHandler);
  listOfTasks.addEventListener("click", onCompleateHandler);

  renderAllTasks(objOfTasks);

  // Events Callbacks

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

  function onFormEditSubmitHandler(event) {
    event.preventDefault();

    const taskId = event.target.closest("[data-task-id]").dataset.taskId;

    const titleValue = inputTitleEdit.value;
    const bodyValue = inputBodyEdit.value;

    if (!titleValue || !bodyValue) {
      alert("Пожалуйста, введите Заголовок и Текст");
      return;
    }

    const task = editTask(taskId, titleValue, bodyValue);

    const listItemOld = event.target.closest(".list-group-item");

    renderTaskItemAfterEdit(listItemOld, task);
  }

  function onDeleteHandler({ target }) {
    if (target.classList.contains("delete-btn")) {
      const parent = target.closest("[data-task-id]");
      if (!parent) return;
      const id = parent.dataset.taskId;
      const confirmed = deleteTask(id);
      deleteFromHtml(confirmed, parent);
      renderEmptyTaskList();
    }
  }

  function onEditHandler({ target }) {
    if (target.classList.contains("edit-btn")) {
      const parent = target.closest("[data-task-id]");
      if (!parent) return;
      const id = parent.dataset.taskId;
      const task = objOfTasks[id];
      removeAllChilds(parent);
      destroyAnotherEditForm();
      const form = createEditForm(task);

      parent.appendChild(form);
    }
  }

  function onCompleateHandler({ target }) {
    if (target.classList.contains("completed-btn")) {
      const parent = target.closest("[data-task-id]");
      if (!parent) return;
      const id = parent.dataset.taskId;
      const task = objOfTasks[id];

      compleateTask(task);

      parent.classList.toggle("bg-success");

      refreshButton(target, task);
    }
  }

  // Tasks

  function editTask(_id, title, body) {
    const task = objOfTasks[_id];

    task.title = title;
    task.body = body;

    return task;
  }

  function deleteTask(id) {
    const { title } = objOfTasks[id];
    const isConfirm = confirm(`Вы уверены, что хотите удалить задачу ${title}`);
    if (!isConfirm) return isConfirm;
    delete objOfTasks[id];
    return isConfirm;
  }

  function compleateTask(task) {
    task.completed = !task.completed;

    return task;
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

  // DOM Elements

  function listItemTemplate({ _id, body, title, completed } = {}) {
    const li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "d-flex",
      "align-items-center",
      "flex-wrap",
      "mt-2"
    );
    if (completed) li.classList.add("bg-success");

    li.dataset.taskId = _id;

    const span = document.createElement("span");
    span.classList.add("font-weight-bold");
    span.textContent = title;

    const button = document.createElement("button");
    if (completed) {
      button.classList.add("btn", "btn-secondary", "ml-auto", "completed-btn");
      button.textContent = "Не выполнена";
    } else {
      button.classList.add("btn", "btn-success", "ml-auto", "completed-btn");
      button.textContent = "Выполнена";
    }

    const buttonEdit = document.createElement("button");
    buttonEdit.classList.add("btn", "btn-warning", "ml-1", "edit-btn");
    buttonEdit.textContent = "Изменить";

    const buttonDelete = document.createElement("button");
    buttonDelete.classList.add("btn", "btn-danger", "ml-1", "delete-btn");
    buttonDelete.textContent = "Удалить";

    const paragraph = document.createElement("p");
    paragraph.classList.add("mt-2", "w-100");
    paragraph.textContent = body;

    li.appendChild(span);
    li.appendChild(paragraph);
    li.appendChild(button);
    li.appendChild(buttonEdit);
    li.appendChild(buttonDelete);

    return li;
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

  function createEditForm(task) {
    const form = document.createElement("form");
    form.name = "editTask";
    form.classList.add("w-100");
    form.dataset.taskId = task._id;

    const divGroupTitle = document.createElement("div");
    divGroupTitle.classList.add("form-group");

    const labelTitle = document.createElement("label");
    labelTitle.htmlFor = "inputTitleEdit";
    labelTitle.textContent = "Заголовок";

    const inputTitle = document.createElement("input");
    inputTitle.type = "text";
    inputTitle.name = "title";
    inputTitle.id = "inputTitleEdit";
    inputTitle.value = task.title;
    inputTitle.placeholder = "Текст заголовка";
    inputTitle.classList.add("form-control");

    divGroupTitle.appendChild(labelTitle);
    divGroupTitle.appendChild(inputTitle);

    const divGroupBody = document.createElement("div");
    divGroupBody.classList.add("form-group");

    const labelBody = document.createElement("label");
    labelBody.htmlFor = "inputBodyEdit";
    labelBody.textContent = "Текст задачи";

    const textareaBody = document.createElement("textarea");
    textareaBody.rows = "3";
    textareaBody.name = "body";
    textareaBody.id = "inputBodyEdit";
    textareaBody.value = task.body;
    textareaBody.placeholder = "Текст задачи";
    textareaBody.classList.add("form-control");

    divGroupBody.appendChild(labelBody);
    divGroupBody.appendChild(textareaBody);

    const buttonSubmit = document.createElement("button");
    buttonSubmit.classList.add("btn", "btn-primary");
    buttonSubmit.textContent = "Принять";
    buttonSubmit.type = "submit";
    form.addEventListener("submit", onFormEditSubmitHandler);

    form.appendChild(divGroupTitle);
    form.appendChild(divGroupBody);
    form.appendChild(buttonSubmit);

    return form;
  }

  // Other

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

  function deleteFromHtml(confirmed, element) {
    if (!confirmed) return;
    if (!element) return;

    element.remove();
  }

  function removeAllChilds(element) {
    if (!element) return;
    const childs = Array.from(element.children);

    childs.forEach(child => element.removeChild(child));
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

  function destroyAnotherEditForm() {
    const editForm = document.forms.editTask;
    if (!editForm) return;
    const taskId = editForm.dataset.taskId;
    const listItemOld = editForm.closest(".list-group-item");
    const task = objOfTasks[taskId];

    renderTaskItemAfterEdit(listItemOld, task);
  }

  function renderTaskItemAfterEdit(listItemOld, task) {
    const listItemNew = listItemTemplate(task);

    listItemOld.insertAdjacentElement("beforebegin", listItemNew);

    deleteFromHtml(true, listItemOld);
  }

  function refreshButton(button, { completed }) {
    button.classList.toggle("btn-success");
    button.classList.toggle("btn-secondary");

    if (completed) {
      button.textContent = "Не выполнена";
    } else {
      button.textContent = "Выполнена";
    }
  }
})(tasks);
