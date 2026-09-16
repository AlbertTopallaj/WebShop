export default class ApiService{
    constructor(path) {
        this.path = path
    }
    
    async get() {
        const fun = await fetch(this.path, 
            {
            method: "GET"
            }
        )
        this.#errorHandling(fun)

        return fun.json()
    }
    
    async put(index, value) {
        if (index === undefined) index = ""
        const fun = await fetch(this.path+index, 
            {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(value)
            }
        )
        this.#errorHandling(fun)

        return fun.json()
    }
    
    async post(index, value) {
        if (index === undefined) index = ""
        const fun = await fetch(this.path+index, 
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(value)
            }
        )
        this.#errorHandling(fun)

        return fun.json()
    }
    
    async delete(index) {
        if (index === undefined) index = ""
        const fun = await fetch(this.path+index, 
            {
            method: "DELETE"
            }
        )
        this.#errorHandling(fun)

        return fun.json()
    }
    
    async patch(index, parameter, value) {
        if (index === undefined) index = ""
        const fun = await fetch(this.path+index, 
            {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( { [parameter]: value } )
            }
        )
        this.#errorHandling(fun)

        return fun.json()
    }

    #errorHandling(fun) {
        try {
            const response = fun
            if (!response.ok) {
                throw new Error(response.status)
            }
        } catch(e) {
            console.error(e.message)
        }
    }
}