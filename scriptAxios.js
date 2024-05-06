
const d = document
const $table = d.querySelector('.crud-table')
const $form = d.querySelector('.crud-form')
const $tittle = d.querySelector('.crud-title')
const $template = d.querySelector('#crud-template').content
const $fragment = d.createDocumentFragment()


const getAll = async () => {
    try {
        let res = await axios.get('http://localhost:5000/Santos/')

        let json = await res.data


        json.forEach(el => {
            $template.querySelector('.name').textContent = el.nombre
            $template.querySelector('.constellation').textContent = el.constelacion
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
        console.log(error.message)


    }
}
d.addEventListener('DOMContentLoaded', getAll)

d.addEventListener('submit', async e => {
    if (e.target === $form) {
        e.preventDefault()
//crear elemento o peticiones post
        if (!e.target.id.value) {
            let options = {
                nombre: e.target.name.value,
                constelacion: e.target.constelacion.value
            }

            try {
                let res = await axios.post('http://localhost:5000/Santos', options)
                let json = await res.data

            } catch (err) {
                let errorMessageElement = ` <b>${err.message}</b>`
                $form.insertAdjacentHTML('afterend', errorMessageElement)
            }
        } else {
            console.log(e.target.id.value)
            //editar elemento o peticiones put
            let options = {
                id:e.target.id.value,
                method: "PUT",
                nombre: e.target.name.value,
                constelacion: e.target.constelacion.value
            }

            try {
                let options = {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    data: JSON.stringify({
                        id: e.target.id.value,
                        nombre: e.target.nombre.value,
                        constelacion: e.target.constelacion.value
                    })
                }
                const res = await fetch(`http://localhost:5000/Santos/${e.target.id.value}`, options)
                const json = res.data
            } catch (err) {
                let errorMessageElement = ` <b>${err.message}</b>`
                $form.insertAdjacentHTML('afterend', errorMessageElement)
            }
        }
    }
}

)



d.addEventListener('click', async e => {
    if (e.target.matches('.edit')) {
        $tittle.textContent = `Editar Caballero`
        $form.nombre.value = e.target.dataset.name
        $form.constelacion.value = e.target.dataset.constellation
        $form.id.value = e.target.dataset.id

    }
    if (e.target.matches('.delete')) {
        //    DELETE
        console.log(e.target.dataset.name)
        console.log(e.target.dataset.id)
        let isDelete = confirm(`Estás seguro de eliminar ${e.target.dataset.name}`)
        try {
            let options = {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
               
            }
            const res = await fetch(`http://localhost:5000/Santos/${e.target.dataset.id}`, options)
            const json = res.data
        } catch (err) {

            let errorMessageElement = ` <b>${err.message}</b>`
            $form.insertAdjacentHTML('afterend', errorMessageElement)
        }
    }
})

