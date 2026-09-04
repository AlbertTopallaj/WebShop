import { createContext, useContext, useState } from "react";

export const VATContext = createContext();

export function VATProvider({ children }) {
    const [includeVAT, setIncludeVAT] = useState(true);

    return (
        <VATContext.Provider value={{ includeVAT, setIncludeVAT }}>
            {children}
        </VATContext.Provider>
    );
}

export function useVAT() {
    return useContext(VATContext);
}