let taskName = document.getElementById("task-input");
let dateTime = document.getElementById("task-deadline");
const button = document.querySelector('.add-task-btn');
const taskContainer = document.querySelector('.main-tasks');
const allBtn = document.querySelector('.all-btn');
const pendingBtn = document.querySelector('.pending-btn');
const completedBtn = document.querySelector('.completed-btn');

allBtn.addEventListener('click', () => filterTasks('all'));
pendingBtn.addEventListener('click', () => filterTasks('pending'));
completedBtn.addEventListener('click', () => filterTasks('completed'));

function filterTasks(filterType) {
    const tasks = document.querySelectorAll('.task-container');
    
    allBtn.style.backgroundColor = filterType === 'all' ? 'var(--filter-active)' : 'var(--filter-inactive)';
    pendingBtn.style.backgroundColor = filterType === 'pending' ? 'var(--filter-active)' : 'var(--filter-inactive)';
    completedBtn.style.backgroundColor = filterType === 'completed' ? 'var(--filter-active)' : 'var(--filter-inactive)';
    
    tasks.forEach(task => {
        const isCompleted = task.querySelector('.task-checkbox').checked;
        
        switch(filterType) {
            case 'all':
                task.style.display = 'flex';
                break;
            case 'pending':
                task.style.display = isCompleted ? 'none' : 'flex';
                break;
            case 'completed':
                task.style.display = isCompleted ? 'flex' : 'none';
                break;
        }
    });
}

function updateTaskBoxShadow(taskElement, deadline) {
    const currentTime = new Date();
    const deadlineTime = new Date(deadline);
    
    if (deadlineTime < currentTime) {
        taskElement.style.boxShadow = 'inset 0 0 10px 2px #B81D13';
    } else if (deadlineTime - currentTime < 24 * 60 * 60 * 1000) {
        taskElement.style.boxShadow = 'inset 0 0 10px 2px #b48a03';
    } else {
        taskElement.style.boxShadow = 'inset 0 0 10px 2px #008450';
    }
}

function formatDateForDisplay(dateString) {
    if (!dateString) return '(No Deadline)';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '(Invalid Date)';
    
    // Format as "Day, Month Date, Year at Time"
    return date.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function createnewElement(name, date){
    const newDiv = document.createElement('div');
    newDiv.classList.add('task-container');

    const left = document.createElement('div');
    left.classList.add('left-container');
    newDiv.appendChild(left);

    const right = document.createElement('div');
    right.classList.add('right-container');
    newDiv.appendChild(right);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox');
    left.appendChild(checkbox);

    const content = document.createElement('div');
    content.classList.add('task-content');
    left.appendChild(content);

    const titletask = document.createElement('p');
    titletask.classList.add('task-title');
    titletask.innerText = name;
    content.appendChild(titletask);

    const datetask = document.createElement('p');
    datetask.classList.add('task-date');
    datetask.innerText = formatDateForDisplay(date);
    content.appendChild(datetask);

    const editbtn = document.createElement('button');
    editbtn.classList.add('edit-btn');
    editbtn.innerText = 'Edit';
    right.appendChild(editbtn);

    const deletebtn = document.createElement('button');
    deletebtn.classList.add('delete-btn');
    deletebtn.innerText = 'Delete';
    right.appendChild(deletebtn);

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            titletask.classList.add('completed-task');
            datetask.classList.add('completed-task');
        } else {
            titletask.classList.remove('completed-task');
            datetask.classList.remove('completed-task');
        }
    });
    
    deletebtn.addEventListener('click', () => {
        taskContainer.removeChild(newDiv);
    });

    editbtn.addEventListener('click', () => {
        if (editbtn.innerText === 'Edit') {
            // Replace text with input fields
            const titleInput = document.createElement('input');
            titleInput.type = 'text';
            titleInput.value = titletask.innerText;
            titleInput.classList.add('edit-title-input');
    
            const dateInput = document.createElement('input');
            dateInput.type = 'datetime-local';
            if (datetask.innerText !== '(No Deadline)' && datetask.innerText !== '(Invalid Date)') {
                const dateObj = new Date(datetask.innerText);
                if (!isNaN(dateObj.getTime())) {
                    // Format for datetime-local input (YYYY-MM-DDTHH:MM)
                    const isoString = dateObj.toISOString();
                    dateInput.value = isoString.substring(0, isoString.length - 8);
                }
            }
            dateInput.classList.add('edit-date-input');

            content.replaceChild(titleInput, titletask);
            content.replaceChild(dateInput, datetask);
    
            editbtn.innerText = 'Save';
        } else {
            // Replace input fields with updated text
            const newTitle = content.querySelector('.edit-title-input').value;
            const newDate = content.querySelector('.edit-date-input').value;
    
            titletask.innerText = newTitle;
            datetask.innerText = formatDateForDisplay(newDate);
    
            content.replaceChild(titletask, content.querySelector('.edit-title-input'));
            content.replaceChild(datetask, content.querySelector('.edit-date-input'));
    
            editbtn.innerText = 'Edit';
            updateTaskBoxShadow(newDiv, newDate);
        }
    });
    
    if (date) {
        const taskDeadline = new Date(date);   
        const now = new Date();                      
        const timeDiff = taskDeadline - now;
    
        const diffInHours = timeDiff / (1000 * 60 * 60);
        if (taskDeadline < now) {
            newDiv.classList.add('overdue-task');
        } else if (diffInHours <= 24) {
            newDiv.classList.add('urgent-task');
        } else {
            newDiv.classList.add('normal-task');
        }
    }
    updateTaskBoxShadow(newDiv, date);
    return newDiv;
}

button.addEventListener('click', (e) => {
    e.preventDefault();
    const value1 = taskName.value;
    const value2 = dateTime.value;

    if(!value1){
        alert("Please name the task.");
        return;
    }

    let taskElement = createnewElement(value1, value2);
    taskContainer.appendChild(taskElement);

    taskName.value = '';
    dateTime.value = '';
});
