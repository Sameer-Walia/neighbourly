import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import type { Rootstate } from '../store';

interface NotificationItem
{
  _id: string;
  taskid: Taskid;
  timestamp: string;
  userid: Userid
}
interface Userid
{
  name: string
}
interface Taskid
{
  descp: string
  _id: string
}

function TaskerNotification()
{
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { email, id, name } = useSelector((state: Rootstate) => state.auth)

  useEffect(() =>
  {
    document.title = "Tasker Notification"
  }, [])

  useEffect(() =>
  {
    if (email)
    {
      fetchNotifications();
    }
  }, [email]);

  const fetchNotifications = async () =>
  {
    try
    {
      const resp = await axios.get<{ statuscode: number, taskernotify?: NotificationItem[] }>(`${import.meta.env.VITE_API_URL}/api/gettaskernotifications/${id}`);

      if (resp.data.statuscode === 1 && resp.data.taskernotify) 
      {
        setNotifications(resp.data.taskernotify);
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

  const handleDeleteNotification = async (id: string) =>
  {
    try
    {
      const pass = window.confirm("Are you sure to Delete")
      if (!pass) return;
      const resp = await axios.delete<{ statuscode: number; msg: string }>(`${import.meta.env.VITE_API_URL}/api/deletenotification_from_tasker/${id}`);

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
                        {item.userid.name} has accepted your application for the <strong>"{item.taskid?.descp}"</strong> task.
                      </p>

                      <p className="notification-time">
                        {item.timestamp.split('T')[0]} at {item.timestamp.split('T')[1].split('.')[0]}
                      </p>
                    </div>

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

export default TaskerNotification;
