import { useEffect, useState } from 'react'
import '../style/WorkspaceList.css'
import DosspaceApi from '../api'
import { useNavigate } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

export interface HomepageWorkspace {
  id: string
  title: string
}

/** Homepage list of all workspaces that have been created */
export default function WorkspaceList() {
  const [workspaces, setWorkspaces] = useState<HomepageWorkspace[]>([])
  const navigate = useNavigate()

  // Fetch all workspaces from the API
  useEffect(() => {
    async function fetchWorkspaces() {
      const workspaces = await DosspaceApi.getWorkspaces()
      setWorkspaces(workspaces)
    }

    fetchWorkspaces()
  }, [])

  const handleAddWorkspace = async () => {
    const newWorkspace = await DosspaceApi.addWorkspace()
    setWorkspaces([...workspaces, newWorkspace])
    navigate(`/${newWorkspace.id}`)
  }

  return (
    <div className="WorkspaceList">
      <h1 className="WorkspaceList__header">All workspaces</h1>
      {workspaces.map((workspace) => (
        <button
          key={workspace.id}
          onClick={() => navigate(`/${workspace.id}`)}
          style={{
            backgroundColor: '#008952',
            color: 'white',
            height: '50px',
            width: '150px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            marginBottom: '8px'
          }}
        >
          {workspace.title}
        </button>
      ))}

      <div onClick={handleAddWorkspace} className="WorkspaceList__createIcon">
        Add Workspace <FontAwesomeIcon icon={faPlus} />
      </div>
    </div>
  )
}
