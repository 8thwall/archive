// @sublibrary(:dom-core-lib)
import type {DOMString} from './strings'

// See https://webidl.spec.whatwg.org/#idl-DOMException
class DOMException extends Error {
  static readonly INDEX_SIZE_ERR = 1

  static readonly DOMSTRING_SIZE_ERR = 2

  static readonly HIERARCHY_REQUEST_ERR = 3

  static readonly WRONG_DOCUMENT_ERR = 4

  static readonly INVALID_CHARACTER_ERR = 5

  static readonly NO_DATA_ALLOWED_ERR = 6

  static readonly NO_MODIFICATION_ALLOWED_ERR = 7

  static readonly NOT_FOUND_ERR = 8

  static readonly NOT_SUPPORTED_ERR = 9

  static readonly INUSE_ATTRIBUTE_ERR = 10

  static readonly INVALID_STATE_ERR = 11

  static readonly SYNTAX_ERR = 12

  static readonly INVALID_MODIFICATION_ERR = 13

  static readonly NAMESPACE_ERR = 14

  static readonly INVALID_ACCESS_ERR = 15

  static readonly VALIDATION_ERR = 16

  static readonly TYPE_MISMATCH_ERR = 17

  static readonly SECURITY_ERR = 18

  static readonly NETWORK_ERR = 19

  static readonly ABORT_ERR = 20

  static readonly URL_MISMATCH_ERR = 21

  static readonly QUOTA_EXCEEDED_ERR = 22

  static readonly TIMEOUT_ERR = 23

  static readonly INVALID_NODE_TYPE_ERR = 24

  static readonly DATA_CLONE_ERR = 25

  private readonly _name: DOMString

  private readonly _message: DOMString

  // The new DOMException(message, name) constructor steps are:
  constructor(message: DOMString = '', name: DOMString = 'Error') {
    super(message)
    // Set this's name to name.
    this._name = name
    // Set this's message to message.
    this._message = message
  }

  // The name getter steps are to return this's name.
  get name(): DOMString { return this._name }

  // The message getter steps are to return this's message.
  get message(): DOMString { return this._message }

  // The code getter steps are to return the legacy code indicated in the DOMException names table
  // for this's name, or 0 if no such entry exists in the table.
  get code(): number {
    switch (this._name) {
      case 'IndexSizeError': return DOMException.INDEX_SIZE_ERR
      case 'HierarchyRequestError': return DOMException.HIERARCHY_REQUEST_ERR
      case 'WrongDocumentError': return DOMException.WRONG_DOCUMENT_ERR
      case 'InvalidCharacterError': return DOMException.INVALID_CHARACTER_ERR
      case 'NoModificationAllowedError': return DOMException.NO_MODIFICATION_ALLOWED_ERR
      case 'NotFoundError': return DOMException.NOT_FOUND_ERR
      case 'NotSupportedError': return DOMException.NOT_SUPPORTED_ERR
      case 'InUseAttributeError': return DOMException.INUSE_ATTRIBUTE_ERR
      case 'InvalidStateError': return DOMException.INVALID_STATE_ERR
      case 'SyntaxError': return DOMException.SYNTAX_ERR
      case 'InvalidModificationError': return DOMException.INVALID_MODIFICATION_ERR
      case 'NamespaceError': return DOMException.NAMESPACE_ERR
      case 'InvalidAccessError': return DOMException.INVALID_ACCESS_ERR
      case 'TypeMismatchError': return DOMException.TYPE_MISMATCH_ERR
      case 'SecurityError': return DOMException.SECURITY_ERR
      case 'NetworkError': return DOMException.NETWORK_ERR
      case 'AbortError': return DOMException.ABORT_ERR
      case 'URLMismatchError': return DOMException.URL_MISMATCH_ERR
      case 'QuotaExceededError': return DOMException.QUOTA_EXCEEDED_ERR
      case 'TimeoutError': return DOMException.TIMEOUT_ERR
      case 'InvalidNodeTypeError': return DOMException.INVALID_NODE_TYPE_ERR
      case 'DataCloneError': return DOMException.DATA_CLONE_ERR
      default: return 0
    }
  }
}

export {DOMException}
