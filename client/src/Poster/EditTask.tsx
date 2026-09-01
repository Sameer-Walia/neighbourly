import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Footer from '../component/Footer';

interface Details
{
    category: string
    descp: string
    datetype: string
    date: string
    budget: string
    locations: string
    currentdate: string
    additionalValues: Record<string, string>;
}

function EditTask()
{
    const [params] = useSearchParams();
    const id = params.get('id');
    const navi = useNavigate();
    const [loading, setloading] = useState<boolean>(false);

    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [descp, setdescp] = useState<string>("");
    const [datetype, setdatetype] = useState<string>("");
    const [date, setdate] = useState<string>("");
    const [loc, setloc] = useState<string>("");
    const [cdate, setcdate] = useState<string>("");
    const [budget, setbudget] = useState<string>("");
    const [additionalValues, setAdditionalValues] = useState<Record<string, string>>({});


    useEffect(() =>
    {
        if (id)
        {
            fetchTaskDetails();
        }
    }, [id]);

    useEffect(() =>
    {
        document.title = "Edit Task"
    }, [])

    async function fetchTaskDetails()
    {
        setloading(true)
        try
        {
            const res = await axios<{ statuscode: number, detail?: Details }>(`${import.meta.env.VITE_API_URL}/api/fetchonservice?id=${id}`);
            if (res.data.statuscode === 1 && res.data.detail)
            {
                const detail: Details = res.data.detail;
                setSelectedCategory(detail.category);
                setdescp(detail.descp);
                setdatetype(detail.datetype);
                setdate(detail.date);
                setloc(detail.locations);
                setcdate(detail.currentdate);
                setbudget(detail.budget);
                setAdditionalValues(detail.additionalValues);
            }
            else
            {
                toast.error('Cannot edit your task');
            }
        }
        catch (e: any)
        {
            toast.error(e.message);
        }
        finally
        {
            setloading(false)
        }
    }

    async function updatetask(e: React.FormEvent<HTMLFormElement>)
    {

        setloading(true)
        const todaydate = new Date();
        const cdate = todaydate.toISOString().split('T')[0];
        e.preventDefault();
        try
        {
            const payload = { descp, budget, datetype, date, loc, cdate, additionalValues: additionalValues, id };

            const res = await axios.put<{ statuscode: number }>(`${import.meta.env.VITE_API_URL}/api/updatetask`, payload);
            if (res.data.statuscode === 1)
            {
                toast.success('Task Updated Successfully');
                navi('/userdashboard');
            }
            else
            {
                toast.error('Task not updated. Make some changes and try again.');
            }
        }
        catch (e: any)
        {
            toast.error(e.message);
        }
        finally
        {
            setloading(false)
        }
    }

    useEffect(() =>
    {
        if (datetype === 'on Date')
        {
            const today = new Date();
            const formatted = today.toISOString().split('T')[0];
            setdate(formatted);
        }
    }, [datetype]);

    return (
        <div id="update">
            <form onSubmit={updatetask} className="edit-form mt-5">
                <div className="edit-card">
                    <h2 className="edit-title">✏️ Edit Task</h2>

                    <div className="form-body">
                        <div className="form-group">
                            <label className="form-label">📝 Task Description</label>
                            <input type="text" className="form-input" required value={descp} onChange={(e) => setdescp(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">📂 Category</label>
                            <input type="text" className="form-input disabled" disabled value={selectedCategory} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">💰 Budget (Rs)</label>
                            <input type="number" className="form-input" required onChange={(e) => setbudget(e.target.value)} value={budget} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">📅 Deadline Type</label>
                            <select
                                className="form-input"
                                onChange={(e) => setdatetype(e.target.value)}
                                value={datetype}
                            >
                                <option value="on Date">On Date</option>
                                <option value="before Date">Before Date</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">📆 Deadline</label>
                            <input type="date" className="form-input" required onChange={(e) => setdate(e.target.value)} value={date} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">📍 Location</label>
                            <input type="text" className="form-input" required onChange={(e) => setloc(e.target.value)} value={loc} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">🕒 Posted On</label>
                            <input type="text" className="form-input disabled" disabled value={cdate} />
                        </div>

                        {Object.entries(additionalValues).map(([key, value]) => (
                            <div key={key} className="form-group">
                                <label className="form-label">{key}</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={value}
                                    onChange={(e) =>
                                        setAdditionalValues((prev) => ({
                                            ...prev,
                                            [key]: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                        ))}

                        {
                            loading ?
                                <div className="loader-container mt-2">
                                    <img src="assets/images/loader.gif" alt="loader" className="loader" />
                                </div> :
                                <button type="submit" className="btn primary-btn">
                                    ✅ Update Task
                                </button>
                        }

                        <Link to={`/viewdetail?id=${id}`}>
                            <button type="button" className="btn cancel-btn">
                                ❌ Cancel
                            </button>
                        </Link>
                    </div>
                </div>
            </form>
            <Footer />
        </div>

    );
}

export default EditTask;
