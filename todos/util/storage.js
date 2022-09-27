const TODOS_STORAGE_KEYS = 'TODOS'

export default {
    get(){
        return JSON.parse(localStorage.getItem(TODOS_STORAGE_KEYS)) || []
    },
    set(todos){
        localStorage.setItem(TODOS_STORAGE_KEYS, JSON.stringify(todos))
    }

}