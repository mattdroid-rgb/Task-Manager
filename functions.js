async function fetchTasks() {
    try {
        const response = await fetch('http://localhost:3000/tasks');
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        alert('Failed to load tasks. Please try again.');
    }
}

function renderTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; 

    tasks.forEach(task => {
        const taskContainer = document.createElement('div');
        taskContainer.className = 'task-container';

        const taskTitleContainer = document.createElement('div');
        taskTitleContainer.className = 'task-title-container';

        const taskTitle = document.createElement('span');
        taskTitle.textContent = task.title;
        if (task.completed) taskTitle.classList.add('completed');

        taskTitleContainer.appendChild(taskTitle);

        const completeButton = document.createElement('button');
        completeButton.textContent = task.completed ? 'Undo' : 'Complete';
        completeButton.onclick = () => toggleTaskCompletion(task.id, !task.completed);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = () => deleteTask(task.id);

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';
        buttonGroup.appendChild(completeButton);
        buttonGroup.appendChild(deleteButton);

        taskContainer.appendChild(taskTitleContainer);
        taskContainer.appendChild(buttonGroup);

        taskList.appendChild(taskContainer);
    });
}

async function addTask() {
    const taskInput = document.getElementById('taskInput');
    const title = taskInput.value.trim();
    if (!title) return;

    try {
        await fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        taskInput.value = '';
        fetchTasks();
    } catch (error) {
        console.error('Error adding task:', error);
        alert('Failed to add task. Please try again.');
    }
}

async function toggleTaskCompletion(id, completed) {
    try {
        await fetch(`http://localhost:3000/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed })
        });
        fetchTasks();
    } catch (error) {
        console.error('Error toggling task completion:', error);
        alert('Failed to update task status. Please try again.');
    }
}

async function deleteTask(id) {
    try {
        await fetch(`http://localhost:3000/tasks/${id}`, { method: 'DELETE' });
        fetchTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
    }
}

fetchTasks();