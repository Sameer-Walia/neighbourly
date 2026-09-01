import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import type { Rootstate } from '../store';
import Footer from '../component/Footer';

interface Details
{
    descp: string
    email: string
    name: string
    category: string
    locations: string
    datetype: string
    date: string
    budget: number
    additionalValues: Record<string, string>
    userid: object
}

function TaskDetails()
{

    const { email, phone, name, id, address } = useSelector((state: Rootstate) => state.auth)

    const [params] = useSearchParams()
    const taskid = params.get("id")
    const navi = useNavigate()

    const [detail, setdetail] = useState<Details | null>(null);
    const [flag, setflag] = useState<boolean>(false);
    const [additionalValues, setAdditionalValues] = useState<Record<string, string>>({});

    const [offerprice, setofferprice] = useState<number>(0);
    const [message, setmessage] = useState<string>("");


    useEffect(() =>
    {
        if (taskid)
        {
            onetaskdetail()
        }
    }, [taskid])

    useEffect(() =>
    {
        document.title = "Task Details"
    }, [])


    async function onetaskdetail()
    {
        try 
        {
            const resp = await axios.get<{ statuscode: number, detail?: Details }>(`${import.meta.env.VITE_API_URL}/api/fetchonservice?id=` + taskid)

            if (resp.data.statuscode === 1 && resp.data.detail) 
            {
                setdetail(resp.data.detail)
                setAdditionalValues(resp.data.detail.additionalValues);
            }
            else if (resp.data.statuscode === 0)
            {
                toast.error("Cannot Fetch Your Task Details")
                setdetail(null)
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


    async function dotask(e: React.FormEvent<HTMLFormElement>)
    {
        e.preventDefault()

        if (!detail)
        {
            toast.error("Task details not loaded");
            return;
        }

        const offer = offerprice;
        const budget = Number(detail.budget);

        if (offer >= budget)
        {
            toast.warn("Offer Price should be less than the Task Budget.");
            return;
        }

        const taskeremail = email;
        const taskerid = id;
        const taskername = name;
        const taskerphone = phone;
        const location = address;

        //  for notification 
        const userid = detail.userid;
        const descp = detail.descp
        const username = detail.name

        const reqdata = { taskername, taskeremail, taskerid, taskerphone, location, offerprice, message, taskid, userid, descp, username }
        try
        {
            const resp = await axios.post(`${import.meta.env.VITE_API_URL}/api/dotask`, reqdata)

            if (resp.data.statuscode === 1)
            {
                toast.success(resp.data.msg)
                navi("/gettask")
            }
            else if (resp.data.statuscode === 0)
            {
                toast.warn(resp.data.msg)
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
            <form onSubmit={dotask} id="task-form">
                <div id="task-wrapper">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        id="task-heading"
                    >
                        <span>🔍</span> Task Details
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.75 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div id="task-card">
                            <dl id="task-details">
                                <div className="detail-row">
                                    <dt>📃 Description :</dt>
                                    <dd>{detail?.descp}</dd>
                                </div>

                                <div className="detail-row">
                                    <dt>📂 Category :</dt>
                                    <dd>{detail?.category}</dd>
                                </div>

                                <div className="detail-row">
                                    <dt>📍 Location :</dt>
                                    <dd>{detail?.locations}</dd>
                                </div>

                                <div className="detail-row">
                                    <dt>📅 Deadline :</dt>
                                    <dd>{detail?.datetype} {detail?.date}</dd>
                                </div>

                                <div className="detail-row">
                                    <dt>💰 Budget :</dt>
                                    <dd>₹{detail?.budget}</dd>
                                </div>
                            </dl>

                            <h4 id="additional-heading">📑 Additional Details</h4>

                            {Object.entries(additionalValues).map(([key, value]) => (
                                <div key={key} className="detail-row">
                                    <dt>{key} :</dt>
                                    <dd>{value}</dd>
                                </div>
                            ))}

                            {flag === false && (
                                <div id="action-buttons">
                                    <button type="button" id="apply-btn" onClick={() => setflag(true)}>
                                        ✏️ Apply For Task
                                    </button>

                                    <Link to="/gettask">
                                        <button type="button" id="back-btn">
                                            🔙 Back
                                        </button>
                                    </Link>
                                </div>
                            )}

                            {flag === true && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="input-group mt-4">
                                        <label>💰 Offer Price <span>*</span></label>
                                        <input
                                            type="number"
                                            required
                                            onChange={(e) => setofferprice(Number(e.target.value))}
                                            placeholder="Enter your offer price"
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label>💬 Message</label>
                                        <textarea
                                            rows={4}
                                            required
                                            onChange={(e) => setmessage(e.target.value)}
                                            placeholder="Add any message you'd like to send"
                                        />
                                    </div>

                                    <div id="form-buttons">
                                        <motion.button whileHover={{ scale: 1.05 }} id="submit-btn">
                                            🚀 Submit Application
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            type="button"
                                            id="cancel-btn"
                                            onClick={() => setflag(false)}
                                        >
                                            ❌ Cancel
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </form>
            <Footer />
        </>

    )
}

export default TaskDetails
