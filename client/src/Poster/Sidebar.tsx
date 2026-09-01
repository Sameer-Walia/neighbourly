import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import type { Rootstate } from "../store";
import { io } from "socket.io-client";

const socket = io("http://localhost:5555");

function Sidebar()
{

  const { id } = useSelector((state: Rootstate) => state.auth)
  const [chatUnreadCount, setChatUnreadCount] = useState(0);
  const [notifyuserCount, setnotifyuserCount] = useState(0);

  useEffect(() =>
  {
    if (!id) return;
    socket.emit("User_id", id);  // for making connection

    socket.on("chat_unread", () =>
    {
      setChatUnreadCount((prev) => prev + 1);
    });

    socket.on("notify_user", () =>
    {
      setnotifyuserCount((prev) => prev + 1);
    });

    return () =>
    {
      socket.off("chat_unread");
      socket.off("notify_user");
    };
  }, [id]);

  const menuItems = [
    { key: "myTasks", label: "📋 My Tasks", path: "/userdashboard" },
    { key: "notifications", label: "🔔 Notifications", path: "/usernotifications" },
    { key: "chat", label: "💬 Messaging", path: "/messageboxPoster" },
  ];

  const [active, setActive] = useState<string>("")

  useEffect(() =>
  {
    const data = sessionStorage.getItem("active")
    if (data)
    {
      setActive(JSON.parse(data))
    }
  }, [])

  function handleSetActive(key: string)
  {
    setActive(key);
    sessionStorage.setItem("active", JSON.stringify(key));
  };


  const navigate = useNavigate()

  function navi(way: string)
  {
    navigate(way)
  }

  function handleCount()
  {
    setChatUnreadCount(0);
  }

  function handleNotifyCount()
  {
    setnotifyuserCount(0);
  }

  return (

    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">User Dashboard</h2>
      </div>

      <nav>
        <ul className="menu-list">
          {menuItems.map((item) => (
            <motion.li
              key={item.key}
              whileHover={{ x: 6 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260 }}
              className="menu-item-wrapper"
            >
              <button
                onClick={() =>
                {
                  handleSetActive(item.key);
                  navi(item.path);
                }}
                className={`menu-btn ${active === item.key
                  ? "menu-btn-active"
                  : "menu-btn-inactive"
                  }`}
              >
                {
                  item.key === 'notifications' ?
                    <span className="menu-text" onClick={handleNotifyCount}>
                      {item.label}
                      {notifyuserCount > 0 && (
                        <span className="notification-badge">
                          {notifyuserCount}
                        </span>
                      )}
                    </span>
                    : item.key === 'chat' ?
                      <span className="menu-text" onClick={() => handleCount()}>
                        {item.label}
                        {chatUnreadCount > 0 && (
                          <span className="notification-badge">
                            {chatUnreadCount}
                          </span>
                        )}
                      </span> :
                      <span className="menu-text">
                        {item.label}
                      </span>
                }

              </button>
            </motion.li>
          ))}
        </ul>
      </nav>
    </aside>

  );
};

export default Sidebar;