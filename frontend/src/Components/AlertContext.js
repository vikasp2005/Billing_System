
import { createContext, useContext, useState } from "react"

const AlertContext = createContext()

export function useAlert() {
    return useContext(AlertContext)
}

export function AlertProvider({ children }) {
    const [alert, setAlert] = useState(null)

    const showAlert = (message, type) => {
        setAlert({ message, type })
        setTimeout(() => setAlert(null), 3000)
    }

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            {alert && (
                <div
                    className={`fixed bottom-4 right-4 px-4 py-2 rounded-md text-white ${alert.type === "success" ? "bg-green-500" : "bg-red-500"
                        }`}
                >
                    {alert.message}
                </div>
            )}
        </AlertContext.Provider>
    )
}

