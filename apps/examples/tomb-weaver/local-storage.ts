type SpiderNest = {
  gold: number
  health: number
  attack: number
}

const STORAGE_KEY = 'spiderNest'

const DEFAULT_STATE: SpiderNest = {
  gold: 0,
  health: 0,
  attack: 0,
}

/**
 * Writes data to localStorage.
 * @param key The key to store the data under.
 * @param value The data to store (will be serialized to JSON).
 */
function writeData(key: string, value: any): void {
  try {
    const serializedValue = JSON.stringify(value)
    localStorage.setItem(key, serializedValue)
    // console.log(`Successfully stored data under key "${key}":`, value)
  } catch (error) {
    // console.error(`Error storing data under key "${key}":`, error)
    // Unlike localforage, localStorage doesn't have a Promise-based API, so we can't throw here.
  }
}

/**
 * Reads data from localStorage.
 * @param key The key to retrieve the data from.
 * @returns The data, or null if the key does not exist.
 */
function readData<T>(key: string): T | null {
  try {
    const serializedValue = localStorage.getItem(key)
    if (serializedValue === null) {
    //   console.log(`Key "${key}" not found in localStorage.`)
      return null
    }
    const value: T = JSON.parse(serializedValue)
    // console.log(`Successfully retrieved data for key "${key}":`, value)
    return value
  } catch (error) {
    // console.error(`Error retrieving data for key "${key}":`, error)
    return null  //  Return null, because localStorage getItem does not throw.
  }
}

/**
 * Clears data from localStorage for a specific key.
 * @param key The key to remove from localStorage.
 */
function clearData(key: string): void {
  try {
    localStorage.removeItem(key)
    // console.log(`Successfully removed data for key "${key}"`)
  } catch (error) {
    // console.error(`Error removing data for key "${key}":`, error)
  }
}

/**
 * Clears all data from localStorage.
 */
function clearAllData(): void {
  try {
    localStorage.clear()
    // console.log('Successfully cleared all data from localStorage.')
  } catch (error) {
    // console.error('Error clearing localStorage:', error)
  }
}

const saveData = (data: Partial<SpiderNest>, addToValue?: boolean) => {
  const curData = readData<SpiderNest>(STORAGE_KEY) || DEFAULT_STATE
  Object.entries(data).forEach(([key, value]) => {
    if (addToValue && curData[key]) {
      curData[key] += value
    } else {
      curData[key] = value
    }
  })
  writeData(STORAGE_KEY, curData)
}

const getData = (): SpiderNest => {
  const data = readData<SpiderNest>(STORAGE_KEY)
  return data || DEFAULT_STATE
}

export {
  saveData,
  getData,
}

// Example Usage
// interface UserProfile {
//     name: string;

//     age: number;
//     email: string;
// }

// const user: UserProfile = {name: 'John Doe', age: 30, email: 'john.doe@example.com'}

// // Write user data
// writeData('userProfile', user)

// // Read user data
// const storedUser = readData<UserProfile>('userProfile')
// if (storedUser) {
//   console.log('Retrieved user data:', storedUser)
// }

// // Write a different data type
// writeData('message', 'Hello, localStorage!')
// const message = readData<string>('message')
// console.log('Message: ', message)

// // Read non-existent key
// const nonExistent = readData('nonExistentKey')
// console.log('Non-existent key:', nonExistent)  // Should be null

// // Clear specific key
// clearData('userProfile')
// const clearedUser = readData<UserProfile>('userProfile')
// console.log('User after clear:', clearedUser)  // Should be null

// // Clear all data
// clearAllData()
// const emptyMessage = readData<string>('message')
// console.log('Message after clearAll:', emptyMessage)  // Should be null
