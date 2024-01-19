const gitHubForm = document.getElementById('gitHubForm');

gitHubForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let usernameInput = document.getElementById('usernameInput');
    let gitHubUsername = usernameInput.value;
    let userContent = document.getElementById('userContent');


    requestUserProfile(gitHubUsername)
        .then(response => {
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {

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
            userContent.scrollIntoView({ behavior: 'smooth' });
        })
        .catch(error => {
            console.error(error, "Something went wrong");
            if (error.message.includes("404")) {

                let userError = document.getElementById('userNotFound');
                userError.style.display = 'block';
                userError.scrollIntoView({ behavior: 'smooth' });
            }
        });


});

function requestUserProfile(username) {
    return Promise.resolve(fetch(`https://api.github.com/users/${username}`));
}

