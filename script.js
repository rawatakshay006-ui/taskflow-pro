const taskInput = document.getElementById("task-input");
const taskPriority = document.getElementById("task-priority");
const taskDate = document.getElementById("task-date");
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const searchInput = document.getElementById("search-input");
const emptyMessage = document.getElementById("empty-message");
const deleteModal = document.getElementById("delete-modal");
const deleteMessage = document.getElementById("delete-message");
const confirmDeleteBtn = document.getElementById("confirm-delete");
const cancelDeleteBtn = document.getElementById("cancel-delete");
const themeToggle = document.getElementById("theme-toggle");
let tasks = [];
let editingTask = null;
let taskToDelete = null;

const savedTasks = localStorage.getItem("tasks");

if (savedTasks) {
  tasks = JSON.parse(savedTasks);
}

function createTask(task) {
  const li = document.createElement("li");
  const formattedDate = new Date(task.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  li.innerHTML = `
      <h3>${task.taskName}</h3>
      <p class="priority ${task.priority}">
    ${task.priority.toUpperCase()}
      </p>
      <p><strong>Due Date:</strong> ${formattedDate}</p>
    <div class="button-group">
      <button class="complete-btn">
      ✔ ${task.completed ? "Undo" : "Complete"}</button>
      <button class="edit-btn">✏ Edit</button>
      <button class="delete-btn">🗑 Delete</button>
    </div>
  `;

  if (task.completed) {
    li.classList.add("completed");
  }

  taskList.appendChild(li);

  const completeBtn = li.querySelector(".complete-btn");
  completeBtn.addEventListener("click", function () {
    li.classList.toggle("completed");

    if (li.classList.contains("completed")) {
      completeBtn.textContent = "↩ Undo";
      task.completed = true;
      editBtn.disabled = true;
    } else {
      completeBtn.textContent = "✔ Complete";
      task.completed = false;
      editBtn.disabled = false;
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));

    if (editingTask === task) {
      editingTask = null;
      taskForm.reset();
      document.getElementById("add-task-btn").textContent = "Add Task";
    }
  });
  const editBtn = li.querySelector(".edit-btn");
  if (task.completed) {
    editBtn.disabled = true;
  }
  editBtn.addEventListener("click", function () {
    taskInput.value = task.taskName;
    taskPriority.value = task.priority;
    taskDate.value = task.date;
    editingTask = task;
    document.getElementById("add-task-btn").textContent = "Save Changes";
  });
  const deleteBtn = li.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", function () {
    taskToDelete = { task, li };

    deleteMessage.textContent = `Are you sure you want to delete "${task.taskName}"?`;

    deleteModal.classList.remove("hidden");
  });
}
taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskName = taskInput.value;
  const priority = taskPriority.value;
  const date = taskDate.value;

  if (taskName.trim() === "") {
    alert("Please enter a task name.");
    return;
  }

  if (date === "") {
    alert("Please select a due date.");
    return;
  }

  if (editingTask) {
    // Update existing task
    editingTask.taskName = taskName;
    editingTask.priority = priority;
    editingTask.date = date;

    localStorage.setItem("tasks", JSON.stringify(tasks));

    taskList.innerHTML = "";

    tasks.forEach(function (task) {
      createTask(task);
    });

    editingTask = null;
    document.getElementById("add-task-btn").textContent = "Add Task";
    taskForm.reset();
  } else {
    // Create new task
    const task = {
      taskName: taskName,
      priority: priority,
      date: date,
      completed: false,
    };

    tasks.push(task);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    createTask(task);
  }

  updateEmptyState();
  taskForm.reset();
});
function updateEmptyState() {
  if (tasks.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }
}
tasks.forEach(function (task) {
  createTask(task);
});

updateEmptyState();
confirmDeleteBtn.addEventListener("click", function () {
  const index = tasks.indexOf(taskToDelete.task);

  tasks.splice(index, 1);

  localStorage.setItem("tasks", JSON.stringify(tasks));

  taskToDelete.li.remove();

  updateEmptyState();

  deleteModal.classList.add("hidden");

  taskToDelete = null;
});
cancelDeleteBtn.addEventListener("click", function () {
  deleteModal.classList.add("hidden");
  taskToDelete = null;
});
deleteModal.addEventListener("click", function (event) {
  if (event.target === deleteModal) {
    deleteModal.classList.add("hidden");
    taskToDelete = null;
  }
});
searchInput.addEventListener("input", function () {
  const searchText = searchInput.value.toLowerCase();
  const tasksCards = document.querySelectorAll("#task-list li");

  tasksCards.forEach(function (li) {
    const taskName = li.querySelector("h3").textContent.toLowerCase();
    if (taskName.includes(searchText)) {
      li.style.display = "block";
    } else {
      li.style.display = "none";
    }
  });
});
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀ Light Mode";
}
themeToggle.addEventListener("click", function () {
  document.body.style.opacity = "0.85";

  setTimeout(function () {
    document.body.classList.toggle("dark");
    document.body.style.opacity = "1";
  }, 120);

  if (document.body.classList.contains("dark")) {
    themeToggle.textContent = "☀ Light Mode";
    localStorage.setItem("theme", "dark");
  } else {
    themeToggle.textContent = "🌙 Dark Mode";
    localStorage.setItem("theme", "light");
  }
});