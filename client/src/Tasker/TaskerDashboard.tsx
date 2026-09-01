import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../Tasker/Sidebar'
import { useSelector } from 'react-redux';
import type { Rootstate } from '../store';
import Modal from "react-modal";


interface AppliedTask
{
  name: string;
  offerprice: string;
  status: string;
  message: string;
  _id: string;
  taskid: Taskdetail
}

interface Taskdetail
{
  category: string
  date: string
  budget: string
  locations: string
  descp: string
  phone: string
  _id: string
  userid: string
}


function TaskerDashboard()
{

  const { email, usertype, id } = useSelector((state: Rootstate) => state.auth)

  const [appliedtask, setappliedtask] = useState<AppliedTask[]>([]);
  const [loading, setloading] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [currentPhone, setCurrentPhone] = useState<string>("");
  const [uniqueid, setuniqueid] = useState<string>("");
  const [type, settype] = useState<string>("")

  const [taskid, settaskid] = useState<string>("")


  const navi = useNavigate();

  useEffect(() =>
  {
    document.title = "Tasker Dashborad"
  }, [])

  useEffect(() =>
  {
    if (email)
    {
      iappliedtask();
    }
  }, [email]);

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

  async function iappliedtask()
  {
    const taskeremail = email;
    try
    {
      const resp = await axios.get<{ statuscode: number, appliedtasks?: AppliedTask[], msg?: string }>(`${import.meta.env.VITE_API_URL}/api/appliedtasks/${taskeremail}`, { withCredentials: true });

      if (resp.data.statuscode === 1 && resp.data.appliedtasks)
      {
        setappliedtask(resp.data.appliedtasks);
      }
      else if (resp.data.statuscode === 0)
      {
        setappliedtask([]);
      }
      else if (resp.data.statuscode === 5)
      {
        toast.error(resp.data.msg);
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

  function updateoffer(id: string)
  {
    navi("/editapplication?id=" + id)
  }

  async function deletetask(id: string)
  {
    try
    {
      const pass = window.confirm("Are you sure to Delete")
      if (pass === true)
      {
        setloading(true)
        const resp = await axios.delete<{ statuscode: number, msg?: string }>(`${import.meta.env.VITE_API_URL}/api/del_tasker_task?id=${id}`)

        if (resp.data.statuscode === 1)
        {
          toast.success(resp.data.msg)
          iappliedtask();
        }
        else if (resp.data.statuscode === 0)
        {
          toast.warn(resp.data.msg)
        }
        else
        {
          toast.error("some problem occured")
        }
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


  async function sendOTP(item: AppliedTask)
  {
    setCurrentPhone(item.taskid.phone);
    setuniqueid(item._id);
    settaskid(item.taskid._id);
    try
    {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/send_otp`, { phone: item.taskid.phone });

      if (response.data.statuscode === 1)
      {
        setIsModalOpen(true);
        toast.success("OTP sent to user");
      }
      else if (response.data.statuscode === 0)
      {
        toast.error("Failed to send OTP");
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

  const verifyOTP = async (number: string, id: string, taskid: string) =>
  {
    try
    {
      const res = await axios.post<{ statuscode: number }>(`${import.meta.env.VITE_API_URL}/api/verify_otp`, { phone: number, otp });

      if (res.data.statuscode === 1)
      {
        toast.success("Task completed!");
        setOtp("");
        setIsModalOpen(false);
        updatetaskerdashboard(id)
        posttaskstatus(taskid)
      }
      else
      {
        toast.error("Invalid OTP");
      }
    }
    catch (e: any)
    {
      toast.error(e.message)
    }
  };

  async function updatetaskerdashboard(id: string)
  {
    try
    {
      const resp = await axios.put<{ statuscode: number }>(`${import.meta.env.VITE_API_URL}/api/change_status_to_Task_Completed1?uniqueid=${id}`)

      if (resp.data.statuscode === 1)
      {
        iappliedtask()
      }
      else if (resp.data.statuscode === 0)
      {
        toast.error("Cannot Update Task Completed")
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

  async function posttaskstatus(taskid: string)
  {
    try
    {
      const resp = await axios.put<{ statuscode: number }>(`${import.meta.env.VITE_API_URL}/api/change_status_to_Task_Completed2?uniqueid=${taskid}`)
      if (resp.data.statuscode === 1)
      {

      }
      else if (resp.data.statuscode === 0)
      {
        toast.error("Cannot Update Task Completed")
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




  return (
    <>
      <Sidebar />

      <div id="taskerdashboard">
        <div className="dashboard-content">

          {appliedtask.length > 0 ?
            <>
              <h1 className="dashboard-title">
                📋 {appliedtask[0].name} Dashboard
              </h1>

              <div className="task-grid">
                {appliedtask.map((item, index) => (
                  <div key={index} className="task-card">

                    <h2 className="section-title">Task Details</h2>
                    <p>📂 Category: {item.taskid?.category}</p>
                    <p>📅 Deadline: {item.taskid?.date}</p>
                    <p>💰 Budget: ₹{item.taskid?.budget}</p>
                    <p>📍 Location: {item.taskid?.locations}</p>
                    <p>📝 Description: {item.taskid?.descp}</p>

                    <h2 className="section-title">Your Application</h2>
                    <p>💰 Price Offered: ₹{item.offerprice}</p>
                    <p>📨 Message: {item.message}</p>
                    <p>
                      📌 Status:
                      <span className={`status ${item.status.replace(/\s/g, "")}`}>
                        {item.status}
                      </span>
                    </p>

                    {item.status === "pending" && (
                      <div className="button-group">
                        <button className="btn edit" onClick={() => updateoffer(item._id)}>
                          ✅ Edit
                        </button>
                        {
                          loading ?
                            <div className="loader-container mt-2">
                              <img src="assets/images/loader.gif" alt="loader" className="loader" />
                            </div> :
                            <button className="btn delete" onClick={() => deletetask(item._id)}>
                              ❌ Delete
                            </button>
                        }

                      </div>
                    )}

                    {item.status === "Rejected" && (
                      <div className="button-group">
                        <button className="btn delete" onClick={() => deletetask(item._id)}>
                          🗑️ Delete
                        </button>
                      </div>
                    )}

                    {item.status === "Accepted" && (
                      <div className="button-group">
                        <button className="btn chat" onClick={() => navi(`/chat?userid=${item.taskid.userid}&taskerid=${id}&role=${type}`)}>💬 Chat</button>
                        <button className="btn delete" onClick={() => deletetask(item._id)}>
                          ❌ Delete
                        </button>
                      </div>
                    )}

                    {item.status === "Task Assign" && (
                      <div className="button-group">
                        <button className="btn chat">💬 Chat</button>
                        <button className="btn complete" onClick={() => sendOTP(item)} >
                          ✅ Mark as Complete
                        </button>
                      </div>
                    )}

                    {item.status === "Task Completed" && (
                      <div className="task-complete">
                        ✅ Task Completed
                      </div>
                    )}

                  </div>
                ))}
              </div>
            </>
            :
            <p className="no-task">No Task Applied.</p>
          }

        </div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          className="otp-modal"
          overlayClassName="otp-overlay"
        >
          <h2 className="otp-title">Enter OTP</h2>

          <input
            type="text"
            className="otp-input"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
          />

          <div className="otp-actions">
            <button
              className="otp-btn cancel"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>

            <button
              className="otp-btn verify"
              onClick={() => verifyOTP(currentPhone, uniqueid, taskid)}
            >
              Verify
            </button>
          </div>
        </Modal>

      </div>
    </>


  );
}

export default TaskerDashboard;

