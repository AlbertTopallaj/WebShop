export class EndpointNotReachable extends Error {
    constructor(status) {
        super(`Unable to fetch data from API: ${status}`)
    }
}