const imageContainer = document.getElementById('image-container');
const cols = document.querySelectorAll('.grid-col');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('error-message';

let colShownNum = 0;                                         
let imagesLoaded;
let totalImages;
let photo = [];
let loadDone = false;

// Unsplash API
const count = 30;
const apiKey = 'OZW-0mtx97tbtHI6GQAa6e9iSJNfq_yhrfDMCR47A5A';
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&YOUR_ACCESS_KEY&count=${count}`;

function updateAPIURLWithNewCount(picCount) {
    apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${picCount}`;
}

// Check if all images were loaded
function hasImageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        loadDone = true;
        loader.hidden = true;
    }
}

// Helper Function to set Attributes on DOM Elements
function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
};
const getColHeights = () => {
    let colHeights = [cols[0].clientHeight, cols[1].clientHeight, cols[2].clientHeight];
    const visibleColHeight = colHeights.filter((height) => height);
    return visibleColHeight;
};
const findShorterCol = () => {
    const heights = getColHeights();
    return heights.indexOf(Math.min(...heights));
};

// Create Elements for Links & Photos, Add to DOM
function displayPhotos() {
    imagesLoaded = 0;
    totalImages = photos.length;
    // Run function for each object in photosArray
    photos.forEach((photo, index) => {
    // Create <a> to link to Unsplash 
    const item = document.createElement('a');
    item.className = `grid-item ${index}`;
    setAttributes(item, {
        href: photo.links.html,
        target: '_blank',
    });

        // Create <img> for photo
        const img = document.createElement('img');
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description,
        });

        // Event Listener, check when each is finished loading
        img.addEventListener('load', hasImageLoaded);

        // Put <img> inside <a>, then put both inside imageContainer Element
        item.appendChild(img);
        setTimeout(() => {
            if (colShownNum === 3) {
                //append image in shorter column
                const ShorterColIndex = findShorterCol();
                cols[shorterColIndex].appendChild(item);
            } else {
                cols[index % 3].appendChild(item);
            }
        }, 100 * index);

    });
};

// Get Photos from Unsplash API
const getPhotos = async () {
    loadDone = false;
    loader.hidden = false;
    errorMessage.style.display = 'none';
    
    try {
        const response = await fetch(apiUrl);
        photos = await response.json();
        displayPhotos();
    } catch (error) {
       errorMessage.textContent = 'error : api usage limit exceeded , try again after an hour ';
    errorMessage.style.display = 'block';
    loadDone = true;
    loader.hidden = true;
    console.log('getPhoto error', error);
    }
};
// Get  grid column number
window.addEventListener('resize', () => {
    if (getColHeights().length !== colShownNum) {
        colShownNum = getColHeights().length;
    }
});
// Check to see if scrolling near bottom of page, Load More Photos
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight && loadDone) {
        checkScrollBottomAfter1Sec();    
    }
});

const checkScrollBottomAfter1Sec = () => {
    setTimeout(() => {
        if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight && loadDone) {
            console.log('load more...');
            getPhotos();
        }
    }, 1000);
};
// On Load
getPhotos();
