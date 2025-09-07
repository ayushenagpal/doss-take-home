import axios from 'axios'
import { DetailWorkspace } from './components/WorkspaceDetails'
import { HomepageWorkspace } from './components/WorkspaceList'

const BASE_URL = 'http://localhost:8080'

/** The API for the app, for querying, creating and updating workspaces */
class DosspaceApi {
  /** Returns the ID and title of every existing workspace */
  static async getWorkspaces(): Promise<HomepageWorkspace[]> {
    try {
      const req = await axios.get(BASE_URL)
      const { workspaces } = req.data
      return workspaces
    } catch (err) {
      throw new Error('Unable to fetch workspaces')
    }
  }

  /** Returns the details about the given workspace ID */
  static async getWorkspace(workspaceId: string): Promise<DetailWorkspace> {
    try {
      const req = await axios.get(`${BASE_URL}/${workspaceId}`)
      const { workspace } = req.data
      return workspace
    } catch (err) {
      throw new Error('Unable to fetch workspace')
    }
  }

  /** Updates the details about the given workspace */
  static async updateWorkspace(workspace: DetailWorkspace): Promise<void> {
    try {
      await axios.post(`${BASE_URL}/${workspace.id}`, { workspace })
    } catch (err) {
      throw new Error('Unable to update workspace')
    }
  }

  /** Adds a new workspace */
  static async addWorkspace(): Promise<DetailWorkspace> {
    try {
      const req = await axios.post(BASE_URL)
      const { workspace } = req.data
      return workspace
    } catch (err) {
      throw new Error('Unable to create workspace')
    }
  }
}

export default DosspaceApi
