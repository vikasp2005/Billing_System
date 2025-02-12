
import { useState } from "react"
import { Link } from "react-router-dom"
import { useAlert } from "../Components/AlertContext"
import Spinner from "../Components/Spinner"

function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const { showAlert } = useAlert()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            const data = await response.json()
            if (response.ok) {
                showAlert("Password reset email sent", "success")
            } else {
                showAlert(data.message, "error")
            }
        } catch (error) {
            showAlert("An error occurred", "error")
        }
        setLoading(false)
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
                <h3 className="text-2xl font-bold text-center">Forgot Password</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <div>
                            <label className="block" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-baseline justify-between">
                            <button
                                className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? <Spinner /> : "Reset Password"}
                            </button>
                            <Link to="/" className="text-sm text-blue-600 hover:underline">
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword

