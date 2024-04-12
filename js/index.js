const searchForm = document.getElementById('searchForm');
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');

        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const searchTerm = searchInput.value.trim();
            if (searchTerm === '') return;

            const users = await searchUsers(searchTerm);
            displayUsers(users);
        });

        async function searchUsers(query) {
            const url = `https://api.github.com/search/users?q=${query}`;
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            const data = await response.json();
            return data.items;
        }

        async function getUserRepos(username) {
            const url = `https://api.github.com/users/${username}/repos`;
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            const data = await response.json();
            return data;
        }

        function displayUsers(users) {
            searchResults.innerHTML = '';
            users.forEach(user => {
                const userElement = document.createElement('div');
                userElement.innerHTML = `
                    <h2>${user.login}</h2>
                    <img src="${user.avatar_url}" alt="${user.login}" style="width: 100px; height: 100px;">
                    <a href="${user.html_url}" target="_blank">Profile</a>
                `;
                userElement.addEventListener('click', async () => {
                    const repos = await getUserRepos(user.login);
                    displayRepos(repos);
                });
                searchResults.appendChild(userElement);
            });
        }

        function displayRepos(repos) {
            searchResults.innerHTML = '';
            repos.forEach(repo => {
                const repoElement = document.createElement('div');
                repoElement.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>${repo.description}</p>
                    <a href="${repo.html_url}" target="_blank">Link to Repo</a>
                `;
                searchResults.appendChild(repoElement);
            });
        }