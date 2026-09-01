export { };
declare global
{
    interface Window
    {
        Razorpay: any;
    }
}

import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Sidebar from './Sidebar';
import type { Rootstate } from '../store';
import { useSelector } from 'react-redux';

interface TaskersApplied
{
    name: string
    offerprice: string
    message: string
    location: string
    taskeremail: string
    phone: string
    status: string
    _id: string
    taskerid: string
    taskid: { descp: string, _id: string }
}

function ViewallTaskers()
{

    const { id, email, name, phone, usertype } = useSelector((state: Rootstate) => state.auth)

    const [params] = useSearchParams()
    const taskid = params.get("taskid")

    const [taskers, settaskers] = useState<TaskersApplied[]>([])
    const [type, settype] = useState<string>("")
    const navi = useNavigate()

    useEffect(() =>
    {
        if (taskid)
        {
            fetchalltaskers()
        }
    }, [taskid])

    useEffect(() =>
    {
        document.title = "View All Taskers"
    }, [])

    useEffect(() =>
    {
        if (usertype)
        {
            if (usertype === "Post a Task")
            {
                settype("user")
            }
            else
            {
                settype("tasker")
            }
        }
    }, [usertype])


    async function fetchalltaskers()
    {
        try
        {
            const resp = await axios.get<{ statuscode: number; alltaskers?: TaskersApplied[] }>(`${import.meta.env.VITE_API_URL}/api/fetchalltaskers?taskid=` + taskid)

            if (resp.data.statuscode === 1 && resp.data.alltaskers)
            {
                settaskers(resp.data.alltaskers)
            }
            else if (resp.data.statuscode === 0)
            {
                settaskers([])
            }
            else
            {
                toast.error("some problem occured")
            }
        }
        catch (e: any)
        {
            toast.error(e.message)
        }
    }


    async function handleReject(id: string)
    {
        try 
        {
            const data = { id }
            const resp = await axios.put(`${import.meta.env.VITE_API_URL}/api/change_status_to_Reject`, data)

            if (resp.data.statuscode === 1)
            {
                fetchalltaskers()
                toast.error("Application Rejected")
            }
            else if (resp.data.statuscode === 0)
            {

            }
            else
            {
                toast.error("some problem occured")
            }
        }
        catch (e: any)
        {
            toast.error(e.message)
        }
    }

    async function handleaccept(uniqueid: string, taskerid: string)
    {
        const userid = id
        try
        {
            const data = { uniqueid, taskerid, userid, taskid }
            const resp = await axios.put(`${import.meta.env.VITE_API_URL}/api/change_status_to_Accepted`, data)

            if (resp.data.statuscode === 1)
            {
                fetchalltaskers()
                toast.success(resp.data.msg)
            }
            else if (resp.data.statuscode === 0)
            {
                toast.error(resp.data.msg)
            }
            else
            {
                toast.error("some problem occured")
            }
        }
        catch (e: any)
        {
            toast.error(e.message)
        }
    }


    function details(id: string)
    {
        navi("/viewdetail?id=" + id)
    }


    const handlePayment = async (item: TaskersApplied) =>
    {
        try
        {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/create_order`, {
                amount: Number(item.offerprice) * 100, // in paise
            });

            const options = {
                key: "rzp_test_Ryh9suGdlNeYvN",
                amount: Number(item.offerprice) * 100,
                currency: "INR",
                name: "AIR TASKER",
                description: "Payment for order",
                image: "https://your-logo-url.png",
                order_id: res.data.order.id,
                handler: function ()
                {
                    gettaskstatus(item._id)
                    posttaskstatus(item.taskid._id)
                    toast.success("Payment Success!");
                    toast.success("Task Assign Successfully");
                },
                prefill: {
                    name: (name),
                    email: (email),
                    contact: Number(phone),
                },
                theme: {
                    color: "#3399cc",
                },
            };

            // 👇 Add this line here
            console.log("Razorpay Options:", options);

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        }
        catch (e: any)
        {
            toast.error(e.message)
        }
    };

    async function gettaskstatus(uniqueid: string) 
    {
        try 
        {
            const resp = await axios.put<{ statuscode: number }>(`${import.meta.env.VITE_API_URL}/api/change_status_to_TaskAssign1?uniqueid=${uniqueid}`)

            if (resp.data.statuscode === 1)
            {
                fetchalltaskers()
            }
            else if (resp.data.statuscode === 0)
            {
                toast.warn("Task Status Not Updated")
            }
            else
            {
                toast.warn("Some Problem Occured")
            }
        }
        catch (e: any)
        {
            toast.error(e.message)
        }
    }

    async function posttaskstatus(uniqueid: string)
    {
        try
        {
            const resp = await axios.put<{ statuscode: number }>(`${import.meta.env.VITE_API_URL}/api/change_status_to_TaskAssign2?uniqueid=${uniqueid}`)

            if (resp.data.statuscode === 1)
            {

            }
            else if (resp.data.statuscode === 0)
            {

            }
            else
            {
                toast.warn("Some Problem Occured")
            }
        }
        catch (e: any)
        {
            toast.error(e.message)
        }
    }


    return (
        <>
            <Sidebar />

            <div id="applicants-page">
                {taskers.length > 0 ?
                    <div className="container">
                        <h1 className="page-title">Applicants</h1>

                        <div className="card-grid">
                            {taskers.map((item, index) => (
                                <div className="card" key={index}>
                                    <h2 className="name">{item.name}</h2>

                                    <div className="details">
                                        <p>💰 <b>Offer Price</b>: ₹{item.offerprice}</p>
                                        <p>💬 <b>Message</b>: {item.message}</p>
                                        <p>📍 <b>Area</b>: {item.location}</p>
                                        <p>📧 <b>Email</b>: {item.taskeremail}</p>
                                        <p>📞 <b>Phone</b>: {item.phone}</p>
                                        <p>📌 <b>Status</b>: {item.status}</p>
                                    </div>

                                    {item.status === "pending" && (
                                        <div className="btn-group">
                                            <button className="btn primary" onClick={() => handleaccept(item._id, item.taskerid)}>
                                                ✅ Accept
                                            </button>
                                            <button className="btn danger" onClick={() => handleReject(item._id)}>
                                                ❌ Reject
                                            </button>
                                        </div>
                                    )}

                                    {item.status === "Accepted" && (
                                        <div className="btn-group">
                                            <button className="btn primary" onClick={() => navi(`/chat?taskerid=${item.taskerid}&userid=${id}&role=${type}`)}>
                                                💬 Chat
                                            </button>
                                            <button className="btn danger" onClick={() => handlePayment(item)}>
                                                💰 Pay & Assign
                                            </button>
                                        </div>
                                    )}

                                    {item.status === "Task Assign" && (
                                        <div className="btn-group">
                                            <button className="btn primary" onClick={() => navi(`/chat?taskerid=${item.taskerid}&userid=${id}&role=${type}`)}>
                                                💬 Chat
                                            </button>
                                            <div className="status success">✅ Task Assigned</div>
                                        </div>
                                    )}

                                    {item.status === "Task Completed" && (
                                        <div className="btn-group">
                                            <button className="btn primary" onClick={() => navi(`/chat?taskerid=${item.taskerid}&userid=${id}`)}>
                                                💬 Chat
                                            </button>
                                            <div className="status success">✅ Task Completed</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    :
                    <div className="empty-box">
                        <h2>😔No Applicants Yet</h2>
                        <button className="btn primary" onClick={() => taskid && details(taskid)}>
                            View Task Details
                        </button>
                    </div>
                }
            </div>
        </>

    );

}

export default ViewallTaskers
