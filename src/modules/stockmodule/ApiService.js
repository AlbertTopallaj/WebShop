export default class ApiService{
    constructor(path) {
        this.path = path
    }
    
    async get(index) {
        if (index === undefined) index = ""
        const response = await fetch(this.path+index, 
            {
            method: "GET"
            }
        )

        return response.json()
    }
    
    async put(index, value) {
        if (index === undefined) index = ""
        const response = await fetch(this.path+index, 
            {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(value)
            }
        )

        return response.json()
    }
    
    async post(index, value) {
        if (index === undefined) index = ""
        const response = await fetch(this.path+index, 
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(value)
            }
        )

        return response.json()
    }
    
    async delete(index) {
        if (index === undefined) index = ""
        const response = await fetch(this.path+index, 
            {
            method: "DELETE"
            }
        )

        return response.json()
    }
    
    async patch(index, parameter, value) {
        var response
        if (index === undefined) index = ""
        response = await fetch(this.path+index, 
            {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( { [parameter]: value } )
            }
        )
        
        return response.json()
    }
}