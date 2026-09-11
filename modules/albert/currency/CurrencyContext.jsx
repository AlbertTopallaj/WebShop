import { createContext, useState, useContext } from "react";
import CurrencyModule from "./index.js"

const currencyModule = new CurrencyModule();
const CurrencyContext = createContext(null);

export function CurrencyProvider({children}) {
    const [currency, setCurrency] = useState("USD");

    async function convertCart(cartItems) {
        return await currencyModule.run(cartItems, currency);
    }

    return(  <CurrencyContext.Provider value={{ currency, setCurrency, convertCart}}>
        {children}
    </CurrencyContext.Provider>
    );
}

export function useCurrency(){
    return useContext(CurrencyContext);
}