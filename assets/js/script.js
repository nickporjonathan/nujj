var searchInput = document.getElementById("search-input");
var searchBtn = document.getElementById("search-btn");
var mealList = document.getElementById("meal");
var mealDetailsContent = document.querySelector(".meal-details-content");
var mealDetails = document.querySelector(".meal-details");
var recipeCloseBtn = document.getElementById("recipe-close-btn");


// event listeners
searchBtn.addEventListener("click", getMealList);
mealList.addEventListener("click", getMealRecipe);
recipeCloseBtn.addEventListener("click", () => {
    mealDetailsContent.parentElement.classList.remove("showRecipe");
});
mealDetailsContent.addEventListener("click", getDetails);

var getDetails = function (event){
    console.log("triggered");
    // event.preventDefault();
    // console.log(event.target);
    // if (event.target.classList.contains('more-info')) {
    //     console.log("more info clicked");
// }
};


// get meal list that matches with the search ingredient
function getMealList() {
    var inputTxt = document.getElementById('search-input').value.trim();
    fetch("https://www.themealdb.com/api/json/v1/1/filter.php?i=" + inputTxt)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    if (data.meals) {
                        mealList.innerHTML="";
                        var mealsArray = data.meals;
                        for (var i = 0; i < mealsArray.length; i++) {
                            var receipeOption = document.createElement("div");
                            receipeOption.className = "meal-item";
                            receipeOption.setAttribute("id", mealsArray[i].idMeal);
                            //get image
                            var receipeImgContainer = document.createElement("div");
                            receipeImgContainer.className = "meal-img";
                            var receipeImg = document.createElement("img");
                            receipeImg.setAttribute("src", mealsArray[i].strMealThumb);
                            receipeImg.setAttribute("alt", mealsArray[i].strMeal);
                            //get receipe
                            var receipeName = document.createElement("div");
                            receipeName.className = "meal-name";
                            var receipeTitle = document.createElement("h3");
                            receipeTitle.textContent = mealsArray[i].strMeal;
                            var receipeBtn = document.createElement("a");
                            receipeBtn.className = "recipe-btn";
                            receipeBtn.innerHTML = "Get Recipe";
                            receipeBtn.setAttribute("href", "#");
                            //append Elements
                            receipeName.appendChild(receipeTitle);
                            receipeName.appendChild(receipeBtn);
                            receipeImgContainer.appendChild(receipeImg);
                            receipeOption.appendChild(receipeImgContainer);
                            receipeOption.appendChild(receipeName);
                            mealList.appendChild(receipeOption);
                        };
                    }
                    else {
                        mealList.innerHTML = "Sorry we didn't find any receipes. Try a different ingredient!";
                        mealList.classList.add("notFound");
                    }
                });
            }
            else {
                mealList.innerHTML = "Sorry we were unable to connect!";
                mealList.classList.add("notFound");
            }
        })
        .catch(function(error){
            mealList.innerHTML = "Sorry we were unable to connect!";
            mealList.classList.add("notFound");
        })
};

// get recipe of the meal
function getMealRecipe(event) {
    event.preventDefault();
    if (event.target.classList.contains('recipe-btn')) {
        var mealItem = event.target.parentElement.parentElement
        var mealNumber = mealItem.getAttribute("id");
        fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i="+ mealNumber)
            .then(function (response){
                if (response.ok){
                    response.json().then(function(data){
                        mealRecipeModal(data.meals);
                    })
                }
                else{
                    mealList.innerHTML = "Sorry! We are currently unable to display this receipe.";
                    mealList.classList.add("notFound");
                }
            })
    }
};
// get full list of ingredients
var getIngredients = function(mealId){
    var apiUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealId;
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data);
            })
        }
    })
} 
// get nutrients
var getInfo = function(){
    var apiUrl = "https://api.edamam.com/api/nutrition-data?app_id=1a090f1c&app_key=61f7b34a6416e5761e95f3b2161ba4df&nutrition-type=cooking&ingr=1beef"
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data);
            })
        }
    })
}
getInfo(); 

// create a modal
function mealRecipeModal(meal) {
    console.log(meal);
    meal = meal[0];
    let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = additionalButtons>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
};










// var searchInstant = function() {
//     var input=searchInput.val
//     var apiUrl ="https://trackapi.nutritionix.com/v2/search/instant?query=" + input;
//     fetch(apiUrl,{
//         method: "GET",
//         headers: {"Ocp-Apim-Subscription-Key": key}
//     }).then(function(response){
//         if(response.ok){
//          response.json().then(function(data){
//          console.log(data);
//          });
//          }
//         else{
//             alert("Error: GitHub User Not Found");
//         }
//     })
//     .catch(function(error){
//         alert("Unable to connect to GitHub");
//     })
//  };
