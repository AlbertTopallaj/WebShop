import { createContext, useContext, useState } from "react";

const VATContext = createContext();

export function VATProvider({ children }) {
    const [includeVAT, setIncludeVAT] = useState(false);

    const MOMS_PROCENT = 25;

    function getPrice(priceWithoutVAT) {
        if (includeVAT) {
            return priceWithoutVAT * (1 + MOMS_PROCENT / 100);
        }

        return priceWithoutVAT;
    }

    return (
        <VATContext.Provider
            value={{
                includeVAT,
                setIncludeVAT,
                MOMS_PROCENT,
                getPrice
            }}
        >
            {children}
        </VATContext.Provider>
    );
}

export function useVAT() {
    return useContext(VATContext);
}