import {generateCreateMock} from '../../registry-mock'
import {AutomergeStorage} from './automerge-storage-api'

const createAutomergeStorageMock = generateCreateMock(AutomergeStorage)
export {
  createAutomergeStorageMock,
}
