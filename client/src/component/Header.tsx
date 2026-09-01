import { useState } from 'react'
import { FaBars, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import type { AppDispatch, Rootstate } from '../store';
import { LogOut } from '../ReduxSlice/authslice';
import axios from 'axios';

function Header()
{
    const { usertype } = useSelector((state: Rootstate) => state.auth)
    const dispatch = useDispatch<AppDispatch>()

    const [isOpen, setIsOpen] = useState(false);
    const navi = useNavigate()

    async function logout() 
    {
        sessionStorage.clear()
        dispatch(LogOut())
        await axios.post(`${import.meta.env.VITE_API_URL}/api/logout`, {}, { withCredentials: true })
        navi("/login")
    }

    function selectpage(e: React.MouseEvent<HTMLAnchorElement>)
    {
        e.preventDefault()
        const data = sessionStorage.getItem("userdata")
        if (!data) return
        const user = JSON.parse(data)
        if (user.usertype === "admin")
        {
            navi("/adminhome")
        }
        else
        {
            navi("/home")
        }
    }

    function handle()
    {
        sessionStorage.setItem("active", JSON.stringify("myTasks"))
    }

    return (
        <div id='sahil'>
            <nav className="navbar2">
                <div className="nav-container">
                    <Link to="" onClick={selectpage} className="nav-logo">
                        Neibhrly
                    </Link>

                    <div className="nav-links">
                        {
                            usertype === "Browse a Task" ?
                                <>
                                    <Link to="/gettask" className="nav-link">Browse Tasks</Link>
                                    {/* <Link to="/dashboard2" className="nav-link">Dashboard</Link> */}
                                    <Link to="/taskerdashboard" onClick={handle} className="nav-link">Dashboard</Link>
                                </> :
                                <>
                                    <Link to="/posttask" className="nav-link">Post a Task</Link>
                                    <Link to="/userdashboard" onClick={handle} className="nav-link">Dashboard</Link>
                                </>
                        }
                        <Link to="/profile" className="nav-link">Profile</Link>
                        <Link to="/about" className="nav-link">About Us</Link>
                        <Link to="/changepassword" className="nav-link">Change Password</Link>
                    </div>

                    <div className="nav-buttons">
                        <button onClick={logout} className="btn login">Log-Out</button>
                    </div>

                    <button className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {isOpen ?
                    <div className="mobile-menu">
                        <Link to="/" className="mobile-link" onClick={() => setIsOpen(false)}>Home</Link>
                        <Link to="/tasks" className="mobile-link" onClick={() => setIsOpen(false)}>Browse Tasks</Link>
                        <Link to="/post-task" className="mobile-link" onClick={() => setIsOpen(false)}>Post a Task</Link>
                        <Link to="/dashboard" className="mobile-link" onClick={() => setIsOpen(false)}>Dashboard</Link>
                        <Link to="/contact" className="mobile-link" onClick={() => setIsOpen(false)}>Messages</Link>
                        <Link to="/profile" className="mobile-link" onClick={() => setIsOpen(false)}>Profile</Link>

                        <div className="mobile-buttons">
                            <Link to="" className="btn mobile-login" onClick={() => setIsOpen(false)}>Log-Out</Link>
                        </div>
                    </div> : null
                }
            </nav>
        </div>
    )
}

export default Header
