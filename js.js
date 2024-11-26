//VARIABLES NECESARIAS Y CONSTANTES
let selectCategorias = document.querySelector("#categorias select");
let divComidas = document.querySelector("#recetas .row");
let divs = null;
const url = "https://www.themealdb.com/api/json/v1/1/categories.php"


// FUNCIONALIDADES
function cargarCategorias(){
    fetch(url).then(respuesta => respuesta.json()
    .then(datos =>{
        datos.categories.forEach(dato => {
            selectCategorias.innerHTML +=`
                <option value="${dato.strCategory}">${dato.strCategory}</option>
            `;
        });
    }))
}

function mostrarRecetasCatSeleccionada(categoria){
    divComidas.innerHTML = ` `;
    const url2 = "https://www.themealdb.com/api/json/v1/1/filter.php?c="+categoria;
    // console.log(url2);
    fetch(url2).then(respuesta => respuesta.json()
    .then(datos =>{
        // console.log(datos.meals);
        datos.meals.forEach(dato => {
            // console.log(dato);
            divComidas.innerHTML += `
            <div class="col-md-4">
                <div class="card text-white bg-primary mb-3" data-bs-toggle="modal" data-bs-target="#emergente">
                    <div class="card-header">${categoria}</div>
                    <div class="card-body">
                        <img class="img-fluid" src="${dato.strMealThumb}" alt="">
                        <h4 class="card-title">${dato.strMeal}</h4>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    </div>
                </div>
            </div>
            `;
        });
    }))
    divs = document.querySelectorAll("#recetas .row > div");
    
    divs.forEach(div => {
        div.addEventListener(("click"), () =>{
            console.log(div);
        })
    });
}


cargarCategorias();


