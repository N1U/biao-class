; (function () {
    'use strict';

    let form = document.getElementById('search-form');
    let input = form.querySelector('[name=keyword]');
    let userList = document.getElementById('user-list');

    boot();

    function boot() {
        bindEvents();
    }

    function bindEvents() {
        form.addEventListener('submit', e => {
            e.preventDefault();
            let keyword = input.value;
            search(keyword);
        });
    }

    function search(keyword) {
        let http = new XMLHttpRequest();
        http.open('get', `https://api.github.com/search/users?q=${keyword}`);
        http.send();

        http.addEventListener('load', () => {
            let data = JSON.parse(http.responseText);
            render(data);
        });
    }

    function render(data) {
        userList.innerHTML = '';
        data.items.forEach(it => {
            let item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = `
                            <div class="avatar">
                                <img src="${it.avatar_url}">
                            </div>
                            <div class="detail">
                                <div class="username">
                                    <a href='${it.html_url}'>
                                    ${it.login}</div>
                                <div class="url">
                                    <a href='${it.html_url}'>
                                    ${it.url}
                                    </div>
                            </div>
                            `;
            userList.appendChild(item);
        });
    }


})();