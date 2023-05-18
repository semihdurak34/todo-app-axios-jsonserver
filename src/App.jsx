import { useState, useEffect } from "react";

import axios from "axios";

function App() {
  const [todos, setTodos] = useState(null);
  const [title, setTitle] = useState("");
  const [result, setResult] = useState(false);
  const [resultMessage, setResultMessage] = useState(false);
  const [open, setOpen] = useState(false);
  const [edittodo, setEditTodo] = useState(null);
  const [editinput, setEditInput] = useState("");

  const todoDelete = (id) => {
    axios.delete(`http://localhost:3004/todos/${id}`).then((response) => {
      console.log(response.data);
      setResult(true);
      setResultMessage("işlem başarılı").catch((err) => {
        setResult(true);
        setResultMessage("Silerken bir hata meydana gedi");
      });
    });
  };
  const changeTodosCompleted = (todo) => {
    console.log(todo);
    const updatedTodos = {
      ...todo,
      complated: !todo.complated,
    };
    axios
      .put(`http://localhost:3004/todos/${todo.id}`, updatedTodos)
      .then((response) => {
        console.log(response.data);
        setResult(true);
        setResultMessage("güncelleme başarılı");
      })
      .catch((err) => {
        setResult(true);
        setResultMessage("güncelleme başarısız");
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:3004/todos")
      .then((response) => {
        console.log(response.data);
        setTodos(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [result]);
  const handleSubmit = (event) => {
    event.preventDefault();
    if (title === "") {
      alert("Please enter anything");
      return;
    }
    const newTodo = {
      id: String(new Date().getTime()),
      title: title,
      date: new Date(),
      complated: false,
    };

    axios
      .post("http://localhost:3004/todos", newTodo)
      .then((response) => {
        console.log(response.data);
        //setTodos([...todos, newTodo]);
        setTitle("");
        setResult(true);
        setResultMessage("Aferim Düzgün GİRDİN ;-)");
      })
      .catch((err) => {
        setResult(true);
        setResultMessage("Göt Lalesi Hata vAR!!");
      });
  };
  const todoEditForm = (event) => {
    event.preventDefault();
    if (editinput === "") {
      alert("Please enter a valid");
      return;
    }
    const updatedTodo = {
      ...edittodo,
      title: editinput,
    };
    axios
      .put(`http://localhost:3004/todos/${updatedTodo.id}`, updatedTodo)
      .then(() => {
        setResult(true);
        setResultMessage("Updated is successfully");
        setOpen(false);
      })
      .catch(() => {
        setResult(true);
        setOpen(true);
        setResultMessage("hata var");
      });
  };

  if (todos === null) {
    return;
  }

  return (
    <div className="container mx-auto mt-4 relative">
      {result === true && (
        <div className=" h-20 w-60 absolute bottom-2/4 left-2/4 bg-lime-400 text-black z-10 border flex justify-center items-center  flex-col">
          <div className="mb-4">{resultMessage}</div>
          <button
            className="border rounded-md w-20"
            onClick={() => setResult(false)}
          >
            Close
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
          Search
        </label>
        <div className="relative">
          <input
            type="search"
            id="search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Type your todo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <button
            type="submit"
            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Add
          </button>
        </div>
      </form>
      {open === true && (
        <div className="mt-6">
          <form onSubmit={todoEditForm}>
            <div className="relative">
              <input
                type="search"
                id="search"
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Type your "
                value={editinput}
                onChange={(event) => setEditInput(event.target.value)}
              />
              <div>
                <button
                  type="submit"
                  className="text-white absolute right-[6rem] bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Save
                </button>
                <button
                  className=" text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      <div className="flex justify-center">
        <div className="mt-10  text-start flex flex-col w-[550px]">
          {todos.map((todo) => (
            <div
              className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 flex justify-between"
              key={todo.id}
            >
              <div>
                <h1
                  style={{
                    color: todo.complated === true ? "white" : "red",
                    textDecoration:
                      todo.complated === true ? "line-through" : "none",
                  }}
                >
                  {todo.title}
                </h1>
                <p>{new Date(todo.date).toLocaleDateString()}</p>
              </div>
              <div>
                <div className=" flex items-center m-2">
                  <button
                    className="  bg-gray-500 ml-2 rounded-sm p-1"
                    type="button"
                    onClick={() => {
                      setOpen(true);
                      setEditTodo(todo);
                      setEditInput(todo.title);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 ml-2 rounded-sm p-1"
                    type="button"
                    onClick={() => todoDelete(todo.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-yellow-600 ml-2 rounded-sm p-1"
                    type="button"
                    onClick={() => changeTodosCompleted(todo)}
                  >
                    {todo.complated === true ? "Done" : "Undone"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
