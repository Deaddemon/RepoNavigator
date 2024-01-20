const gitHubForm = document.getElementById('gitHubForm');

let currentPage = 1;
let reposPerPage = 10;
let repositoriesData = [];

gitHubForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let usernameInput = document.getElementById('usernameInput');
    let gitHubUsername = usernameInput.value;
    let userContent = document.getElementById('userContent');
    let userError = document.getElementById('userNotFound');

    try {
        const userProfileData = await fetchUserProfile(gitHubUsername);
        displayUserProfile(userProfileData);

        repositoriesData = await fetchUserRepositories(userProfileData.repos_url);
        displayUserRepositories(repositoriesData);

        document.getElementById('repoFilters').style.display = 'block';
        userError.style.display = 'none';

        userContent.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error(error, "Something went wrong");
        if (error.message.includes("404")) {
            userContent.innerHTML = '';
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

async function fetchUserRepositories(repositoriesURL) {
    const response = await fetch(repositoriesURL);
    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

function displayUserProfile(userData) {
    let userProfile = document.getElementById('userProfile');
    let avatar = document.querySelector('.avatar');
    let name = document.querySelector('.userName');
    let bio = document.querySelector('.userBio');
    let url = document.querySelector('.userURL');
    let location = document.querySelector('.userLocation');

    avatar.src = userData.avatar_url;
    name.innerHTML = userData.name;
    bio.innerHTML = userData.bio;
    url.innerHTML = userData.html_url;
    url.href = userData.html_url;
    location.innerHTML = userData.location;

    userProfile.style.display = 'block';
}



function displayUserRepositories() {
     

    const startIndex = (currentPage - 1) * reposPerPage;
    const endIndex = startIndex + reposPerPage;

    const repositoryList = document.getElementById('repositories');
    const repositoryTemplate = document.getElementById('repoTemplate');
    

    for (let i = startIndex; i < endIndex && i < repositoriesData.length; i++) {

        
        const  repository = repositoryTemplate.cloneNode(true);
        repository.style.display = 'block';

        let repoTitle = repository.querySelector('.repoTitle');
        let repoDescription = repository.querySelector('.repoDescription');
        let repoTopics = repository.querySelector('.repoTopics');
        

        repoTitle.innerHTML = repositoriesData[i].name;
        repoDescription.innerHTML = repositoriesData[i].description;
        

        for (let topic in repositoriesData[i].topics) {
            let button = document.createElement('button');
            button.classList.add('btn', 'btn-outline-info', 'btn-sm', 'm-1', 'disabled');
            button.innerHTML = repositoriesData[i].topics[topic];
            repoTopics.appendChild(button);
        }
        

        repositoryList.appendChild(repository);
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

















// function displayUserRepositories() {


   
//     let repositories = document.getElementById('repositories');
//     repositories.innerHTML = '';

//     const startIndex = (currentPage - 1) * reposPerPage;
//     const endIndex = startIndex + reposPerPage;

//     for (let i = startIndex; i < endIndex && i < repositoriesData.length; i++) {
//         let figure = document.createElement('figure');
//         let repositoryInfo = document.createElement('div');
//         let title = document.createElement('h2');
//         let figcaption = document.createElement('figcaption');
//         let repositoryTopics = document.createElement('div');

//         title.classList.add('repositoryName');
//         title.innerHTML = repositoriesData[i].name;

//         repositoryInfo.classList.add('repositoryInfo');

//         figcaption.innerHTML = repositoriesData[i].description;

//         for (let topic in repositoriesData[i].topics) {
//             let button = document.createElement('button');
//             button.classList.add('btn', 'btn-outline-info', 'btn-sm', 'm-1', 'disabled');
//             button.innerHTML = repositoriesData[i].topics[topic];
//             repositoryTopics.appendChild(button);
//         }

//         repositoryInfo.appendChild(title);
//         repositoryInfo.appendChild(figcaption);

//         figure.appendChild(title);
//         figure.appendChild(figcaption);
//         figure.appendChild(repositoryTopics);
//         repositories.appendChild(figure);
//     }
// }
