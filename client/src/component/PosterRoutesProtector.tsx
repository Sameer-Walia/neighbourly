import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface PosterRouteProtectorProps
{
    compname: React.ComponentType;
}

function PosterRoutesProtector({ compname: Component }: PosterRouteProtectorProps)
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
            if (user.usertype !== "Post a Task")
            {
                toast.error("Please login to access the Poster Page");
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

export default PosterRoutesProtector
