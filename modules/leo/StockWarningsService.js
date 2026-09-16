import ApiService from "./ApiService";

export default class StockWarningsService extends ApiService{
    constructor() {
        super("http://localhost:5050/stockWarnings/")
    }

    
}