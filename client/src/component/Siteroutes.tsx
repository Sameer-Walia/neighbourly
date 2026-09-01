import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import About from './About'
import Authpage from './Authpage'
import Thanks from './Thanks'
import ActivateAccount from './ActivateAccount'
import NoThanks from './NoThanks'
import ForgotPassword from './ForgotPassword'
import ResetPassword from './ResetPassword'
import ChangePassword from './ChangePassword'
import Post_Task from '../Poster/Post_Task'
import ViewDetails from '../Poster/ViewDetails'
import EditTask from '../Poster/EditTask'
import Profile from './Profile'
import Profile_update from './Profile_update'
import Get_task from '../Tasker/Get_task'
import TaskDetails from '../Tasker/TaskDetails'
import UserDashboard from '../Poster/UserDashboard'
import TaskerDashboard from '../Tasker/TaskerDashboard'
import EditApplication from '../Tasker/EditApplication'
import ViewallTaskers from '../Poster/ViewallTaskers'
import UserNotification from '../Poster/UserNotification'
import TaskerNotification from '../Tasker/TaskerNotification'
import WebsocketChat from './WebsocketChat'
import TaskerRoutesProtector from './TaskerRoutesProtector'
import PosterRoutesProtector from './PosterRoutesProtector'
import MessageBoxPoster from './MessageBoxPoster'
import MessageBoxTasker from './MessageBoxTasker'


function Siteroutes()
{
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/signup" element={<Authpage />} />
                <Route path="/thanks" element={<Thanks />} />
                <Route path="/nothanks" element={<NoThanks />} />
                <Route path="/activateaccount" element={<ActivateAccount />} />
                <Route path="/login" element={<Authpage />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/resetpassword" element={<ResetPassword />} />
                <Route path="/changepassword" element={<ChangePassword />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/updateprofile" element={<Profile_update />} />
                <Route path="/posttask" element={<PosterRoutesProtector compname={Post_Task} />} />
                <Route path="/userdashboard" element={<PosterRoutesProtector compname={UserDashboard} />} />
                <Route path="/viewdetail" element={<ViewDetails />} />
                <Route path="/edittask" element={<EditTask />} />
                <Route path="/gettask" element={<Get_task />} />
                <Route path="/taskdetails" element={<TaskDetails />} />
                <Route path="/taskerdashboard" element={<TaskerRoutesProtector compname={TaskerDashboard} />} />
                <Route path="/editapplication" element={<EditApplication />} />
                <Route path="/usernotifications" element={<UserNotification />} />
                <Route path="/taskernotifications" element={<TaskerNotification />} />
                <Route path="/viewalltaskers" element={<ViewallTaskers />} />
                <Route path="/chat" element={<WebsocketChat />} />
                <Route path="/messageboxPoster" element={<MessageBoxPoster />} />
                <Route path="/messageboxTasker" element={<MessageBoxTasker />} />
            </Routes>
        </div>
    )
}

export default Siteroutes
