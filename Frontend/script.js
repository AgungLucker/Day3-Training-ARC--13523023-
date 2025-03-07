const TODOContainer = document.querySelector(".content-container");
const inputField = document.querySelector("#input");
const submitButton = document.querySelector("#submit-button");

const fetchTODO = () => {
    fetch("http://localhost:3000/todos")
        .then((res) => res.json())
        .then((data) => {
            TODOContainer.innerHTML = "";
            data.forEach((todo) => showTODO(todo));
        });
};

const showTODO = (todo) => {
    const TODOBar = document.createElement("div");
    TODOBar.classList.add("todo-bar");
    TODOBar.setAttribute("data-id", todo.id);

    const TODODesc = document.createElement("p");
    TODODesc.innerText = todo.desc;

    const TODOActions = document.createElement("div");
    TODOActions.classList.add("todo-actions");

    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => completeTODO(todo.id, checkbox, TODOBar, TODODesc));

    const editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.addEventListener("click", () => editTODO(todo.id, TODODesc));

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", () => deleteTODO(todo.id, TODOBar));

    TODOActions.appendChild(checkbox);
    TODOActions.appendChild(editButton);
    TODOActions.appendChild(deleteButton);
    TODOBar.appendChild(TODODesc);
    TODOBar.appendChild(TODOActions);

    updateCompletedTODO(todo, TODOBar, TODODesc);
    TODOContainer.appendChild(TODOBar);
};

const updateCompletedTODO = (todo, TODOBar, TODODesc) => {
    if (todo.completed) {
        TODOBar.style.backgroundColor = "#d3d3d3"; 
        TODODesc.style.textDecoration = "line-through"; 
    } else {
        TODOBar.style.backgroundColor = ""; 
        TODODesc.style.textDecoration = "none";
    }
};

const addTODO = () => {
    if (inputField.value.trim() !== "") {
        const newTODO = { desc: inputField.value, completed: false };

        fetch("http://localhost:3000/todos", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(newTODO),
        })
        .then((res) => res.json())
        .then((todo) => showTODO(todo)); 

        inputField.value = "";
    }
};

const deleteTODO = (id, TODOBar) => {
    fetch(`http://localhost:3000/todos/${id}`, {
        method: "DELETE",
    })
    .then((res) => res.json())
    .then(() => TODOBar.remove()); 
};

const completeTODO = (id, checkbox, TODOBar, TODODesc) => {
    fetch(`http://localhost:3000/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: checkbox.checked }),
    })
    .then((res) => res.json())
    .then((updatedTodo) => {
        console.log("Todo status updated:", updatedTodo);
        updateCompletedTODO(updatedTodo, TODOBar, TODODesc);
    });
};

const editTODO = (id, TODODesc) => {
    let editedDesc = prompt("Edit todo:", TODODesc.innerText);
    if (editedDesc !== null && editedDesc.trim() !== "") {
        fetch(`http://localhost:3000/todos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ desc: editedDesc }),
        })
        .then((res) => res.json())
        .then(() => {
            TODODesc.innerText = editedDesc;
            console.log("Todo edited");
        });
    }
};

submitButton.addEventListener("click", addTODO);
fetchTODO();
