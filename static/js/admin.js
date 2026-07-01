/* ==========================
MODAL EDITAR
========================== */

function abrirModal(
    id,
    nombre,
    precio,
    descripcion,
    categoria,
    stock,
    imagen,
    tallas
){

    const modal =
    document.getElementById("modalEditar");

    modal.style.display = "flex";

    document.getElementById("editId").value = id;
    document.getElementById("editNombre").value = nombre;
    document.getElementById("editPrecio").value = precio;
    document.getElementById("editDescripcion").value = descripcion;
    document.getElementById("editCategoria").value = categoria;
    document.getElementById("editStock").value = stock;
    document.getElementById("editTallas").value = tallas;
    document.getElementById("previewImagen").src = imagen;

}

function cerrarModal(){

    document.getElementById("modalEditar")
    .style.display = "none";

}

/* ==========================
GUARDAR CAMBIOS
========================== */

const formEditar =
document.getElementById("formEditar");

if(formEditar){

    formEditar.addEventListener(
        "submit",
        function(e){

            e.preventDefault();

            const id =
            document.getElementById("editId")
            .value;

            const formData =
            new FormData();

            formData.append(
                "nombre",
                document.getElementById("editNombre").value
            );

            formData.append(
                "precio",
                document.getElementById("editPrecio").value
            );

            formData.append(
                "descripcion",
                document.getElementById("editDescripcion").value
            );

            formData.append(
                "categoria",
                document.getElementById("editCategoria").value
            );

            formData.append(
                "stock",
                document.getElementById("editStock").value
            );

            formData.append(
                "tallas",
                document.getElementById("editTallas").value
            );

            const imagen =
            document.getElementById("editImagen");

            if(
                imagen &&
                imagen.files.length > 0
            ){
                formData.append(
                    "imagen",
                    imagen.files[0]
                );
            }

            fetch(
                `/editar-producto/${id}/`,
                {
                    method:"POST",

                    headers:{
                        "X-CSRFToken":
                        document.querySelector(
                            "[name=csrfmiddlewaretoken]"
                        ).value
                    },

                    body:formData
                }
            )
            .then(response => response.json())
            .then(data => {

                if(data.success){

                    alert(
                        "Producto actualizado correctamente"
                    );

                    cerrarModal();

                    location.reload();

                }else{

                    alert(
                        "No se pudo actualizar"
                    );

                }

            })
            .catch(error => {

                console.error(error);

                alert(
                    "Error al actualizar"
                );

            });

        }
    );

}


function mostrarTab(tab){

    document.getElementById("tab-productos").style.display = "none";

    const pedidos = document.getElementById("tab-pedidos");
    if(pedidos){
        pedidos.style.display = "none";
    }

    const config = document.getElementById("tab-config");
    if(config){
        config.style.display = "none";
    }

    document.getElementById(
        "tab-" + tab
    ).style.display = "block";

}