import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Footer from '../component/Footer'

interface Details
{
  descp: string
  category: string
  budget: string
  date: string
  locations: string
  currentdate: string
  status: string
  Assigned_to: string
  additionalValues: object
  _id: string
}

function ViewDetails()
{

  const [params] = useSearchParams()
  const id = params.get("id")
  const [detail, setdetail] = useState<Details | null>(null)
  const navi = useNavigate()

  useEffect(() =>
  {
    if (id)
    {
      fetchonedetail()
    }
  }, [id])

  useEffect(() =>
  {
    document.title = "View Details"
  }, [])

  async function fetchonedetail()
  {
    try
    {
      const resp = await axios.get<{ statuscode: number; detail?: Details }>(`${import.meta.env.VITE_API_URL}/api/fetchonservice?id=` + id)
      if (resp.status === 200)
      {
        if (resp.data.statuscode === 1 && resp.data.detail)
        {
          setdetail(resp.data.detail)
        }
        else if (resp.data.statuscode === 0)
        {
          toast.error("Cannot Fetch Your Task")
        }
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

  async function deltask(id: string)
  {
    try
    {
      const pass = window.confirm("Are you sure to Delete the Task")
      if (pass === true)
      {
        const resp = await axios.delete(`${import.meta.env.VITE_API_URL}/api/deltask?id=${id}`)
        if (resp.status === 200)
        {
          if (resp.data.statuscode === 1)
          {
            toast.success(resp.data.msg)
            navi("/dashboard")
          }
          else if (resp.data.statuscode === 0)
          {
            toast.warn(resp.data.msg)
          }
        }
        else
        {
          alert("some problem occured")
        }
      }
    }
    catch (e: any)
    {
      toast.error(e.message)
    }
  }
  function edittask(id: string)
  {
    navi(`/edittask?id=${id}`)
  }


  return (
    <div>
      <div className="view-container">
        <div className="view-wrapper">
          <h1 className="page-heading">
            <span>🔍</span> Task Details
          </h1>

          {detail && (
            <div className="details-card">
              <h1 className="task-heading">{detail.descp}</h1>

              <dl className="details-grid">
                <div className="detail-row">
                  <dt>📂 Category:</dt>
                  <dd className='mb-0'>{detail.category}</dd>
                </div>

                <div className="detail-row">
                  <dt>💰 Budget:</dt>
                  <dd className='mb-0'>₹{detail.budget}</dd>
                </div>

                <div className="detail-row">
                  <dt>📅 Deadline:</dt>
                  <dd className='mb-0'>{detail.date}</dd>
                </div>

                <div className="detail-row">
                  <dt>📍 Location:</dt>
                  <dd className='mb-0'>{detail.locations}</dd>
                </div>

                <div className="detail-row">
                  <dt>📅 Posted:</dt>
                  <dd className='mb-0'>{detail.currentdate}</dd>
                </div>

                <div className="detail-row">
                  <dt>📌 Status:</dt>
                  <dd className='mb-0'>{detail.status}</dd>
                </div>

                <div className="detail-row">
                  <dt>📌 Assigned:</dt>
                  <dd className='mb-0'>{detail.Assigned_to}</dd>
                </div>
              </dl>

              {detail.additionalValues && (
                <div className="additional-section">
                  <h2 className="additional-title">📝 Additional Details</h2>

                  <dl className="details-grid">
                    {Object.entries(detail.additionalValues).map(([key, value]) => (
                      <div key={key} className="detail-row">
                        <dd>{key}</dd>:
                        <dt>{value}</dt>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Action Buttons */}
              <div className="action-buttons">
                <button
                  className="btn btn-edit"
                  onClick={() => edittask(detail._id)}
                >
                  ✏️ Edit
                </button>

                <button
                  className="btn btn-delete"
                  onClick={() => deltask(detail._id)}
                >
                  🗑️ Delete
                </button>

                <Link to="/userdashboard">
                  <button className="btn btn-back">
                    🔙 Back
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div><br />
      <Footer />
    </div>

  )
}

export default ViewDetails
