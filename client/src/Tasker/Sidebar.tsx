import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { Rootstate } from "../store";
import { io } from "socket.io-client";

const socket = io("http://localhost:5555");

function Sidebar()
{
  const menuItems = [
    { key: "myTasks", label: "📋 My Tasks", path: "/taskerdashboard" },
    { key: "notifications", label: "🔔 Notifications", path: "/taskernotifications" },
    { key: "chat", label: "💬 Messaging", path: "/messageboxTasker" },
  ];

  const [notifytaskerCount, setnotifytaskerCount] = useState<number | 0>(0);
  const [chatUnreadCount, setChatUnreadCount] = useState<number | 0>(0);
  const [active, setActive] = useState("");

  const { id } = useSelector((state: Rootstate) => state.auth);
  const navigate = useNavigate();

  /* SOCKET: CHAT UNREAD */

  // useEffect(() =>
  // {
  //   if (!id) return;

  //   socket.on("chat_unread", (data) =>
  //   {
  //     if (data.receiver === id)
  //     {
  //       setChatUnreadCount((prev) => prev + 1);
  //     }
  //   });

  //   return () =>
  //   {
  //     socket.off("chat_unread");
  //   };
  // }, [id]);


  useEffect(() =>
  {
    if (!id) return;
    socket.emit("Tasker_id", id);  // for making connection

    socket.on("chat_unread", () =>
    {
      setChatUnreadCount((prev) => prev + 1);
    });

    socket.on("notify_tasker", () =>
    {
      setnotifytaskerCount((prev) => prev + 1);
    });

    return () =>
    {
      socket.off("chat_unread");
      socket.off("notify_tasker");
    };
  }, [id]);



  function handleClick(item: any)
  {
    setActive(item.key);
    sessionStorage.setItem("active", JSON.stringify(item.key));
    navigate(item.path);
  }

  function handleCount(item: any)
  {
    if (item.key === "chat")
    {
      setChatUnreadCount(0);
    }
  }

  function handleNotifyCount()
  {
    setnotifytaskerCount(0);
  }

  useEffect(() =>
  {
    const data = sessionStorage.getItem("active");
    if (data) setActive(JSON.parse(data));
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Tasker Dashboard</h2>
      </div>

      <nav>
        <ul className="menu-list">
          {menuItems.map((item) => (
            <motion.li
              key={item.key}
              whileHover={{ x: 6 }}
              whileTap={{ scale: 0.98 }}
              className="menu-item-wrapper"
            >
              <button
                onClick={() => handleClick(item)}
                className={`menu-btn ${active === item.key ? "menu-btn-active" : "menu-btn-inactive"}`}
              >
                <span className="menu-text">
                  {item.label}

                  {item.key === "notifications" && notifytaskerCount > 0 && (
                    <span className="notification-badge" onClick={handleNotifyCount}>
                      {notifytaskerCount}
                    </span>
                  )}

                  {item.key === "chat" && chatUnreadCount > 0 && (
                    <span className="notification-badge" onClick={() => handleCount(item)}>
                      {chatUnreadCount}
                    </span>
                  )}
                </span>
              </button>
            </motion.li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
