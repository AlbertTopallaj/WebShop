import { useVAT } from "./VATContext.jsx";

export default function VATPrice({ price }) {
    const { includeVAT } = useVAT();

    return (
        <span>
            {price.toFixed(2)} kr
        </span>
    );
}