import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView';
import previewView from './views/previewView.js';
import addRecipeView from './views/addRecipeView.js';
// import bookmarksView from './views/bookmarksView';
// 0.5 da ide u 1/2 NMP PAKET SA GUGLA
import { Fraction } from 'fractional';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView.js';
import { Fraction } from 'fractional';

// if (module.hot) {
//   module.hot.accept();
// }

// console.log(icons);
const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// console.log('test');

// ASYNC FUNCTION SO WE CAN USE AWAIT
const controlRecipes = async function () {
  // AJAX REQUEST FOR API
  try {
    const id = window.location.hash.slice(1);

    // Da nema erora ako nema id nego daje pocetnu
    if (!id) return;
    recipeView.renderSpinner();

    //0. Update results view to mark selected search result
    resultsView.update(model.getSearchResultPage());
    // 1. LOADING RECIPE // koristimo await jer je async function
    await model.loadRecipe(id);

    // Zovemo funkciju na cijeli container recepta
    // 2. RENDERING RECIPE
    recipeView.render(model.state.recipe);
    // const recipeView = new recipeView(model.state.recipe);
    // Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    // alert(err);
    recipeView.renderError();
    console.error(err);
  }
};
// controlRecipes();

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //Get search query
    const query = searchView.getQuery();
    if (!query) return;
    // Load search results
    await model.loadSearchResult(query);

    // rendrer results
    // Svi rezultati
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultPage());

    // Redner initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

// ovo ce se desiti kad god se klikne dugme na pagination
const controlPagination = function (goToPage) {
  // rendrer NEW results

  resultsView.render(model.getSearchResultPage(goToPage));

  // Redner NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings(in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1. add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe.id);
  console.log(model.state.recipe.bookmarked);
  //2. Update recipe view
  recipeView.update(model.state.recipe);
  //3. render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  // console.log(newRecipe);

  //upload the new recipe data
  try {
    // SHow loading spinner
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    // RENDER RECIPE
    recipeView.render(model.state.recipe);
    // Succes message
    addRecipeView.renderMessage();
    // REnder bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back()
    //CLOSE FORM WINDOW
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('$', err);
    addRecipeView.renderError(err.message);
  }
};
const newFeature = function () {
  console.log('Welcome to the application');
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};
init();
// ISTO KAO OVO IZNAD SAMO BEZ DUPLIRANJA
// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
