
import { useState } from "react"
import { useParams } from "react-router-dom"
import { useAlert } from "../Components/AlertContext"
import Spinner from "../Components/Spinner"

function ResetPassword() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const { token } = useParams()
    const { showAlert } = useAlert()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            showAlert("Passwords do not match", "error")
            return
        }
        setLoading(true)
        try {
            const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            })
            const data = await response.json()
            if (response.ok) {
                showAlert("Password reset successful", "success")
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
                <h3 className="text-2xl font-bold text-center">Reset Password</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <div>
                            <label className="block" htmlFor="password">
                                New Password
                            </label>
                            <input
                                type="password"
                                placeholder="New Password"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block">Confirm New Password</label>
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword

