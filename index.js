const gitHubForm = document.getElementById('gitHubForm');

let currentPage = 1;
let reposPerPage = 5;
let repositoriesData;

gitHubForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let usernameInput = document.getElementById('usernameInput');
    let gitHubUsername = usernameInput.value;
    let userContent = document.getElementById('userContent');

    try {
        const userProfileData = await fetchUserProfile(gitHubUsername);
        displayUserProfile(userProfileData);

        repositoriesData = await fetchUserRepositories(userProfileData.repos_url);
        displayUserRepositories();

        document.getElementById('repoFilters').style.display = 'block';

        userContent.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error(error, "Something went wrong");
        if (error.message.includes("404")) {
            let userError = document.getElementById('userNotFound');
            userError.style.display = 'block';
            userError.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

async function fetchUserProfile(username) {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

function displayUserProfile(data) {
    let userProfile = document.getElementById('userProfile');
    let avatar = document.querySelector('.avatar');
    let name = document.querySelector('.userName');
    let bio = document.querySelector('.userBio');
    let url = document.querySelector('.userURL');
    let location = document.querySelector('.userLocation');

    avatar.src = data.avatar_url;
    name.innerHTML = data.name;
    bio.innerHTML = data.bio;
    url.innerHTML = data.html_url;
    url.href = data.html_url;
    location.innerHTML = data.location;

    userProfile.style.display = 'block';
}

async function fetchUserRepositories(repositoriesURL) {
    const response = await fetch(repositoriesURL);
    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

function displayUserRepositories() {
    let repositories = document.getElementById('repositories');
    repositories.innerHTML = '';

    const startIndex = (currentPage - 1) * reposPerPage;
    const endIndex = startIndex + reposPerPage;

    for (let i = startIndex; i < endIndex && i < repositoriesData.length; i++) {
        let figure = document.createElement('figure');
        let repositoryInfo = document.createElement('div');
        let title = document.createElement('h2');
        let figcaption = document.createElement('figcaption');
        let repositoryTopics = document.createElement('div');

        title.classList.add('repositoryName');
        title.innerHTML = repositoriesData[i].name;

        repositoryInfo.classList.add('repositoryInfo');

        figcaption.innerHTML = (`<p> ${repositoriesData[i].description}</p> `);
        for (let topic in repositoriesData[i].topics) {
            let button = document.createElement('button');
            button.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'm-1', 'disabled');
            button.innerHTML = repositoriesData[i].topics[topic];
            repositoryTopics.appendChild(button);
        }

        repositoryInfo.appendChild(title);
        repositoryInfo.appendChild(figcaption);

        figure.appendChild(repositoryInfo);
        figure.appendChild(repositoryTopics);
        repositories.appendChild(figure);
    }
}


function updatePagination() {
    reposPerPage = parseInt(document.getElementById('reposPerPage').value);
    currentPage = 1;
    displayUserRepositories();
}


function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayUserRepositories();
    }
}

function nextPage() {
    const totalPages = Math.ceil(repositoriesData.length / reposPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayUserRepositories();
    }
}

