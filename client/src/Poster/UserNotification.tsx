import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import type { Rootstate } from '../store';

interface NotificationItem
{
  _id: string;
  taskid: Taskid;
  timestamp: string;
  taskerid: Taskerid
}
interface Taskerid
{
  name: string
}
interface Taskid
{
  descp: string
  _id: string
}

function Notification()
{
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const navigate = useNavigate();

  const { email, id, name } = useSelector((state: Rootstate) => state.auth)


  useEffect(() =>
  {
    if (email)
    {
      fetchNotifications();
    }
  }, [email]);

  useEffect(() =>
  {
    document.title = "User Notification"
  }, [])

  const fetchNotifications = async () =>
  {
    try
    {
      const resp = await axios.get<{ statuscode: number, usernotify?: NotificationItem[] }>(`${import.meta.env.VITE_API_URL}/api/getusernotifications/${id}`);

      if (resp.data.statuscode === 1 && resp.data.usernotify) 
      {
        setNotifications(resp.data.usernotify);
      }
      else if (resp.data.statuscode === 0) 
      {
        setNotifications([]);
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
  };


  const handleViewTask = (taskid: string) =>
  {
    navigate(`/viewdetail?id=${taskid}`);
  };

  const handleDeleteNotification = async (id: string) =>
  {
    try
    {
      const resp = await axios.delete<{ statuscode: number; msg: string }>(`${import.meta.env.VITE_API_URL}/api/deletenotification/${id}`);

      if (resp.data.statuscode === 1) 
      {
        toast.success(resp.data.msg)
        fetchNotifications()
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
  };

  return (
    <>
      <Sidebar />
      <div id='NotificationDashboard'>
        <div className="dashboard-bg">
          <div className="dashboard-content">

            <h1 className="dashboard-title">
              <span className="dashboard-name">{name}</span>
              <span className="dashboard-subtitle">’s Dashboard</span>
            </h1>

            <h2 className="notification-heading">
              <span className="bell-icon">🔔</span>
              <u>Notifications</u>
            </h2>

            {notifications.length > 0 ?
              notifications.map((item) => (
                <div key={item._id} className="notification-card">

                  <button
                    onClick={() => handleDeleteNotification(item._id)}
                    className="delete-btn"
                    title="Delete Notification"
                  >
                    ❌
                  </button>

                  <div className="notification-row">
                    <div>
                      <p className="notification-text">
                        {item.taskerid.name} has applied for your task{" "}
                        <strong>"{item.taskid?.descp}"</strong>.
                      </p>

                      <p className="notification-time">
                        {item.timestamp.split('T')[0]} at {item.timestamp.split('T')[1].split('.')[0]}
                      </p>
                    </div>

                    <button
                      onClick={() => handleViewTask(item.taskid._id)}
                      className="view-task-btn"
                    >
                      👁️ View Task
                    </button>
                  </div>

                </div>
              ))
              :
              <p className="no-notifications">
                No notifications found.
              </p>
            }

          </div>
        </div>
      </div>
    </>

  );
}

export default Notification;
