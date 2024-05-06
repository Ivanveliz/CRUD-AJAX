const d = document
const $table = d.querySelector('.crud-table')
const $form = d.querySelector('.crud-form')
const $tittle = d.querySelector('.crud-title')
const $template = d.querySelector('#crud-template').content
const $fragment = d.createDocumentFragment()


//para hacer este crud usamos fetch y funciones asincronas
const getAll = async () => {
    try {
        const res = await fetch('http://localhost:5000/Santos/')
        if (!res.ok) {
            throw {
                status: res.status,
                statusText: res.statusText
            }
        }

        const json = await res.json()


        json.forEach(el => {
            $template.querySelector('.name').textContent = el.nombre
            $template.querySelector('.constelation').textContent = el.constelacion
            $template.querySelector('.edit').dataset.name = el.nombre
            $template.querySelector('.edit').dataset.constellation = el.constelacion
            $template.querySelector('.edit').dataset.id = el.id
            $template.querySelector('.delete').dataset.id = el.id
            $template.querySelector('.delete').dataset.name = el.nombre

            let $templateClone = d.importNode($template, true)
            $fragment.appendChild($templateClone)
        });
        $table.querySelector('tbody').appendChild($fragment)

    } catch (error) {
        console.log(error)
        let message = error.statusText || 'Ocurrio un error.'
        let errorMessageElement = `<b>${message} ${error.status}</b>`
        $table.insertAdjacentHTML('afterend', errorMessageElement)

    }

}


d.addEventListener('DOMContentLoaded', getAll)

//metodos para editar y/o crear elementos:
d.addEventListener('submit', async e => {
    if (e.target === $form) {
        e.preventDefault()
        console.log(e.target.id.value)
        if (!e.target.id.value) {
            //peticion de tipo create-post
            try {

                let options = {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        nombre: e.target.nombre.value,
                        constelacion: e.target.constelacion.value
                    })
                }
                const res = await fetch('http://localhost:5000/Santos', options)

                if (!res.ok) {
                    throw {
                        status: res.status,
                        statusText: res.statusText
                    }
                }
                const json = await res.json()
                location.reload()

                
            } catch (error) {
                console.log(error)
                let message = error.statusText || 'Ocurrio un error.'
                let errorMessageElement = `<b>${message} ${error.status}</b>`
                $form.insertAdjacentHTML('afterend', errorMessageElement)
            }
        } else {
            //update put
            try {
                let options = {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        id: e.target.id.value,
                        nombre: e.target.nombre.value,
                        constelacion: e.target.constelacion.value
                    })
                }
                const res = await fetch(`http://localhost:5000/Santos/${e.target.id.value}`, options)
                if (!res.ok) {
                    throw {
                        status: res.status,
                        statusText: res.statusText
                    }
                }

                const json = await res.json()
                location.reload()
            } catch (error) {
                console.log(error)
                let message = error.statusText || 'Ocurrio un error.'
                let errorMessageElement = `<b>${message} ${error.status}</b>`
                $form.insertAdjacentHTML('afterend', errorMessageElement)
            }
        }
    }
})


//evento de cliquear botones:
d.addEventListener('click', async e => {
    if (e.target.matches('.edit')) {
        $tittle.textContent = `Editar caballero`
        $form.nombre.value = e.target.dataset.name
        $form.constelacion.value = e.target.dataset.constellation
        $form.id.value = e.target.dataset.id
        console.log($form.id.value)

    }
    if (e.target.matches('.delete')) {
        //Delete-DELETE
        console.log(e.target.dataset.name)
        let isDelete = confirm(`Estás seguro de eliminar ${e.target.dataset.name}`)
        if (isDelete) {
            try {
                let options = {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    
                    }
                let res = await fetch(`http://localhost:5000/Santos/${e.target.dataset.id}`, options)
                if (!res.ok) {
                    throw {
                        status: res.status,
                        statusText: res.statusText
                    }
                }
            } catch (error) {
                console.log(error)
                let message = error.statusText || 'Ocurrio un error.'
                let errorMessageElement = `<b>${message} ${error.status}</b>`
                $form.insertAdjacentHTML('afterend', errorMessageElement)
            }
        }
       
    }
})