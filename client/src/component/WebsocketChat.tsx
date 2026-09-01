import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import { io } from "socket.io-client";

const socket = io(`http://localhost:5555`);

interface Message
{
    sender: string;
    text: string;
    timestamp: string;
}

function WebsocketChat()
{
    useEffect(() =>
    {
        document.title = "Chat Page"
    }, [])

    const [params] = useSearchParams();
    const userid = params.get("userid");
    const taskerid = params.get("taskerid");
    const role = params.get("role");
    const [showEmoji, setShowEmoji] = useState(false);

    const currentUserId = role === "user" ? userid : taskerid;

    const roomId = `${userid}_${taskerid}`;

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");

    const [typingUsers, setTypingUsers] = useState<string[]>([]);

    useEffect(() =>
    {
        socket.emit("join_room", roomId);
        socket.on("receive_message", (msg) =>
        {
            setMessages((prev) => [...prev, msg])
            showNotification(msg.text)
        });

        socket.on("typing", ({ sender }) =>
        {
            if (sender !== currentUserId)
            {
                setTypingUsers([sender]); // simple: only show one typing user
                setTimeout(() => setTypingUsers([]), 1500); // hide after 1.5s
            }
        });
        return () =>
        {
            socket.off("receive_message")
            socket.off("typing")
        };
    }, [roomId]);

    useEffect(() =>
    {
        const loadHistory = async () =>
        {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/chat/history?userid=${userid}&taskerid=${taskerid}`
            );
            setMessages(res.data);
        };
        loadHistory();
    }, [userid, taskerid]);

    const sendMessage = async () =>
    {
        if (!input.trim()) return;

        await axios.post(`${import.meta.env.VITE_API_URL}/api/chat/send`, {
            sender: currentUserId,
            receiver: currentUserId === userid ? taskerid : userid,
            text: input,
        });

        setInput("");
        setShowEmoji(false);

    };

    const chatEndRef = React.useRef<HTMLDivElement>(null);

    useEffect(() =>
    {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () =>
    {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };


    // 🔔 Browser Notification
    const showNotification = (message: string) =>
    {
        if (document.hidden)  // Only shows notifications if the tab is not visible.
        {
            new Notification("New Message", { body: message });
        }
    };

    // ASK PERMISSION FOR NOTIFICATIONS
    useEffect(() =>
    {
        if (Notification.permission !== "granted")
        {
            Notification.requestPermission();
        }
    }, []);


    return (
        <>
            <h2 className="form-heading">📝 Chat Box</h2>

            <div className="chat-container">

                <div className="chat-box">

                    {messages.map((msg, i) =>
                    {
                        const isMine = msg.sender === currentUserId;
                        return (
                            <div key={i} className={`message ${isMine ? "right" : "left"}`}>
                                {msg.text}
                            </div>
                        );
                    })}

                    <div className="typing-indicator">
                        {typingUsers.length > 0 && <span>Typing...</span>}
                    </div>

                    <div ref={chatEndRef}></div>

                </div>

                {showEmoji && (
                    <EmojiPicker onEmojiClick={(e) => setInput(input + e.emoji)} />
                )}

                <div className="chat-input">
                    <input
                        value={input}
                        onChange={(e) =>
                        {
                            setInput(e.target.value);
                            socket.emit("typing", { roomId, sender: currentUserId });
                        }}
                        placeholder="Type message…"
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />


                    <button onClick={() => setShowEmoji(!showEmoji)}>😊</button>

                    <button onClick={sendMessage}>Send</button>
                </div>

            </div>
        </>
    );
}

export default WebsocketChat;
