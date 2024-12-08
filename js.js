// VARIABLES COMPARTIDAS EN LOS DOS HTML

let result = window.location.href.split("/");
let resultF = result[result.length-1];
let recetasTotales = [];
let recetaFav = null;
if(localStorage.getItem("recetaFav")){
    recetasTotales = JSON.parse(localStorage.getItem("recetaFav"));
}
const toastLiveExample = document.getElementById('liveToast')
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
const toastTrigger = document.getElementById('liveToastBtn')
const toastTrigger2 = document.getElementById('liveToastBtn2')


if(resultF == "index.html"){ //Compruebo si me encuentro en index o en favs
    //VARIABLES NECESARIAS PARA EL INDEX

    let selectCategorias = document.querySelector("#categorias select");
    let divComidas = document.querySelector("#recetas .row");
    
    // FUNCIONALIDADES DEL INDEX
    // Funcion para el fetching de datos de la API con la URL
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

    function mostrarRecetasCatSeleccionada(categoria){
        limpiar(divComidas);
        const url2 = "https://www.themealdb.com/api/json/v1/1/filter.php?c="+categoria;
        obtenerDatos(url2)
        .then(datos =>{
            datos.meals.forEach(dato => {
                divComidas.innerHTML += `
                <div class="col-md-4">
                    <div class="card text-white bg-primary mb-3">
                        <div class="card-header"><img class="img-fluid" src="${dato.strMealThumb}" alt=""></div>
                        <div class="card-body">
                            <h4 class="card-title">${dato.strMeal}</h4>
                            <button type="button" class="btn btn-danger col-12" data-bs-toggle="modal" data-bs-target="#emergente" onclick=mostrarReceta(${dato.idMeal}) >Ver la receta</button>
                        </div>
                    </div>
                </div>
                `;
            });
        });
    }

    cargarCategorias();
}else{
    // FUNCIONALIDADES DE FAVORITOS
    const contenedorRecetas = document.querySelector("#recetas .row");
    if(JSON.parse(localStorage.getItem("recetaFav")) == "" || !JSON.parse(localStorage.getItem("recetaFav"))){
        let mensaje = document.createElement("h2");
        mensaje.classList.add("text-center");
        mensaje.textContent = "Aun no tienes ninguna receta en Favoritos";
        document.querySelector(".row > h1").append(mensaje);
    }else{
        recetasTotales.forEach(receta => {
            contenedorRecetas.innerHTML += `
            <div class="col-md-4">
                <div class="card text-white bg-primary mb-3">
                    <div class="card-header"><img class="img-fluid" src="${receta.img}" alt=""></div>
                    <div class="card-body">
                        <h4 class="card-title">${receta.nombreReceta}</h4>
                        <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#emergente" onclick=mostrarReceta(${receta.id}) >Ver la receta</button>
                    </div>
                </div>
            </div>
            `;
        });
    }
}

// TODAS LAS FUNCIONES UTILES
function obtenerDatos(url){
    return fetch(url).then(respuesta => respuesta.json());
}

function limpiar(cosa){
    cosa.innerHTML = ``;
}

function mostrarReceta(idReceta){
    let ul = document.querySelector(".modal ul");
    if(ul != null){
        limpiar(ul);
    }
    const url3 = "https://www.themealdb.com/api/json/v1/1/lookup.php?i="+idReceta;
    obtenerDatos(url3).then(receta =>{
        let titulo = document.querySelector(".modal-title");
        titulo.innerHTML = `
            <h1 class="modal-title fs-5" id="emergenteLabel">${receta.meals[0].strMeal}</h1>
        `;
        let img = document.querySelector(".modal img");
        img.setAttribute("src",receta.meals[0].strMealThumb);
        let p = document.querySelector(".modal-body p");
        p.innerHTML = `
            <p class="my-3">${receta.meals[0].strInstructions}</p>
        `
        
        for (let i = 1; i <= 20; i++) {
            if(!receta.meals[0][`strIngredient${i}`] == "" || !receta.meals[0][`strIngredient${i}`] == null){
                ul.innerHTML += `
                    <li class = "list-group-item">${receta.meals[0][`strIngredient${i}`]} - ${receta.meals[0][`strMeasure${i}`]}</li>
                `;
            }
        }

        recetaFav = {
            id: idReceta,
            nombreReceta: receta.meals[0].strMeal,
            img: receta.meals[0].strMealThumb,
            instrucciones: receta.meals[0].strInstructions
        }

        let but1 = document.querySelector(".modal-footer button:nth-child(1)");
        let but2 = document.querySelector(".modal-footer button:nth-child(2)");
    
        if(localStorage.getItem("recetaFav")){
            if(!localStorage.getItem("recetaFav").includes(recetaFav.id)){
                but1.style.display = "block";
                but2.style.display = "none";
            }else{
                but1.style.display = "none";
                but2.style.display = "block";
            }
        }

        modificarBotones(but1, but2);
    })
}

function modificarBotones(butAñadirFavs, butEliminarFavs){
    butAñadirFavs.addEventListener("click", () =>{
        subirLocalStorage(recetaFav);
        butAñadirFavs.style.display = "none";
        butEliminarFavs.style.display = "block";
    });
    butEliminarFavs.addEventListener("click", () =>{
        eliminarLocalStorage(recetaFav);
        butAñadirFavs.style.display = "block";
        butEliminarFavs.style.display = "none";
    });
}

function subirLocalStorage(recetasFav){
    let cont = 0;
    recetasTotales.forEach(receta => {
        if(receta.id == recetasFav.id){
            cont++;
        }
    });
    if(cont == 0){
        recetasTotales.push(recetasFav);
        localStorage.setItem("recetaFav", JSON.stringify(recetasTotales));
    }
}

function eliminarLocalStorage(recetasFav){
    recetasTotales.forEach((receta, index) => {
        if(receta.id == recetasFav.id){
            recetasTotales.splice(index, 1);
            localStorage.setItem("recetaFav", JSON.stringify(recetasTotales));
        }
    });
}

toastTrigger.addEventListener('click', () => {
    toastLiveExample.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">R<span>A</span>PPI</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">Añadido a Favoritos con éxito</div>
        </div>
    `;
    toastBootstrap.show()
    })
// const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
toastTrigger2.addEventListener('click', () => {
    toastLiveExample.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">R<span>A</span>PPI</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">Eliminado de Favoritos con éxito</div>
        </div>
    `;
    toastBootstrap.show()
})


