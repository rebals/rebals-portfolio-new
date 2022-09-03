//profile information will appear//
const overview = document.querySelector(".overview");
//github username
const username = "rebals";
//repo list
const repoList = document.querySelector(".repo-list");
//class with repo informtion
const repoInformation = document.querySelector(".repos");
// Repo data
const repoData = document.querySelector(".repo-data");
//Back to repo gallery button
const returnButton = document.querySelector(".view-repos");
//search by name
const filterInput = document.querySelector(".filter-repos");

const gitProfile = async function (){
    const response = await fetch (`https://api.github.com/users/${username}`);
    const data = await response.json();
    // console.log(data);

    displayUserInfo(data);
};

gitProfile();

const displayUserInfo = function (data) {
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML = `
        <figure>
            <img alt="user avatar" src=${data.avatar_url} />
        </figure>
        <div>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Bio:</strong> ${data.bio}</p>
            <p><strong>Location:</strong> ${data.location}</p>
            <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
        </div>
    `;
    overview.append(div);
    displayRepos(username);
};

const displayRepos = async function(){
    const repoRes = await fetch (`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repoData = await repoRes.json();
    // console.log(repoData);
    repoDisplay(repoData);
};

const repoDisplay = function(repos){
    filterInput.classList.remove("hide");
    for (const repo of repos) {
    const repoItem = document.createElement ("li");
    repoItem.classList.add("repo");
    repoItem.innerHTML = `<h3>${repo.name}</h3>`;
    repoList.append(repoItem);
    }
};

repoList.addEventListener("click", function(e){
    if (e.target.matches("h3")) {
        const repoName = e.target.innerText;
        specificRepoInfo(repoName);
    }
});

const specificRepoInfo = async function(repoName){
    const specificRepo = await fetch (`https:api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await specificRepo.json();
    // console.log(repoInfo);

    const fetchLanguages = await fetch (repoInfo.languages_url);
    const languageData = await fetchLanguages.json();
    console.log(languageData);

    const languages = [];
    for (const language in languageData){
        languages.push(language);
    }

    displaySpecificRepo(repoInfo,languages);
};


const displaySpecificRepo = function(repoInfo,languages) {
    repoData.innerHTML = "";
    
    const div = document.createElement ("div");
    div.innerHTML = `
        <h3>Name: ${repoInfo.name}</h3>
        <p>Description: ${repoInfo.description}</p>
        <p>Default Branch: ${repoInfo.default_branch}</p>
        <p>Languages: ${languages.join(", ")}</p>
        <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
    `;
    repoData.append(div);

    returnButton.classList.remove("hide");
    repoData.classList.remove("hide");
    repoInformation.classList.add("hide");
};

returnButton.addEventListener("click", function(){
    repoInformation.classList.remove("hide");
    repoData.classList.add ("hide");
    returnButton.classList.add("hide");
});

filterInput.addEventListener("input", function(e){
    const searchText = e.target.value;
    console.log(searchText);
    const repos = document.querySelectorAll(".repo");
    const searchTextLower = searchText.toLowerCase();
    for (const repo of repos){
        const repoText = repo.innerText.toLowerCase();
        if (repoText.includes(searchTextLower)){
            repo.classList.remove("hide");
        } else {
            repo.classList.add("hide");
        }
    }
});