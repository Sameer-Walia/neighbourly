import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Footer from '../component/Footer'

interface TaskDetails
{
    descp: string
    budget: string
    category: string
    date: string
    _id: string
}

function Get_task()
{

    const [task, settask] = useState<TaskDetails[]>([])
    const navi = useNavigate()

    useEffect(() =>
    {
        fetchalltasks()
    }, [])

    useEffect(() =>
    {
        document.title = "Get Task"
    }, [])

    async function fetchalltasks()
    {
        try
        {
            const resp = await axios.get<{ statuscode: number, tasks?: TaskDetails[] }>(`${import.meta.env.VITE_API_URL}/api/fetchalltasks`)
            if (resp.data.statuscode === 1 && resp.data.tasks)
            {
                settask(resp.data.tasks)
            }
            else if (resp.data.statuscode === 0)
            {
                settask([])
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

    function taskdetails(id: string)
    {
        navi("/taskdetails?id=" + id)
    }

    return (
        <>
            <div className="tasks-wrapper">
                {
                    task.length > 0 ?
                        <>
                            <h1 className="tasks-heading">📋 Available Tasks</h1>

                            <div className="tasks-grid">
                                {
                                    task.map((item, index) => (
                                        <div key={index} className="task-card">
                                            <h2 className="task-title">{item.descp}</h2>

                                            <p className="task-text">💰 <span>Budget:</span> ₹{item.budget}</p>
                                            <p className="task-text">📂 <span>Category:</span> {item.category}</p>
                                            <p className="task-text">📅 <span>Deadline:</span> {item.date}</p>

                                            <div className="task-actions">
                                                <button
                                                    onClick={() => taskdetails(item._id)}
                                                    className="btn-view"
                                                >
                                                    👁️ View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </>
                        :
                        <p className="no-tasks-text">
                            No tasks to display yet.
                        </p>
                }
            </div>
            <Footer />
        </>

    )
}

export default Get_task
