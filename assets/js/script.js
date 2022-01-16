var searchInput = document.getElementById("search-input");
var matchList = document.getElementById("match-list");
var searchBtn = document.getElementById("search-btn");
var mealList = document.getElementById("meal");
var mealDetailsContent = document.querySelector(".meal-details-content");
var mealDetails = document.querySelector(".meal-details");
var recipeCloseBtn = document.getElementById("recipe-close-btn");
var mealNutrientsContent = document.querySelector(".meal-nutrients-content");
var modalEl = document.querySelector(".all-modals");
var nutrientCloseBtn = document.getElementById("nutrient-close-btn")

// event listeners
searchBtn.addEventListener("click", getMealList);
matchList.addEventListener("click", submitInput);
mealList.addEventListener("click", getMealRecipe);
recipeCloseBtn.addEventListener("click", () => {
    mealDetailsContent.parentElement.classList.remove("showRecipe");

});
nutrientCloseBtn.addEventListener("click", () => {
    mealNutrientsContent.parentElement.classList.remove("showNutrients");
  });
mealDetails.addEventListener("click", getDetails);
searchInput.addEventListener("input", () => searchIngredients(searchInput.value));


/*nutrientCloseBtn.addEventListener("click", () => {
    console.log("click");
    mealNutrientsContent.parentElement.classList.remove("showNutrients");
});*/



//global arrays & objects
var ingredientsFinder = ["strIngredient1","strIngredient2","strIngredient3","strIngredient4","strIngredient5","strIngredient6","strIngredient7","strIngredient8","strIngredient9","strIngredient10","strIngredient11","strIngredient12","strIngredient13","strIngredient14","strIngredient15","strIngredient16","strIngredient17","strIngredient18","strIngredient19","strIngredient20",];
var quantityFinder = ["strMeasure1","strMeasure2","strMeasure3","strMeasure4","strMeasure5","strMeasure6","strMeasure7","strMeasure8","strMeasure9","strMeasure10","strMeasure11","strMeasure12","strMeasure13","strMeasure14","strMeasure15","strMeasure16","strMeasure17","strMeasure18","strMeasure19","strMeasure20",];
var ingredients = [];
var quantity = [];
var nutritionalInfo = {calories: 0,totalFat: 0,cholesterol: 0,sodium: 0,carbs: 0,protein: 0,vitaminA: 0,vitaminC: 0,vitaminD: 0, vitaminK: 0,calcium: 0,iron: 0,potassium: 0,magnesium: 0,};
var allIngredients =[];

//get autocomplete array
function getArray() {
    fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list")
        .then(function(response){
            if (response.ok){
                response.json().then(function (data){
                    var ingredientsList=data.meals
                    for (var i=0; i<ingredientsList.length; i++){
                        var ingredient =ingredientsList[i].strIngredient;
                        allIngredients.push(ingredient);
                    }
                })
                allIngredients.sort();
            }
            else{
                console.log("error");
                return;
            }
        })
};
//search allIngredients and filter it
function searchIngredients(searchText) {
    let matches = allIngredients.filter(ingredient => {
        var regEx = new RegExp (`^${searchText}`, "gi");
        return ingredient.match(regEx);
    });
    if (searchText.length === 0){
        matches =[];
        matchList.innerHTML="";
    }
    else{
    displayMatches(matches);
    }
}
// Show autocomplete options in html
function displayMatches(matches) {
    if(matches.length > 0){
        var html = matches.map(match => `
        <div class="auto-fill">
            <h4>${match}<h4>
        </div>`).join("");
    }
    matchList.innerHTML = html;
}
//run search if autocomplete option selected
function submitInput(event){
    var input=event.target.innerHTML;
    searchInput.value=input;
    getMealList();
}

// get meal list that matches with the search ingredient
function getMealList() {
  var inputTxt = document.getElementById("search-input").value.trim();
  fetch("https://www.themealdb.com/api/json/v1/1/filter.php?i=" + inputTxt)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          if (data.meals) {
            mealList.innerHTML = "";
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
            }
          } else {
            mealList.innerHTML =
              "Sorry we didn't find any receipes. Try a different ingredient!";
            mealList.classList.add("notFound");
          }
        });
      } else {
        mealList.innerHTML = "Sorry we were unable to connect!";
        mealList.classList.add("notFound");
      }
    })
    .catch(function (error) {
      mealList.innerHTML = "Sorry we were unable to connect!";
      mealList.classList.add("notFound");
    });
    matches =[];
    matchList.innerHTML="";
    searchInput.value="";
}
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
            <button type = "submit" class = "more-info button is-link" id = "${meal.idMeal}">More Info</button>
            
        </div>
        </div>
    `;
  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add("showRecipe");
}
// get recipe of the meal
function getMealRecipe(event) {
  event.preventDefault();
  if (event.target.classList.contains("recipe-btn")) {
    var mealItem = event.target.parentElement.parentElement;
    var mealNumber = mealItem.getAttribute("id");
    fetch(
      "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealNumber
    ).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          mealRecipeModal(data.meals);
        });
      } else {
        mealList.innerHTML =
          "Sorry! We are currently unable to display this receipe.";
        mealList.classList.add("notFound");
      }
    });
  }
}
//Compile all ingredients from receipe
function getDetails(event) {
  event.preventDefault();
  if (event.target.classList.contains("more-info")) {
    var infoButton = document.querySelector(".more-info");
    infoButton.classList.add("button", "is-link", "is-loading");
    var mealNumber = event.target.getAttribute("id");
    fetch(
      "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealNumber
    ).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          var meal = data.meals[0];
          for (var i = 0; i < ingredientsFinder.length; i++) {
            var term = ingredientsFinder[i];
            var ingredient = meal[term];
            if (ingredient) {
              ingredients.push(ingredient);
            }
          }
          for (var i = 0; i < quantityFinder.length; i++) {
            var number = quantityFinder[i];
            var quantityDetail = meal[number];
            if (quantityDetail) {
              var checkFraction = quantityDetail.includes("/");
              if (checkFraction) {
                var extractFraction = quantityDetail.substring(0, 4);
                console.log(extractFraction);
                var converted = eval(extractFraction);
                console.log(converted);
                quantityDetail = quantityDetail.replace(
                  extractFraction,
                  converted + " "
                );
              }
              quantityDetail = convertUnits(quantityDetail);
              quantity.push(quantityDetail);
            }
          }
          getNutrients(ingredients, quantity);
        });
      }
    });
  }
}
//convert ingredient units so that they are compatible with second api
function convertUnits(quantity) {
  if (quantity.includes("oz")) {
    var replace = quantity.replace("oz", "ounce");
    return replace;
  } else if (quantity.includes("lb")) {
    var replace = quantity.replace("lb", "pound");
    return replace;
  } else if (quantity.includes("pinch")) {
    var replace = quantity.replace("pinch", "1 pinch");
    return replace;
  } else if (quantity.includes("tsp")) {
    var replace = quantity.replace("tsp", "teaspoon");
    return replace;
  } else if (quantity.includes("tbs")) {
    var replace = quantity.replace("tbs", "tablespoon");
    return replace;
  } else {
    return quantity;
  }
}

// get nutrients
var getNutrients = async function (ingredientsArr, quantityArr) {
  for (var i = 0; i < ingredientsArr.length; i++) {
    var quantity = quantityArr[i];
    var ingredient = ingredientsArr[i];
    var url =
      "https://api.edamam.com/api/nutrition-data?app_id=2337a25d&app_key=2e70d2bea2e5ec47fa07d2b9c6babc6f&nutrition-type=cooking&ingr=" +
      quantity +
      " " +
      ingredient;
    var apiUrl = encodeURI(url);
    await fetch(apiUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          var fat = data.totalDaily.FAT.quantity;
          nutritionalInfo.totalFat = Math.floor(nutritionalInfo.totalFat + fat);
          var calories = data.calories;
          nutritionalInfo.calories = Math.floor(
            nutritionalInfo.calories + calories
          );
          var cholesterol = data.totalDaily.CHOLE.quantity;
          nutritionalInfo.cholesterol = Math.floor(
            nutritionalInfo.cholesterol + cholesterol
          );
          var sodium = data.totalDaily.NA.quantity;
          nutritionalInfo.sodium = Math.floor(nutritionalInfo.sodium + sodium);
          var carbs = data.totalDaily.CHOCDF.quantity;
          nutritionalInfo.carbs = Math.floor(nutritionalInfo.carbs + carbs);
          var protein = data.totalDaily.PROCNT.quantity;
          nutritionalInfo.protein = Math.floor(
            nutritionalInfo.protein + protein
          );
          var vA = data.totalDaily.VITA_RAE.quantity;
          nutritionalInfo.vitaminA = Math.floor(nutritionalInfo.vitaminA + vA);
          var vC = data.totalDaily.VITC.quantity;
          nutritionalInfo.vitaminC = Math.floor(nutritionalInfo.vitaminC + vC);
          var vD = data.totalDaily.VITD.quantity;
          nutritionalInfo.vitaminD = Math.floor(nutritionalInfo.vitaminD + vD);
          var vK = data.totalDaily.VITK1.quantity;
          nutritionalInfo.vitaminK = Math.floor(nutritionalInfo.vitaminK + vK);
          var calc = data.totalDaily.CA.quantity;
          nutritionalInfo.calcium = Math.floor(nutritionalInfo.calcium + calc);
          var iron = data.totalDaily.FE.quantity;
          nutritionalInfo.iron = Math.floor(nutritionalInfo.iron + iron);
          var potas = data.totalDaily.K.quantity;
          nutritionalInfo.potassium = Math.floor(
            nutritionalInfo.potassium + potas
          );
        });
      }
    });
  }
  mealNutrientModal(nutritionalInfo);
  var infoButton = document.querySelector(".more-info");
    infoButton.classList.remove("is-loading");
};

/*nutrientCloseBtn.addEventListener("click", () => {
    mealNutrientsContent.parentElement.classList.remove("showNutrients");
});*/





// create a modal for nutrients
function mealNutrientModal(nutrientsObj) {
  console.log(nutrientsObj);
  let html = `
    <div class = "nutrient-list">
        <h2 class = "nutrient-title">Nutrients</h2>
        <h3 class = "disclaimer"> The following details are for the full receipe NOT the serving sizes<h3>
        <div>
            <p class="calories"><span>Calories:</span> ${nutrientsObj.calories} </p>
            <div class="top-list">
                <p class="right-justify exception">% Daily Value<p>
                <p><span>Total Fat:</span> ${nutrientsObj.totalFat} %</p>
                <p><span>Cholesteral:</span> ${nutrientsObj.cholesterol} %</p>
                <p><span>Sodium:</span> ${nutrientsObj.sodium} %</p>
                <p><span>Carbohydrates:</span> ${nutrientsObj.carbs} %</p>
                <p class="exception"><span>Protein:</span> ${nutrientsObj.protein} %</p>
            </div>
            <p><span>Vitamin A:</span> ${nutrientsObj.vitaminA} %</p>
            <p><span>Vitamin C:</span> ${nutrientsObj.vitaminC} %</p>
            <p><span>Vitamin D:</span> ${nutrientsObj.vitaminD} %</p>
            <p><span>Vitamin K:</span> ${nutrientsObj.vitaminK} %</p>
            <p><span>Calcium:</span> ${nutrientsObj.calcium} %</p>
            <p><span>Iron:</span> ${nutrientsObj.iron} %</p>
            <p><span>Potassium:</span> ${nutrientsObj.potassium} %</p>
        </div>
    </div>
    `;
  mealNutrientsContent.innerHTML = html;
  modalEl.classList.add("modalFlex","container");
  mealNutrientsContent.parentElement.classList.add("showNutrients");
}

getArray();
