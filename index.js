const gitHubForm = document.getElementById('gitHubForm');

gitHubForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let usernameInput = document.getElementById('usernameInput');
    let gitHubUsername = usernameInput.value;
    let userProfile = document.getElementById('userProfile'); 

    requestUserProfile(gitHubUsername)
        .then(response => response.json())
        .then(data => {
 

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
            userProfile.scrollIntoView({ behavior: 'smooth' });
        })
        .catch(error => console.log(error, "Something went wrong"));

             
});

function requestUserProfile(username) {
    return Promise.resolve(fetch(`https://api.github.com/users/${username}`));
}

 