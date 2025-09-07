import WorkspaceList from './WorkspaceList'
import '../style/Workspaces.css'
import { Routes, Route } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import ReadMe from './ReadMe'
import WorkspaceDetails from './WorkspaceDetails'

function Workspaces() {
  const navigate = useNavigate()

  return (
    <>
      <div className="Workspaces__header" onClick={() => navigate('/')}>
        Dosspace
      </div>
      <div className="Workspaces__content">
        <Routes>
          <Route path="/readme" element={<ReadMe />} />
          <Route path="/" element={<WorkspaceList />} />
          <Route path="/:workspaceId" element={<WorkspaceDetails />} />
        </Routes>
      </div>
    </>
  )
}

export default Workspaces
