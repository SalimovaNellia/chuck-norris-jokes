'use strict';

let toggleBtn = document.getElementById('sidebarToggle');
toggleBtn.addEventListener('click', toggleSidebar);
let shadow = document.getElementById('shadow');
shadow.addEventListener('click', toggleSidebar);


function toggleSidebar() {
    toggleBtn.classList.toggle('open');
    let sideBar = document.getElementById('favouriteSection');
    sideBar.classList.toggle('open');
    shadow.classList.toggle('open');
}
