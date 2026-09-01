import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { Rootstate } from '../store'

interface AllTask
{
  descp: string
  category: string
  budget: string
  currentdate: string
  date: string
  locations: string
  status: string
  _id: string
}

function UserDashboard()
{

  const [alltask, setalltask] = useState<AllTask[] | []>([])
  const navi = useNavigate()
  const { isLoggedIn, email } = useSelector((state: Rootstate) => state.auth)


  useEffect(() =>
  {
    if (isLoggedIn)
    {
      fetchalltask()
    }
  }, [isLoggedIn])

  useEffect(() =>
  {
    document.title = "User Dashborad"
  }, [])

  useEffect(() =>
  {
    sessionStorage.setItem("active", JSON.stringify("myTasks"))
  }, [])

  async function fetchalltask()
  {
    const uemail = email;
    try
    {
      const resp = await axios.get<{ statuscode: number; alltasks?: AllTask[] }>(`${import.meta.env.VITE_API_URL}/api/fetchusertasks/${uemail} `, { withCredentials: true })
      if (resp.status === 200)
      {
        if (resp.data.statuscode === 1 && resp.data.alltasks)
        {
          setalltask(resp.data.alltasks)
        }
        else if (resp.data.statuscode === 0)
        {
          toast.error("Please Post a Task")
        }
      }
      else
      {
        toast.error("Some Problem Occured")
      }
    }
    catch (e: any)
    {
      toast.error(e.message)
    }

  }

  function viewDetails(id: string)
  {
    navi("/viewdetail?id=" + id)
  }

  function viewApplicants(id: string)
  {
    navi("/viewalltaskers?taskid=" + id)
  }


  return (
    <>
      <Sidebar />
      <div className="dashboard-layout">
        <main className="dashboard-content">
          <header className="dashboard-header">
            <h1>My Tasks</h1>
            <p>Track and manage tasks you have posted</p>
          </header>

          {alltask.length > 0 ? (
            <div className="task-grid">
              {alltask.map((item) => (
                <div key={item._id} className="task-card">
                  <div className="task-card-header">
                    <h3>{item.descp}</h3>
                    <span className={`status ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="task-details">
                    <p><strong>Category:</strong> {item.category}</p>
                    <p><strong>Budget:</strong> ₹{item.budget}</p>
                    <p><strong>Posted:</strong> {item.currentdate}</p>
                    <p><strong>Deadline:</strong> {item.date}</p>
                    <p><strong>Location:</strong> {item.locations}</p>
                  </div>

                  <div className="task-actions">
                    <button
                      className="btn outline"
                      onClick={() => viewDetails(item._id)}
                    >
                      View Details
                    </button>

                    <button
                      className="btn primary"
                      onClick={() => viewApplicants(item._id)}
                    >
                      View Applicants
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No Tasks Yet</h2>
              <p>Post a task and start receiving applications.</p>
            </div>
          )}
        </main>
      </div>
    </>
  );

}

export default UserDashboard
