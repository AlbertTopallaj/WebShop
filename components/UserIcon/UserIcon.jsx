import "./UserIcon.css"
import {useState} from "react";
import {useNavigate} from "react-router";
import {UserExists} from "../../scripts/OrderData.js";
import {useToast} from "../Toast/Toast.jsx";

export default function UserIcon() {

    const [isUserOpen, setIsUserOpen] = useState(false);
    const [email, setEmail] = useState("");
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const {toast} = useToast()

    const navigate = useNavigate()

    async function checkAndGo() {
        const exists = await UserExists(email)

        if (exists) {
            navigate(`/user?email=${encodeURIComponent(email)}`)
            setEmail("")
            setIsUserOpen(false)
        } else {
            toast(`No orders with ${email} has been found`, 2000)
        }
    }

    return (
        <>
            <div className="user">
                <button className="user-button" onClick={() => setIsUserOpen(!isUserOpen)}>
                    👤
                </button>

                {isUserOpen && (
                    <div className="user-overlay" onClick={() => setIsUserOpen(false)}>
                        <div className="user-popup" onClick={(e) => e.stopPropagation()}>
                            <button className="user-close" onClick={() => setIsUserOpen(false)}>
                                ×
                            </button>

                            <h2>Enter your email</h2>

                            <div className="user-form">
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <button type="button" disabled={!isValidEmail} onClick={() => checkAndGo()}>
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}