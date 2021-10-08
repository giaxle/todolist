// global use variables
const projectList = document.querySelector('#projectList')
const newProjectForm = document.querySelector('#newProjectForm')
const newProjectInput = document.querySelector('#projectInput')
const projectTitle = document.querySelector('#projectTitle');

const deleteListBtn = document.querySelector('#deleteProject');
const clearTasksBtn = document.querySelector('#clearTasks');

const taskList = document.querySelector('#taskList');
const newTaskForm = document.querySelector('#newTaskForm');
const newTaskInput = document.querySelector('#taskInput');
const taskBlock = document.querySelector('#taskBlock');
const taskTemplate = document.querySelector('#taskTemplate');

// code for storage
const LOCAL_STORAGE_LIST_KEY = 'project.lists';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'project.selectedProjectId';
let projects = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedProjectId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(projects));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedProjectId);
};

// project class and constructor
class Project {
    constructor(name) {
        this.name = name;
        this.id = Date.now().toString();
        this.tasks = [];
    }
}

// task class and constructor
// class Task {
//     cosntructor(name) {
//         this.name = name;
//         this.id = Date.now().toString();
//         this.complete = false;
//     }
// }

function createTask(name) {
    return { id: Date.now().toString(), name: name, complete: false };
}

// event listeners
projectList.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedProjectId = e.target.dataset.projectId;
        saveAndRender();
    }
});

deleteListBtn.addEventListener('click', e => {
    projects = projects.filter(project => project.id !== selectedProjectId);
    selectedProjectId = null;
    saveAndRender();
})

newProjectForm.addEventListener('submit', e => {
    e.preventDefault();
    const projectName = newProjectInput.value;
    if (projectName == null || projectName === "") return;
    const project = new Project(projectName);
    newProjectInput.value = null;
    projects.push(project);
    saveAndRender();
});

newTaskForm.addEventListener('submit', e => {
    e.preventDefault();
    const taskName = newTaskInput.value;
    console.log(taskName);
    if (taskName == null || taskName === "") return;
    const task = createTask(taskName);
    console.log(task);
    newTaskInput.value = null;
    const selectedProject = projects.find(project => project.id === selectedProjectId);
    selectedProject.tasks.push(task);
    saveAndRender();
});

// visual element functions
function render() {
    clearElement(projectList);
~   renderLists();
};

function renderLists() {
    projects.forEach(project => {
        const newProject = document.createElement('li');
        newProject.dataset.projectId = project.id;
        // listElement.classList.add("list-name");
        newProject.innerText = project.name;
        if (project.id === selectedProjectId) {
            newProject.classList.add('active-list');
        }
        projectList.appendChild(newProject);
    })

    const selectedProject = projects.find(project => project.id === selectedProjectId);

    if (selectedProjectId == null) {
        taskBlock.style.display = 'none';
    } else {
        taskBlock.style.display = '';
        projectTitle.innerText = selectedProject.name;
        clearElement(taskList);
        renderTasks(selectedProject);
    }
}

function renderTasks(selectedProject) {
    selectedProject.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true);
        const checkBox = taskElement.querySelector('input');
        checkBox.id = task.id;
        checkBox.checked = task.complete;
        const label = taskElement.querySelector('label');
        label.htmlFor = task.id;
        label.append(task.name);
        taskList.appendChild(taskElement);
    })
}

function saveAndRender() {
    save();
    render();
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
};

render();