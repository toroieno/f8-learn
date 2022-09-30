import React from 'react'
import ReactDOM from 'react-dom/client'

function App(){
    return (
        <div>
            <h1>Tao du an voi app</h1>
        </div>
    )
}
// React@17
// ReactDOM.render(<App/>, document.getElementById('root'))

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App/>)