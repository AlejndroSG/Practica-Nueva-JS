
let result = window.location.href.split("/");
let resultF = result[result.length-1];
console.log(resultF);

if(resultF == "index.html"){
    let recetaFav = null;
    //VARIABLES NECESARIAS Y CONSTANTES
    let selectCategorias = document.querySelector("#categorias select");
    let divComidas = document.querySelector("#recetas .row");
    let divs = null;
    const toastTrigger = document.getElementById('liveToastBtn')
    const toastTrigger2 = document.getElementById('liveToastBtn2')
    
    const toastLiveExample = document.getElementById('liveToast')

    
    
    // FUNCIONALIDADES
    
    // Funcion para el fetching de datos de la API con la URL
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
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
            console.log(receta);
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
                if(!receta.meals[0][`strIngredient${i}`] == "" || !receta.meals[0][`strIngredient${i}`] == null){
                    ul.innerHTML += `
                        <li class = "list-group-item">${receta.meals[0][`strIngredient${i}`]} - ${receta.meals[0][`strMeasure${i}`]}</li>
                    `;
                }
            }

            recetaFav = {
                id: receta.meals[0].idMeal,
                nombreReceta: receta.meals[0].strMeal,
                img: receta.meals[0].strMealThumb,
                instrucciones: receta.meals[0].strInstructions
            }

            // let hola = titulo.closest(".modal").querySelector(".modal-footer button:nth-child(1)");
            // console.log(hola);

            // console.log(titulo.parentNode.querySelector(".modal-footer button:nth-child(1)"));

            // let butAñadirFavs = titulo.closest(".modal").querySelector(".modal-footer button:nth-child(1)");

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
            // butAñadirFavs.textContent = "Eliminar de Favoritos";
            subirLocalStorage(recetaFav);
            butAñadirFavs.style.display = "none";
            butEliminarFavs.style.display = "block";
        });
        butEliminarFavs.addEventListener("click", () =>{
            // butAñadirFavs.textContent = "Añadir a Favoritos";
            eliminarLocalStorage(recetaFav);
            butAñadirFavs.style.display = "block";
            butEliminarFavs.style.display = "none";
        });
    }
    const todosLosModales = document.querySelectorAll(".modal");

    const recetasTotales = [];
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

    cargarCategorias();
}else{
    // const recetasTotales = JSON.parse(localStorage.getItem("recetaFav"));
    const contenedorRecetas = document.querySelector("#recetas .row");
    if(JSON.parse(localStorage.getItem("recetaFav")) == [] || !JSON.parse(localStorage.getItem("recetaFav"))){
        let mensaje = document.createElement("h2");
        mensaje.classList.add("text-center");
        mensaje.textContent = "Aun no tienes ninguna receta en Favoritos";
        document.querySelector(".row > h1").append(mensaje);
    }else{
        const recetasTotales = JSON.parse(localStorage.getItem("recetaFav"));
        recetasTotales.forEach(receta => {

        });
    }
}


