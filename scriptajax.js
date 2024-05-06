const d = document
const $table = d.querySelector('.crud-table')
const $form = d.querySelector('.crud-form')
const $tittle = d.querySelector('.crud-title')
const $template = d.querySelector('#crud-template').content
const $fragment = d.createDocumentFragment()


const ajax = (options) => {
    //va a entrar un objeto con los datos que nesecito
    // url = a la que voy a solicitar el acceso
    // method de envio
    // succes  funcion en caso de exito
    // error funcion en caso de error
    // data en caso de tener que enviarle datos a la peticion
    
    //valido si es un objeto
    if (typeof options === "object") {
        //desestructro el objeto
        let { url, method, success, error, data } = options 
        //se crea el objeto xhlhttprequest
        const xhr = new XMLHttpRequest

        //creo el evento que va a tener la logica de lo que pasa
        xhr.addEventListener('readystatechange',e => {
            if (xhr.readyState !== 4) return
            if (xhr.status >= 200 && xhr.status < 300) {
                   //si el status es ok transformo el dato en json JS
                let json = JSON.parse(xhr.responseText)
                success(json)
            } else {
                let message = xhr.status.tex || 'ocurrio un error'
                error(`Error ${xhr.status}: ${message}`)
            }
                
         })
        //ejecuta el metodo open si el usuario no especifica valido el metod get por defecto.
        //el metodo open recibe 2 pametros, el metodo de peticion y la url base
        xhr.open(method || 'GET', url)

        //modifico el header del tipo de dao que va a recibir la peticion, eso me lo da insomnia
        //esto recibe 2 paremetros, el nombre del atributo (en este caso contentype, y su respectivo valor.)
        xhr.setRequestHeader('Content-Type', 'aplicattion/json; charset=utf-8')

        //en el evio de datos, mando el texto modificado de json a texto plano.
        xhr.send(JSON.stringify(data))

    }
    
}

const getAll = () => {
    ajax({
        url: "http://localhost:5000/Santos/",
        success: (res) => {
            console.log(res)
            res.forEach(el => {
                $template.querySelector('.name').textContent = `${el.nombre}`
                $template.querySelector('.constelation').textContent = `${el.constelacion}`
                $template.querySelector('.edit').dataset.id = el.id
                $template.querySelector('.edit').dataset.name = el.nombre
                $template.querySelector('.edit').dataset.constellation = el.constelacion
                $template.querySelector('.delete').dataset.id = el.id

                let $clone = d.importNode($template, true)
                $fragment.appendChild($clone)
            });
            $table.querySelector('tbody').appendChild($fragment)

        },
        error: (err) => {
            console.log(err)
            $table.insertAdjacentHTML('afterend', `<p><b>${err}</b></p>`)
        },    
    })
}
d.addEventListener('DOMContentLoaded', getAll)


d.addEventListener('submit', e => {
    if (e.target === $form) {
        e.preventDefault()
        if (!e.target.id.value) {
            //create-post
            ajax({
                url: "http://localhost:5000/Santos",
                method: "POST",
                success: (res) => {location.reload() },
                error: (err) => {$form.insertAdjacentHTML('afterend', `<p><b>${err}</b></p>`)},
                data: {
                    nombre: e.target.nombre.value,
                    constelacion: e.target.constelacion.value
                }
 
            })
        } else {
            //update - put
            ajax({
                url: `http://localhost:5000/Santos/${e.target.id.value}`,
                method: "PUT",
                success: () => {location.reload() },
                error: (err) => {$form.insertAdjacentHTML('afterend', `<p><b>${err}</b></p>`)},
                data: {
                    nombre: e.target.nombre.value,
                    constelacion: e.target.constelacion.value
                }
            })
        }

    }
})

d.addEventListener('click', e => {
    if (e.target.matches('.edit')) {
        $tittle.textContent = 'Editar Caballero'
        $form.nombre.value = e.target.dataset.name
        $form.constelacion.value = e.target.dataset.constellation
        $form.id.value = e.target.dataset.id
        console.log( $form.id.value)


    } 
    if (e.target.matches('.delete')) {
        let isDelete = confirm(`Estás Seguro de eliminar el ID ${e.target.dataset.id}?`)
        if (isDelete) {
            // delete 
            ajax({
                url: `http://localhost:5000/Santos/${e.target.dataset.id}`,
                method: "DELETE",
                success: () => {location.reload() },
                error: (err) => alert(err),
               
            })
        }
    }
})