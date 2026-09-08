import {createContext, useContext, useEffect, useState} from "react";
import "./Toast.css"

const Context = createContext(null)

export function Toast({children}) {
    const [showToast, setShowToast] = useState(false)
    const [message, setMessage] = useState("")
    const [toastQueue, setToastQueue] = useState([])

    function toast(message, durationInMs = 1000) {
        const time = Date.now()

        setToastQueue(queue => [
            ...queue, {time, message, durationInMs}
        ].sort((a, b) => a.time - b.time))
    }

    useEffect(() => {
        if (showToast || toastQueue.length === 0) return

        setMessage(toastQueue[0].message)
        setShowToast(true);

        setTimeout(() => {
            setShowToast(false);
            setMessage("")
            setToastQueue(current => current.slice(1))
        }, toastQueue[0].durationInMs);

    }, [toastQueue])

    return (
        <>
            <Context.Provider value={{toast}}>
                {children}
            </Context.Provider>
            {showToast && (
                <div className="toast">
                    {message}
                </div>
            )}
        </>
    )
}

export function useToast() {
    return useContext(Context)
}