// FRONT END JAVASCRIPT FILE

// Function to handle the display of different views
function showView(viewId) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => view.style.display = 'none');
    // Hide specific lists when going back to the dashboard
    if (viewId === 'dashboard') {
        const teamsList = document.getElementById('teamsList');
        if (teamsList) teamsList.style.display = 'none';

        const tasksList = document.getElementById('tasksList');
        if (tasksList) tasksList.style.display = 'none';

        const usersList = document.getElementById('usersList');
        if (usersList) usersList.style.display = 'none';
    }
    // Show the requested view
    const viewToShow = document.getElementById(viewId);
    if (viewToShow) {
        viewToShow.style.display = 'block';
    }
}

// Event listener for the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    // Event listener for the 'Enter' button
    document.getElementById('enterButton').addEventListener('click', function() {
        showView('dashboard');
    });
});

///////////////////////////////////////////////////TASKS////////////////////////////////////////////////////

//Function to fetch and populate teams in he task dropdown menu
function fetchAndPopulateTeams() {
    console.log("Fetching & populating teams");
    return fetch('/api/teams')
        .then(response => response.json())
        .then(teams => {
            const taskTeamSelect = document.getElementById('newTaskTeam');
            taskTeamSelect.innerHTML = '<option value="">Select Team</option>';
            teams.forEach(team => {
                const option = document.createElement('option');
                option.value = team._id; 
                option.textContent = team.name; 
                taskTeamSelect.appendChild(option); 
            });
        })
        .catch(error => console.error('Error fetching teams:', error));
}

// Functions to create a new task
function createNewTask() {
    const taskTitle = document.getElementById('newTaskTitle').value;
    const taskDescription = document.getElementById('newTaskDescription').value;
    const taskDeadline = document.getElementById('newTaskDeadline').value;
    const taskPriority = document.getElementById('newTaskPriority').value;
    const taskStatus = document.getElementById('newTaskStatus').value;
    const taskTeam = document.getElementById('newTaskTeam').value;
    // Log the team ID
    console.log('Creating task with team ID:', taskTeam); 
    fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            title: taskTitle,
            description: taskDescription,
            deadline: taskDeadline,
            priority: taskPriority,
            status: taskStatus,
            team: taskTeam,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Task created:', data);
        fetchAndDisplayTasks(); // Refresh the task list
    })
    .catch(error => console.error('Error creating task:', error));
}

// Function to show the Create Task Form
function showCreateTaskForm() {
    document.getElementById('taskFormMode').value = 'add';
    document.getElementById('currentTaskId').value = '';
    document.getElementById('newTaskTitle').value = '';
    document.getElementById('newTaskDescription').value = '';
    document.getElementById('newTaskDeadline').value = '';
    document.getElementById('newTaskPriority').value = '';
    document.getElementById('newTaskStatus').value = '';
    document.getElementById('newTaskTeam').value = '';
    document.getElementById('taskFormSubmitButton').textContent = 'Submit New Task';
    document.getElementById('createTaskForm').style.display = 'block';
    fetchAndPopulateTeams();
}

// Function to submit the Task Form
function submitTaskForm() {
    const formMode = document.getElementById('taskFormMode').value;
    const taskId = document.getElementById('currentTaskId').value;
    const taskData = {
        title: document.getElementById('newTaskTitle').value,
        description: document.getElementById('newTaskDescription').value,
        deadline: document.getElementById('newTaskDeadline').value,
        priority: document.getElementById('newTaskPriority').value,
        status: document.getElementById('newTaskStatus').value,
        team: document.getElementById('newTaskTeam').value
    };
    let url = '/api/tasks';
    let method = 'POST';
    if (formMode === 'edit') {
        url += `/${taskId}`;
        method = 'PUT';
    }
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Task operation successful:', data);
        fetchAndDisplayTasks();
        document.getElementById('createTaskForm').style.display = 'none';
    })
    .catch(error => console.error('Error in task operation:', error));
}

// Function to fetch and display tasks
function fetchAndDisplayTasks() {
    console.log("Fetching tasks");
    fetch('/api/tasks')
        .then(response => response.json())
        .then(tasks => {
            const tasksList = document.getElementById('tasksList');
            tasksList.innerHTML = ''; // Clearing the list before repopulating
            tasksList.style.display = 'block'; // Make the list visible
            tasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.className = 'list-item'; 
                taskItem.innerHTML = `
                    <h3>${task.title}</h3>
                    <p>Description: ${task.description || 'No description'}</p>
                    <p>Deadline: ${task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</p>
                    <p>Priority: ${task.priority}</p>
                    <p>Status: ${task.status}</p>
                    <p>Assigned Team: ${task.team ? task.team.name : 'No team assigned'}</p>
                    <button onclick="editTask('${task._id}')">Edit</button>
                    <button onclick="deleteTask('${task._id}')">Delete</button>
                `;
                tasksList.appendChild(taskItem);
            });
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
            tasksList.innerHTML = `<p>Error loading tasks: ${error.message}</p>`;
        });
}

// Function to edit a Task
function editTask(taskId) {
    fetch(`/api/tasks/${taskId}`)
        .then(response => response.json())
        .then(task => {
            document.getElementById('newTaskTitle').value = task.title;
            document.getElementById('newTaskDescription').value = task.description;
            document.getElementById('newTaskDeadline').value = task.deadline;
            document.getElementById('newTaskPriority').value = task.priority;
            document.getElementById('newTaskStatus').value = task.status;
            document.getElementById('newTaskTeam').value = task.team;
            document.getElementById('taskFormMode').value = 'edit';
            document.getElementById('taskFormSubmitButton').textContent = 'Update Task';
            document.getElementById('currentTaskId').value = taskId;
            document.getElementById('createTaskForm').style.display = 'block';
        })
        .catch(error => console.error('Error fetching task details:', error));
}

// Function to delete task
function deleteTask(taskId) {
    fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
        .then(() => fetchAndDisplayTasks()) // Refresh the list
        .catch(error => console.error('Error deleting task:', error));
}

///////////////////////////////////////////////////TEAMS////////////////////////////////////////////////////

// Function to fetch and populate users in the team dropdown menu
function fetchAndPopulateUsers(selectedUserIds = []) {
    fetch('/api/users')
        .then(response => response.json())
        .then(users => {
            const membersSelect = document.getElementById('teamMembers');
            membersSelect.innerHTML = '';
            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user._id;
                option.textContent = user.name;
                option.selected = selectedUserIds.includes(user._id);
                membersSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching users:', error));
}

// Functions to create a new team
function createNewTeam() {
    const teamName = document.getElementById('newTeamName').value;
    const teamDescription = document.getElementById('newTeamDescription').value;
    // Extracting the selected member IDs from the multi-select dropdown (might not be used exactly here as we go just an option for now)
    const membersSelect = document.getElementById('teamMembers');
    const selectedMembers = Array.from(document.getElementById('teamMembers').selectedOptions).map(option => option.value);
    fetch('/api/teams', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            name: teamName, 
            description: teamDescription,
            members: selectedMembers
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Team created:', data);
        fetchAndDisplayTeams(); // Refresh the team list
    })
    .catch(error => console.error('Error creating team:', error));
}

// Function to show the Create Team Form
function showCreateTeamForm() {
    document.getElementById('teamFormMode').value = 'add';
    document.getElementById('currentTeamId').value = '';
    document.getElementById('newTeamName').value = '';
    document.getElementById('newTeamDescription').value = '';
    document.getElementById('teamMembers').innerHTML = '<option value="">Select Users</option>';
    document.getElementById('teamFormSubmitButton').textContent = 'Create Team';
    document.getElementById('createTeamForm').style.display = 'block';
    fetchAndPopulateUsers();
}

// Function to submit the Team Form
function submitTeamForm() {
    const formMode = document.getElementById('teamFormMode').value;
    const teamId = document.getElementById('currentTeamId').value;
    const selectedMembers = Array.from(document.getElementById('teamMembers').selectedOptions).map(option => option.value);
    const teamData = {
        name: document.getElementById('newTeamName').value,
        description: document.getElementById('newTeamDescription').value,
        members: selectedMembers
    };
    let url = '/api/teams';
    let method = 'POST';
    if (formMode === 'edit') {
        url += `/${teamId}`;
        method = 'PUT';
    }
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Team operation successful:', data);
        fetchAndDisplayTeams();
        document.getElementById('createTeamForm').style.display = 'none';
    })
    .catch(error => console.error('Error in team operation:', error));
}

// Function to fetch and display teams
function fetchAndDisplayTeams() {
    fetch('/api/teams')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(teams => {
            const teamsList = document.getElementById('teamsList');
            teamsList.innerHTML = ''; // Clear the list
            teamsList.style.display = 'block'; // Make the list visible
            teams.forEach(team => {
                const teamItem = document.createElement('div');
                // Create a string of member names
                let memberNames = 'No members assigned';
                if (team.members && team.members.length > 0) {
                    memberNames = team.members.map(user => user.name).join(', ');
                }
                teamItem.innerHTML = `
                    <h3>${team.name}</h3>
                    <p>Description: ${team.description || 'No description'}</p>
                    <p>Assigned Members: ${memberNames}</p>
                    <button onclick="editTeam('${team._id}')">Edit</button>
                    <button onclick="deleteTeam('${team._id}')">Delete</button>
                `;
                teamsList.appendChild(teamItem);
            });
        })
        .catch(error => {
            console.error('Error fetching teams:', error);
            teamsList.innerHTML = `<p>Error loading teams: ${error.message}</p>`;
        });
}

// Function to edit team
function editTeam(teamId) {
    fetch(`/api/teams/${teamId}`)
        .then(response => response.json())
        .then(team => {
            document.getElementById('newTeamName').value = team.name;
            document.getElementById('newTeamDescription').value = team.description;
            const memberIds = team.members.map(member => member._id);
            fetchAndPopulateUsers(memberIds);
            document.getElementById('teamFormMode').value = 'edit';
            document.getElementById('teamFormSubmitButton').textContent = 'Update Team';
            document.getElementById('currentTeamId').value = teamId;
            document.getElementById('createTeamForm').style.display = 'block';
        })
        .catch(error => console.error('Error fetching team details:', error));
}

// Function to delete team
function deleteTeam(teamId) {
    fetch(`/api/teams/${teamId}`, { method: 'DELETE' })
        .then(() => fetchAndDisplayTeams()) // Refresh the list
        .catch(error => console.error('Error deleting team:', error));
}

///////////////////////////////////////////////////USERS////////////////////////////////////////////////////

// Functions to create users
function createNewUser() {
    const userName = document.getElementById('newUserName').value;
    fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: userName }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('User created:', data);
        fetchAndDisplayUsers(); // Refresh the user list
    })
    .catch(error => console.error('Error creating user:', error));
}

// Function to show the Create User Form
function showCreateUserForm() {
    document.getElementById('userName').value = '';
    document.getElementById('userFormMode').value = 'add';
    document.getElementById('currentUserId').value = '';
    document.getElementById('userFormSubmitButton').textContent = 'Create User';
    document.getElementById('createUserForm').style.display = 'block';
}

// Function to submit the User Form
function submitUserForm() {
    const formMode = document.getElementById('userFormMode').value;
    const userId = document.getElementById('currentUserId').value;
    const userData = {
        name: document.getElementById('userName').value,
    };
    let url = '/api/users';
    let method = 'POST';
    if (formMode === 'edit') {
        url += `/${userId}`;
        method = 'PUT';
    }
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('User operation successful:', data);
        fetchAndDisplayUsers();
        document.getElementById('createUserForm').style.display = 'none';
    })
    .catch(error => console.error('Error in user operation:', error));
}

// Function to fetch and display users
function fetchAndDisplayUsers() {
    console.log("Fetching users");
    fetch('/api/users')
        .then(response => response.json())
        .then(users => {
            const usersList = document.getElementById('usersList');
            usersList.innerHTML = '';
            usersList.style.display = 'block'; // Make the list visible
            users.forEach(user => {
                const userItem = document.createElement('div');
                userItem.innerHTML = `
                    <h3>${user.name}</h3>

                    <button onclick="editUser('${user._id}')">Edit</button>
                    <button onclick="deleteUser('${user._id}')">Delete</button>
                `;
                usersList.appendChild(userItem);
            });
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            usersList.innerHTML = `<p>Error loading users: ${error.message}</p>`;
        });
}

// Function to show Edit User Form
function showEditUserForm(userId) {
    fetch(`/api/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById('editUserName').value = user.name;
            document.getElementById('editUserForm').style.display = 'block';
            document.getElementById('editUserForm').dataset.userId = userId; // Store the user ID to use when saving
        })
        .catch(error => console.error('Error fetching user details:', error));
}

// Function to hide Edit User Form
function hideEditUserForm() {
    document.getElementById('editUserForm').style.display = 'none';
}

// Function to edit a user
function editUser(userId) {
    fetch(`/api/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById('userName').value = user.name;
            document.getElementById('userFormMode').value = 'edit';
            document.getElementById('currentUserId').value = userId;
            document.getElementById('userFormSubmitButton').textContent = 'Update User';
            document.getElementById('createUserForm').style.display = 'block';
        })
        .catch(error => console.error('Error fetching user details:', error));
}

// Function to delete a user
function deleteUser(userId) {
    fetch(`/api/users/${userId}`, { method: 'DELETE' })
        .then(() => fetchAndDisplayUsers()) // Refresh the list
        .catch(error => console.error('Error deleting user:', error));
}

