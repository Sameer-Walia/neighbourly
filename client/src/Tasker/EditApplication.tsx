import axios from 'axios';
import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Footer from '../component/Footer';

interface Detail
{
    Applied_on: Date
    offerprice: number
    message: string
    taskid: TaskDetails
}

interface TaskDetails
{
    category: string
    descp: string
    currentdate: string
    budget: string
}

function EditApplication()
{
    const [params] = useSearchParams();
    const id = params.get('id');

    const [offerprice, setofferprice] = useState<number>(0);
    const [msg, setmsg] = useState<string>("");
    const [details, setdetails] = useState<Detail | null>(null);

    const navi = useNavigate()

    useEffect(() =>
    {
        if (id)
            fetchTaskDetails();
    }, [id]);

    useEffect(() =>
    {
        document.title = "Edit Application"
    }, [])

    async function fetchTaskDetails()
    {
        try
        {
            const res = await axios.get<{ statuscode: number, detail?: Detail }>(`${import.meta.env.VITE_API_URL}/api/fetchdetailstaskerassign?id=${id}`);
            if (res.data.statuscode === 1 && res.data.detail)
            {
                setdetails(res.data.detail)
                const detail: Detail = res.data.detail;
                setofferprice(detail.offerprice);
                setmsg(detail.message);
            }
            else if (res.data.statuscode === 0)
            {
                toast.error('Cannot edit your task');
            }
            else
            {
                toast.error("Some Problem Occurred");
            }
        }
        catch (e: any)
        {
            toast.error(e.message);
        }
    }

    async function updatedetails()
    {
        const currentDateUTC = new Date();
        const ISTOffset = 5.5 * 60 * 60 * 1000;
        const Indiantime = currentDateUTC.getTime() + ISTOffset

        const budget = Number(details?.taskid.budget)
        if (budget && offerprice < budget)
        {
            try 
            {
                const mydetail = { id, msg, offerprice, Indiantime }
                const res = await axios.put<{ statuscode: number }>(`${import.meta.env.VITE_API_URL}/api/updatemyDetails`, mydetail);
                if (res.data.statuscode === 1)
                {
                    navi("/taskerdashboard")
                    toast.success("Details Updated Successfully")
                }
                else if (res.data.statuscode === 0)
                {
                    toast.error('Cannot Updated your task');
                }
                else
                {
                    toast.error("Some Problem Occurred");
                }
            }
            catch (e: any)
            {
                toast.error(e.message);
            }
        }
        else
        {
            toast.warn("Offer Price Should Be Less Than Budget Price")
        }
    }


    return (
        <>
            <div id="edit-application">
                <h2 className="page-title">
                    <span className="title-icon">✏️</span>
                    Edit Application
                </h2>

                <div className="form-card">

                    <div className="task-description">
                        {details?.taskid.descp}
                    </div>

                    <div className="two-column">
                        <div className="field">
                            <label>📂 Category</label>
                            <input
                                value={details?.taskid.category}
                                disabled
                            />
                        </div>

                        <div className="field">
                            <label>📅 Task Posted</label>
                            <input
                                value={details?.taskid.currentdate}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label>₹ Task Budget</label>
                        <input
                            type="number"
                            value={details?.taskid.budget}
                            disabled
                        />
                    </div>

                    <div className="field">
                        <label>₹ Offer Price</label>
                        <input
                            type="tel"
                            value={offerprice}
                            onChange={(e) => setofferprice(Number(e.target.value))}
                        />
                    </div>

                    <div className="field">
                        <label>💬 Message</label>
                        <textarea
                            rows={4}
                            value={msg}
                            onChange={(e) => setmsg(e.target.value)}
                        />
                    </div>

                    <div className="field">
                        <label>📅 Applied On</label>
                        <input
                            value={
                                details?.Applied_on
                                    ? new Date(details.Applied_on).toISOString().split("T")[0]
                                    : ""
                            }
                            disabled
                        />
                    </div>

                    <div className="button-row">
                        <button className="btn primary" onClick={updatedetails}>
                            ✅ Update Application
                        </button>

                        <Link to="/taskerdashboard">
                            <button className="btn secondary">
                                × Cancel
                            </button>
                        </Link>
                    </div>

                </div>
            </div>
            <Footer />
        </>
    )
}

export default EditApplication
