import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { Rootstate } from '../store';
import PosterSidebar from '../Poster/Sidebar';
import TaskerSidebar from '../Tasker/Sidebar';

interface Message
{
    text: string
    timestamp: string
}

interface Chat
{
    messages: Message[]
    taskerid: Taskerid
    userid: string
    text: string
    timestamp: string
}

interface Taskerid
{
    _id: string
    name: string
}

function MessageBoxPoster()
{

    const navigate = useNavigate()

    const [allchat, setallchat] = useState<Chat[]>([])
    const { id, name, usertype } = useSelector((state: Rootstate) => state.auth)

    useEffect(() =>
    {
        if (id) 
        {
            fetchChats();
        }
    }, [id]);

    async function fetchChats()
    {
        try
        {
            const resp = await axios.get(`${import.meta.env.VITE_API_URL}/api/chat/user_chat_with_all_tasker?userid=${id}`);
            if (resp.data.statuscode === 1)
            {
                setallchat(resp.data.alluserchat);
            } else if (resp.data.statuscode === 0)
            {
                toast.warn("No chats found.");
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

    };

    const [type, settype] = useState<string>("")
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

    return (
        <div id="message-page">

            {
                usertype === "Post a Task" ? <PosterSidebar /> : <TaskerSidebar />
            }

            <div className="content mt-4">
                <h1 className="page-title">
                    <span className="username">{name}</span>
                    <span className="dashboard-text">’s Dashboard</span>
                </h1>

                <div className="message-box">
                    <h2 className="message-heading">💬 Messages</h2>

                    <div className="chat-list">
                        {allchat?.map((chat, index) => (
                            <div
                                key={index}
                                className="chat-card"
                                onClick={() =>
                                    navigate(
                                        `/chat?taskerid=${chat.taskerid._id}&userid=${chat.userid}&role=${type}`
                                    )
                                }
                            >
                                <div className="chat-left">
                                    <p className="tasker-name">{chat.taskerid?.name}</p>

                                    {chat.messages?.length > 0 ? (
                                        <p className="last-message">
                                            {chat.messages[chat.messages.length - 1].text}
                                        </p>
                                    ) : (
                                        <p className="no-message">No messages yet</p>
                                    )}
                                </div>

                                <div className="chat-time">
                                    {chat.messages?.length > 0 &&
                                        new Date(
                                            chat.messages[chat.messages.length - 1]?.timestamp
                                        ).toLocaleTimeString("en-IN", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

    );
}

export default MessageBoxPoster
