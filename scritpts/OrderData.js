export class Order {
    constructor(email, cart, date) {
        this.email = email
        this.cart = cart
        this.date = date
    }
}

export async function UserExists(email) {
    try {
        const response =
            await fetch(`http://localhost:5050/orders?email=${encodeURIComponent(email)}&_page=1&_per_page=1`)

        if (!response.ok) {
            return false
        }

        const data = await response.json()
        console.log(data)

        return data.data.length > 0
    } catch (e) {
        return false
    }
}

export async function getUserData(email) {
    const response = await fetch(`http://localhost:5050/orders?email=${encodeURIComponent(email)}`)
    if (!response.ok) {
        return false
    }
    const data = await response.json()

    const orders = Array.isArray(data) ? data : [data]

    return orders.map(order =>
        new Order(
            order.email,
            order.cart,
            order.date
        )
    )
}

export async function postOrder(email, cart){
    const order = new Order(email, cart, new Date().toISOString())

    try {
        const response = await fetch("http://localhost:5050/orders",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(order)
            })
        return response.ok;

    } catch (e) {
        return false
    }
}