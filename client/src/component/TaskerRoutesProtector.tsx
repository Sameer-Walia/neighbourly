import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface TaskerRouteProtectorProps
{
    compname: React.ComponentType;
}

function TaskerRoutesProtector({ compname: Component }: TaskerRouteProtectorProps)
{
    const navigate = useNavigate()

    useEffect(() =>
    {
        const data = sessionStorage.getItem("userdata")
        if (!data)
        {
            toast.error("Please login to access the page");
            navigate("/login");
        }
        else
        {
            const user = JSON.parse(data)
            if (user.usertype !== "Browse a Task")
            {
                toast.error("Please login to access the Tasker Page");
                navigate("/login");
            }
        }
    }, [])

    return (
        <div>
            <Component />
        </div>
    )
}

export default TaskerRoutesProtector
