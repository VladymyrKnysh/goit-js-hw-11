import simpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from "axios";
import { Notify } from "notiflix";

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadmoreBtn: document.querySelector('.load-more'),
}

let page = 1;
let inputValue = ''
let totalHits = 0
const per_page = 40
const BASE_URL = 'https://pixabay.com/api/'
const KEY = '29578130-7e7d5768f03af60ad584cdcef'
let lightbox = {}
const optionsLightbox = {    
    'captionsData': 'alt',
    'captionPosition': 'bottom',
    'captionDelay': 250 
  }

refs.form.addEventListener('submit', onFormSubmit)
 

function onFormSubmit(e) {
  e.preventDefault()
  refs.gallery.innerHTML = ''
  inputValue = e.currentTarget.elements.searchQuery.value.trim();
  page = 1
  if (inputValue === '') {
    Notify.warning('Поле поиска должно быть заполнено');
    return
  }  
  fetchImages(inputValue)
}


async function fetchImages(inputValue) {
try {
  const response = await axios
    .get(`${BASE_URL}?key=${KEY}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`)
  renderList(response.data.hits)
   lightbox = new SimpleLightbox('.gallery a', optionsLightbox)
  totalHits = response.data.totalHits
  page += 1
  if (totalHits !== 0) {
     Notify.success(`Hooray! We found ${totalHits} images.`)
  }
 
} catch (error) {
  console.log(error);
}
}

function renderList(images) {
  console.log(images);
  if (images.length === 0) {
    refs.gallery.innerHTML = ''
    refs.loadmoreBtn.classList.add('visually-hidden-js')
    Notify.failure('Sorry, there are no images matching your search query. Please try again.')
    return
   }
  const markup = images
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
      return `  <div class="photo-card">
    <a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
  </a>
   <div class="info">
     <p class="info-item">
       <b>Likes</b> <br>
       ${likes}
     </p>
     <p class="info-item">
       <b>Views</b> <br>
       ${views}
    </p>
     <p class="info-item">
       <b>Comments</b> <br>
       ${comments}
     </p>
     <p class="info-item">
       <b>Downloads</b> <br>
       ${downloads}
     </p>
   </div>
 </div>`;
    })
        .join("");
  refs.gallery.insertAdjacentHTML("beforeend", markup)
  refs.loadmoreBtn.classList.remove('visually-hidden-js')
}

refs.loadmoreBtn.addEventListener('click', onLoadmoreClick)

async function onLoadmoreClick() { 
  
  const totalPages = Math.ceil(totalHits / per_page)
  if (page > totalPages) {
    refs.loadmoreBtn.classList.add('visually-hidden-js')
    Notify.info("We're sorry, but you've reached the end of search results.")
    return
  }
  try {
  const response = await axios
    .get(`${BASE_URL}?key=${KEY}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`)
    renderList(response.data.hits)
    lightbox.refresh()
   page += 1
} catch (error) {
  console.log(error);
}
}





  

