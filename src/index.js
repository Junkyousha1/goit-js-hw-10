import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import Notiflix from 'notiflix';
import { fetchBreeds, fetchCatByBreed } from './cat-api';
import axios from 'axios';

axios.defaults.headers.common['x-api-key'] ='live_TAprnsB85KhbOrqCyPJyv3EwwdNdRQDIyZOTRYH3w7pkwdVYphcMCJk1XQ7q7qCh';

const selectElement = document.querySelector('.breed-select');
const textMarkElement = document.querySelector('.cat-info');
const loaderElement = document.querySelector('.loader');
const errorElement = document.querySelector('.error');

textMarkElement.classList.add('is-hidden');
errorElement.classList.add('is-hidden');

selectElement.addEventListener('change', onChangeSelect);

updateSelect();

function updateSelect(data) {
  fetchBreeds(data)
    .then(data => {
      loaderElement.classList.toggle('loader', 'is-hidden');

      let markSelect = data.map(({ name, id }) => {
        return `<option value ='${id}'>${name}</option>`;
      });
      selectElement.insertAdjacentHTML('beforeend', markSelect);
      new SlimSelect({
        select: selectElement,
      });
    })
    .catch(onFetchError);
}

function onChangeSelect(event) {
  loaderElement.classList.toggle('is-hidden', 'loader');
  selectElement.classList.add('is-hidden');
  textMarkElement.classList.add('is-hidden');

  const breedId = event.currentTarget.value;

  fetchCatByBreed(breedId)
    .then(data => {
      loaderElement.classList.toggle('loader', 'is-hidden');
      selectElement.classList.remove('is-hidden');

      const { url, breeds } = data[0];

      textMarkElement.innerHTML = `<img src="${url}" alt="${breeds[0].name}" width="400"/>
      <div class="box"><h2>${breeds[0].name}</h2><p>${breeds[0].description}</p>
      <p><strong>Temperament:</strong> ${breeds[0].temperament}</p></div>`;

      textMarkElement.classList.remove('is-hidden');
    })
    .catch(onFetchError);
}

function onFetchError() {
  selectElement.classList.remove('is-hidden');
  loaderElement.classList.toggle('loader', 'is-hidden');

  Notiflix.Notify.failure(
    'Oops! Something went wrong! Try reload the page or select another cat breed!'
  );
}