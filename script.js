const modal = document.getElementById('modal');
const addBookmarkBtn = document.getElementById('add-bookmark');
const closeModal = document.getElementById('close-modal');
const showNewBookmark = document.getElementById('bookmark-container');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteName = document.getElementById('website-name');
const websiteUrl = document.getElementById('website-url');
const bookmarkContainer = document.getElementById('bookmark-container');

// Create an empty bookmark array to allow storeNewBookmark function to update this array
let bookmarkArray = [];

// MODAL -- to show modal when click h1 'add bookmark', to hide modal when click close-icon
function showModal() {
    modal.classList.add('show-modal');
    websiteName.focus();
}

addBookmarkBtn.addEventListener('click', showModal);
closeModal.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => e.target === modal ? modal.classList.remove('show-modal') : false)
// conditional/ternary operator format: condition ? dothisifconditionistrue : dothisifconditionisfalse
// when console.log(e), e.target is the element we click on the window, so if we click the id='modal', which is the class='modal-container'

// ADD NEW BOOKMARK INFORMATION USING BOOKMARK FORM
// a function to check if the url is valid using regular expression
function checkUrlValid(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);
    if (urlValue.match(regex)) {
        return true;
    } else {
        alert('Please provide another valid url')
        return false;
    }
}

// Build bookmark tag, use forEach to run function on each object in the bookmarkArray
// this function is basically to build the following HTML element by js, and papulate the bookmarkArray content into html elements
/* 
<div class="bookmark-items">
    <div class="item-group">
        <img src="favicon.png" alt="favicon-icon">
        <a href="https://www.google.com/" target="_blank">Google Search</a>
        <i id="delete-bookmark" class="fas fa-trash-alt" title="Delete Bookmark"></i>
    </div>
</div> 
*/

function buildBookmarkTag() {
    // remove everything from bookmarkContainer before we add new bookmark tag
    bookmarkContainer.textContent = '';
    bookmarkArray.forEach((bookmark) => {
        // 1) deconstructe bookmarkArray's name and url
        const { name, url } = bookmark;
        // create <div>, and give it a classname: bookmark-items
        const bookmarkItems = document.createElement('div');
        bookmarkItems.classList.add('bookmark-items');
        // create <div>, give it a classname: item-group
        const itemGroup = document.createElement('div');
        itemGroup.classList.add('item-group');
        // create <img> element and set src and alt attribute, use template string to apply url into the favicons img src.
        const websiteIcon = document.createElement('img');
        websiteIcon.setAttribute('src', `http://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        websiteIcon.setAttribute('alt', 'favicon-icon');
        // create <a>, href, target, and text
        const websiteLink = document.createElement('a');
        websiteLink.setAttribute('href', `${url}`);
        websiteLink.setAttribute('target', '_blank');
        websiteLink.textContent = name;
        // create <i> and add calss and title
        // for bookmarkCloseIcon, we setAttribute 'onclick' will allow to run a function on like addEventListener, and add a function delete-bookmark(url), pass the url into this function as well
        const bookmarkCloseIcon = document.createElement('i');
        bookmarkCloseIcon.classList.add('fas', 'fa-trash-alt');
        bookmarkCloseIcon.setAttribute('title', 'Delete Bookmark');
        bookmarkCloseIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        // append all this element together step by step
        itemGroup.append(websiteIcon, websiteLink, bookmarkCloseIcon);
        bookmarkItems.append(itemGroup);
        bookmarkContainer.appendChild(bookmarkItems);
    });
}

function fetchLocalStorage() {
    // getItem from localStorage when it's available
    if (localStorage.getItem('bookmarkArray')) {
        bookmarkArray = JSON.parse(localStorage.getItem('bookmarkArray'))
    } else {
        // when there is nothing in bookmarkArray, we want to add a default array to show the new user how this app is working
        bookmarkArray = [{
            name: 'Google',
            url: 'https://google.com'
        }];
        localStorage.setItem('bookmarkArray', JSON.stringify(bookmarkArray));
    }
    // after dealing with localStorage, it's time to create the bookmark tag and show up at the page
    buildBookmarkTag();
}

// this is a function inside the buildBookmarkTag function, the goal is to trigger the onclick attribute when clicking the bookmarkCloseIcon
// if the bookmark.url match the url we are passing, then remove that specific url from the bookmarkArray, and then update the localStorage and fetch the localStorage
function deleteBookmark(url) {
    bookmarkArray.forEach((bookmark, i) => {
        if (bookmark.url === url) {
            bookmarkArray.splice(i, 1);
        }
    });
    localStorage.setItem('bookmarkArray', JSON.stringify(bookmarkArray));
    fetchLocalStorage();
}

// when get the nameValue and valid urlValue, 
// 1) create a newBookmark object
// 2) push these info into the bookmarkArray
// 3) store bookmarkArray into localStorage using JSON.stringify(because newBookmark is an object, and it needs to be transformed into string)
// 4） create another function to fetch the localStorage bookmarkArray(use JSON.parse)
function storeNewBookmark(e) {
    e.preventDefault();
    const nameValue = websiteName.value;
    let urlValue = websiteUrl.value;
    if (!urlValue.includes('http://' && 'https://')) {
        urlValue = `https://${urlValue}`
    };
    if (!checkUrlValid(nameValue, urlValue)) {
        return false;
    };
    const newBookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarkArray.push(newBookmark);
    localStorage.setItem('bookmarkArray', JSON.stringify(bookmarkArray));
    fetchLocalStorage();
    bookmarkForm.reset();
    websiteName.focus();
}

bookmarkForm.addEventListener('submit', storeNewBookmark)

// ON LOAD: always fetch localstorage information
fetchLocalStorage();