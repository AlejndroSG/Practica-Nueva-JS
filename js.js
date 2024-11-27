//VARIABLES NECESARIAS Y CONSTANTES
let selectCategorias = document.querySelector("#categorias select");
let divComidas = document.querySelector("#recetas .row");
let divs = null;


// FUNCIONALIDADES

// Funcion para el fetching de datos de la API con la URL
function obtenerDatos(url){
    return fetch(url).then(respuesta => respuesta.json());
}

function cargarCategorias(){
    const url = "https://www.themealdb.com/api/json/v1/1/categories.php"
    obtenerDatos(url).then(datos =>{
        datos.categories.forEach(dato => {
            selectCategorias.innerHTML +=`
                <option value="${dato.strCategory}">${dato.strCategory}</option>
            `;
        });
    })
}

function limpiar(cosa){
    cosa.innerHTML = ``;
}

function mostrarRecetasCatSeleccionada(categoria){
    limpiar(divComidas);
    const url2 = "https://www.themealdb.com/api/json/v1/1/filter.php?c="+categoria;
    // console.log(url2);
    obtenerDatos(url2)
    .then(datos =>{
        // console.log(datos.meals);
        datos.meals.forEach(dato => {
            // console.log(dato);
            divComidas.innerHTML += `
            <div class="col-md-4">
                <div class="card text-white bg-primary mb-3">
                    <div class="card-header"><img class="img-fluid" src="${dato.strMealThumb}" alt=""></div>
                    <div class="card-body">
                        <h4 class="card-title">${dato.strMeal}</h4>
                        <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#emergente" onclick=mostrarReceta(${dato.idMeal}) >Ver la receta</button>
                    </div>
                </div>
            </div>
            `;
        });
    });
}

function mostrarReceta(idReceta){
    let ul = document.querySelector(".modal ul");
    limpiar(ul);
    const url3 = "https://www.themealdb.com/api/json/v1/1/lookup.php?i="+idReceta;
    obtenerDatos(url3).then(receta =>{
        console.log(receta.meals[0].strMeal);
        let titulo = document.querySelector(".modal-title");
        titulo.innerHTML = `
            <h1 class="modal-title fs-5" id="emergenteLabel">${receta.meals[0].strMeal}</h1>
        `;
        let img = document.querySelector(".modal img");
        img.setAttribute("src",receta.meals[0].strMealThumb);
        let p = document.querySelector(".modal-body p");
        p.innerHTML = `
            <p>${receta.meals[0].strInstructions}</p>
        `
        
        for (let i = 1; i <= 20; i++) {
            if(!receta.meals[0][`strIngredient${i}`] == "" || receta.meals[0][`strIngredient${i}`] == null){
                ul.innerHTML += `
                    <li class = "list-group-item">${receta.meals[0][`strIngredient${i}`]} - ${receta.meals[0][`strMeasure${i}`]}</li>
                `;
            }
        }
    })
}

cargarCategorias();


