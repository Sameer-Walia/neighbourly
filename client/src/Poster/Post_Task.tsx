import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { Rootstate } from '../store';
import Footer from '../component/Footer';

function Post_Task()
{

    const [step, setStep] = useState<number>(1);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [additionalFields, setAdditionalFields] = useState<string[]>([]);
    const [additionalValues, setAdditionalValues] = useState({});
    const [loading, setloading] = useState<boolean>(false);

    const [descp, setdescp] = useState<string>("");
    const [datetype, setdatetype] = useState<string>("");
    const [date, setdate] = useState<string>("");
    const [loc, setloc] = useState<string>("");
    const [budget, setbudget] = useState<string>("");

    const { email, id, name, phone } = useSelector((state: Rootstate) => state.auth)

    const navi = useNavigate()

    const categoryFields: Record<string, string[]> = {
        Plumbing: ['Pipe Type', 'Issue Type'],
        Delivery: ['Package Size', 'Vehicle Required'],
        'House Cleaning': ['Number of Rooms', 'Cleaning Type'],
        Blinkit: ['Product Name', 'Quantity']
    };

    useEffect(() =>
    {
        document.title = "Post Task "
    }, [])

    const handleAdditionalChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        setAdditionalValues({
            ...additionalValues,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() =>
    {
        if (datetype === 'on Date')
        {
            const today = new Date();
            const formatted = today.toISOString().split('T')[0];
            setdate(formatted);
        }
    }, [datetype]);

    async function posttask(e: React.FormEvent<HTMLFormElement>)
    {
        e.preventDefault();
        setloading(true)
        const userid = id;
        const todaydate = new Date();
        const currentdate = todaydate.toISOString().split('T')[0];
        const reqdata = { email, userid, name, selectedCategory, descp, datetype, date, currentdate, loc, budget, additionalValues: additionalValues, phone }
        try
        {
            const resp = await axios.post(`${import.meta.env.VITE_API_URL}/api/posttask`, reqdata, { withCredentials: true })
            if (resp.status === 200)
            {
                if (resp.data.statuscode === 1)
                {
                    toast.success(resp.data.msg)
                    navi("/userdashboard")
                }
                else if (resp.data.statuscode === 0)
                {
                    toast.warn(resp.data.msg)
                }
            }
            else
            {
                alert("Some Problem Occured")
            }
        }
        catch (e: any)
        {
            toast.error(e.message)
        }
        finally
        {
            setloading(false)
        }
    }

    return (
        <>
            <div className="task-wrapper">
                <div className="task-card">
                    <h2 className="task-title">Post a New Task</h2>

                    <div className="step-indicator">
                        <span className={step === 1 ? "active-step" : ""}>1</span>
                        <span className={step === 2 ? "active-step" : ""}>2</span>
                    </div>

                    {step === 1 && (
                        <div className="form-group">
                            <label className="label">Select Category</label>

                            <select
                                className="input"
                                onChange={(e) =>
                                {
                                    const category = e.target.value;
                                    setSelectedCategory(category);
                                    setAdditionalFields(categoryFields[category]);
                                }}
                            >
                                <option value="">Choose a category</option>
                                {Object.keys(categoryFields).map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            {
                                selectedCategory && (
                                    <button
                                        className="btn primary-btn"
                                        onClick={() => setStep(2)}
                                    >
                                        Continue →
                                    </button>
                                )
                            }
                        </div>
                    )}

                    {step === 2 && (
                        <form className="form " onSubmit={posttask}>
                            <div className="grid">
                                <div>
                                    <label className="label">Task Description</label>
                                    <input type="text" className="input" required onChange={(e) => setdescp(e.target.value)} />
                                </div>

                                <div>
                                    <label className="label">Deadline Type</label>
                                    <select
                                        className="input"
                                        value={datetype}
                                        onChange={(e) => setdatetype(e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        <option value="on Date">On Date</option>
                                        <option value="before Date">Before Date</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="label">Deadline</label>
                                    <input type="date" className="input" required value={date} onChange={(e) => setdate(e.target.value)} />
                                </div>

                                <div>
                                    <label className="label">Location</label>
                                    <input type="text" className="input" required onChange={(e) => setloc(e.target.value)} />
                                </div>

                                <div>
                                    <label className="label">Budget (Rs)</label>
                                    <input type="number" className="input" required onChange={(e) => setbudget(e.target.value)} />
                                </div>

                                {additionalFields.map((item, index) => (
                                    <div key={index}>
                                        <label className="label">{item}</label>
                                        <input type="text" name={item} className="input" required onChange={handleAdditionalChange}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="btn-group">
                                <button type="button" className="btn secondary-btn" onClick={() => setStep(1)}>
                                    ← Back
                                </button>

                                {
                                    loading ?
                                        <div className="loader-container mt-2">
                                            <img src="assets/images/loader.gif" alt="loader" className="loader" />
                                        </div> :
                                        <button type="submit" className="btn success-btn">
                                            Post Task
                                        </button>
                                }


                            </div>
                        </form>
                    )}
                </div>
            </div>

            <Footer />
        </>

    );
}

export default Post_Task;
