import { useEffect, useRef, useState } from "react"
import "./App.css"
import handleToast from "./toast_message/handle"

var todosApi = "http://localhost:3001/todos"

function App() {
  const [todos, setTodos] = useState([])
  const inputElem = useRef()

  useEffect(() => {
    fetch(todosApi)
      .then(res => res.json())
      .then(todos => setTodos(todos))
  }, [])

  useEffect(() => {
    handleCreateTodos()
  })

  function setInputInvalidStatus(inputElem, duration) {
    inputElem.classList.add("invalid")
    setTimeout(()=> {
      inputElem.classList.remove("invalid")
    }, duration - 500) 
  }

  function handleCreateTodos() {
    // set lại form create
    inputElem.current.value = ""
    inputElem.current.focus()
    var buttonElem = document.querySelector("button")
    buttonElem.innerHTML = "Thêm"
    var newTitle = ""
    inputElem.current.oninput = (e) => {
      newTitle = e.target.value
    }
    inputElem.current.onkeypress = (e) => {
      if (e.key === "Enter") {
        addTodoEvent(newTitle)
      }
    }
    buttonElem.onclick = () => {
      addTodoEvent(newTitle)
    }
  }

  function addTodoEvent(newTitle) {
    if (newTitle.trim()) {
      var data = {
        title: newTitle.trim(),
        isDone: false
      }
      createTodos(data)
      var option = {
        title: "Thành công",
        message: "Bạn đã tạo todo mới thành công",
        type: "success",
        duration: 3000
      }
      handleToast("toast-msg", option)
      inputElem.current.value = ""
      inputElem.current.focus()
    } else {
      option = {
        title: "Lỗi",
        message: "Bạn chưa nhập todo!!!",
        type: "error",
        duration: 3000
      }
      setInputInvalidStatus(inputElem.current, option.duration)
      handleToast("toast-msg", option)
    }
  }

  function createTodos(data) {
    var options = {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    }
    fetch(todosApi, options)
      .then(res => res.json())
      .then(todo => setTodos([...todos, todo])
      )
  }

  function handleTodoStatus(todo) {
    updateTodoStatus({isDone: !todo.isDone}, todo.id)
  }

  function updateTodoStatus(data, id) {
    var options = {
      method: "PATCH",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    }
    fetch(todosApi + "/" + id, options)
      .then(res => res.json())
      .then(todo => {
        const newTodos = []
        todos.forEach(item => {
          if (item.id === todo.id) {
            item.isDone = todo.isDone
          }
          newTodos.push(item)
        }
        )
        setTodos(newTodos)
      })
  }

  function handleUpdateTodo(event, todo) {
    var updateIconElem = event.currentTarget
    // kiểm tra todo mà complete rồi thì không cho sửa nữa 
    if (todo.isDone === true) {
        var option = {
          title: "Chú ý!",
          message: "Trạng thái todo đang là Hoàn thành",
          type: "warning",
          duration: 3000
        }
        handleToast("toast-msg", option)
    } else {
      if (updateIconElem.className === "fa-solid fa-pen") {
        updateIconElem.className = "fa-solid fa-rotate-left"
        // set form update
        inputElem.current.value = todo.title
        var buttonElem = document.querySelector("button")
        buttonElem.innerHTML = "Sửa"
        var newTitle = ""
        inputElem.current.oninput = (e) => {
          newTitle = e.target.value
        }
        inputElem.current.onkeypress = (e) => {
          if (e.key === "Enter") {
            updateTodoEvent(newTitle, todo, updateIconElem)
          }
        }
        buttonElem.onclick = () => {
          updateTodoEvent(newTitle, todo, updateIconElem)
        }
      } else {   // bấm nút sửa nhưng không muốn sửa nữa
        updateIconElem.className = "fa-solid fa-pen"
        inputElem.current.value = ""
        inputElem.current.focus()
        handleCreateTodos()
      }
    }
  }

  function updateTodoEvent(newTitle, todo, updateIconElem) {
    if (newTitle.trim()) {
      console.log(newTitle.trim())
      console.log(todo.title)
      if (newTitle.trim() === todo.title.trim()) {
        var option = {
          title: "Lỗi",
          message: "Todo chưa được thay đổi!!!",
          type: "error",
          duration: 3000
        }
        setInputInvalidStatus(inputElem.current, option.duration)
        handleToast("toast-msg", option)
      } else {
        var data = {
          title: newTitle.trim()
        }
        updateTodo(data, todo.id)
        option = {
          title: "Thành công",
          message: "Nội dung todo đã được thay đổi",
          type: "success",
          duration: 3000
        }
        handleToast("toast-msg", option)
        inputElem.current.value = ""
        inputElem.current.focus()
        updateIconElem.className = "fa-solid fa-pen"
      }
    } else {
      option = {
        title: "Lỗi",
        message: "Todo chưa được thay đổi!!!",
        type: "error",
        duration: 3000
      }
      setInputInvalidStatus(inputElem.current, option.duration)
      handleToast("toast-msg", option)
    }
  }

  function updateTodo(data, id) {
    var options = {
      method: "PATCH",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    }
    fetch(todosApi + "/" + id, options)
      .then(res => res.json())
      .then(todo => {
        const newTodos = []
        todos.forEach(item => {
          if (item.id === todo.id) {
            item.title = todo.title
          }
          newTodos.push(item)
        }
        )
        setTodos(newTodos)
      })
  }

  function handleDeleteTodo(id, index) {
    deleteTodo(id, index)
    var option = {
      title: "Thành công",
      message: "Todo đã được xoá thành công",
      type: "success",
      duration: 3000
    }
    handleToast("toast-msg", option)
  }

  function deleteTodo(id, index) {
    var options = {
      method: "DELETE",
      headers: {
          "Content-Type": "application/json",
      }
    }
    fetch(todosApi + "/" + id, options)
      .then(res => res.json())
      .then(() => {
        const newTodos = []
        todos.splice(index, 1)
        todos.forEach(todo => {
          newTodos.push(todo)
        })
        setTodos(newTodos)
      })
  }

  return (
    <div className='App'>
      <div id="toast-msg"></div>
      <h1>TodoList</h1>
      <div className="input-data">
        <div className="input-about">
          <input className="input-block" ref={inputElem} type='text' placeholder='Nhập task mới ...'/>
          <button type='button'>Thêm</button>
        </div>
        {/* <span className="input-message">Vui lòng nhập nội dung todo</span> */}
      </div>
      <div className="todolist-content">
        <ol>
          {
            Array.from(todos).map((todo, index) => (
              <li id = {`item-${todo.id}`} key={todo.id}>
              <div className="li-show">
                <strong className= {todo.isDone === true ? "completed" : ""}>{todo.title}</strong>
                <div className="li-icon">
                  <i className={todo.isDone === true ? "fa-solid fa-rotate-left" : "fa-solid fa-circle-check"} title={todo.isDone === true ? "Trở lại" : "Hoàn thành"} onClick={(e) => handleTodoStatus(todo)}></i>
                  <i className= {todo.isDone === true ? "fa-solid fa-pen nothover" : "fa-solid fa-pen"} title="Sửa" onClick={(e) => handleUpdateTodo(e,todo)}></i>
                  <i className="fa-solid fa-trash" title="Xoá" onClick={() => handleDeleteTodo(todo.id, index)}></i>
                </div>
              </div>
            </li>
            )
          )
          }
        </ol>
      </div>
    </div>
  )
}
export default App