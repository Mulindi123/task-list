document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.querySelector("#newtask input");
    const addButton = document.querySelector("#push");
    const taskSection = document.querySelector(".tasks");
    const filterButtons = document.querySelectorAll(".filter-btn");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentFilter = "all"; // Active filter state

    /** Apply filter button event listeners */
    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active-filter"));
            btn.classList.add("active-filter");

            currentFilter = btn.getAttribute("data-filter"); // Update global state
            filterTasks(currentFilter);
        });
    });

    /** Load existing tasks from localStorage */
    tasks.forEach((task) => createTaskElement(task.text, task.completed));
    updateOverflow();
    filterTasks(currentFilter); // Apply filter immediately

    /** Add task on Enter key */
    taskInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") addTask();
    });

    /** Add task on button click */
    addButton.addEventListener("click", addTask);

    /** Event delegation for delete and checkbox actions */
    taskSection.addEventListener("click", (e) => {
        const taskDiv = e.target.closest(".task");

        // Delete Task
        if (e.target.closest(".delete")) {
            const taskText = taskDiv.querySelector("p").textContent;
            tasks = tasks.filter((t) => t.text !== taskText);
            saveTasks();
            taskDiv.remove();
            updateOverflow();
        }

        // Toggle Completion
        if (e.target.matches("input[type='checkbox']")) {
            const taskText = taskDiv.querySelector("p").textContent;
            const taskObj = tasks.find((t) => t.text === taskText);
            if (taskObj) {
                taskObj.completed = e.target.checked;
                e.target.nextElementSibling.classList.toggle("checked", taskObj.completed);
                saveTasks();
                filterTasks(currentFilter); // Apply filtering
            }
        }
    });

    /** Add New Task */
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText.length === 0) {
            alert("The task field is blank. Please enter a task.");
            return;
        }

        // Prevent duplicate tasks
        if (tasks.some(t => t.text.toLowerCase() === taskText.toLowerCase())) {
            alert("This task already exists.");
            return;
        }

        const newTask = { text: taskText, completed: false };
        tasks.push(newTask);
        saveTasks();

        taskInput.value = "";
        updateOverflow();

        if (currentFilter !== "completed") {
            createTaskElement(taskText, false);
        }

        filterTasks(currentFilter); // Ensure UI updates properly
    }

    /** Create & Append Task to the DOM */
    function createTaskElement(text, completed) {
        const taskHTML = `
            <div class="task">
                <label class="taskname">
                    <input type="checkbox" ${completed ? "checked" : ""}>
                    <p class="${completed ? "checked" : ""}">${text}</p>
                </label>
                <div class="delete">
                    <i class="uil uil-trash"></i>
                </div>
            </div>`;
        taskSection.insertAdjacentHTML("beforeend", taskHTML);
    }

    /** Save tasks to localStorage */
    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    /** Handle Overflow UI */
    function updateOverflow() {
        if (taskSection.scrollHeight > 300) {
            taskSection.classList.add("overflow");
        } else {
            taskSection.classList.remove("overflow");
        }
    }

    /** Filter tasks based on active filter */
    function filterTasks(filter) {
        const allTasks = document.querySelectorAll(".task");
        allTasks.forEach(task => {
            const checkbox = task.querySelector("input[type='checkbox']");
            const isCompleted = checkbox.checked;
            
            if (filter === "all") {
                task.style.display = "flex";
            } else if (filter === "active") {
                task.style.display = isCompleted ? "none" : "flex";
            } else if (filter === "completed") {
                task.style.display = isCompleted ? "flex" : "none";
            }
        });
    }

    const themeToggleButton = document.getElementById("toggle-theme");

    // Apply theme on load
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
        document.body.classList.add("dark-mode");
        themeToggleButton.textContent = "Switch to Light Mode";
    }

    // Toggle theme and button label
    themeToggleButton.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark-mode");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        themeToggleButton.textContent = isDark
            ? "Switch to Light Mode"
            : "Switch to Dark Mode";
    });

});
