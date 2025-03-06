const fs = require("fs");
const express = require("express");
const bodyParser = require('body-parser');
const uuid = require("uuid");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const readTODO = () => {
    try {
        return JSON.parse(fs.readFileSync("todos.json", "utf-8"));
    } catch (error) {
        return [];
    }
}

const saveTODO = (todos) => {
    fs.writeFileSync("todos.json", JSON.stringify(todos, null, 2));
}

let todos = readTODO();

// GET
app.get("/todos", (request, response) => {
    response.json(todos);
});

// POST
app.post("/todos", (request, response)=> {
    console.log("Menerima request POST ke /todos");
    console.log("Body:", request.body);

    const newTODO = {id : uuid.v4(), ...request.body};
    todos.push(newTODO);
    saveTODO(todos);
    response.json(newTODO);
})

app.put("/todos/:id", (request, response) => {
    const todo = todos.find((todo) => {
        return todo.id == request.params.id;
    });

    if (todo) {
        if (request.body.desc !== undefined) {
            todo.desc = request.body.desc;
        }
        if (request.body.completed !== undefined) {
            todo.completed = request.body.completed;
        }
        saveTODO(todos);
        response.json(todo);
    } else {
        response.status(404).send("Error not found");
    }
});

// Delete
app.delete("/todos/:id", (request, response) => {
    const newTodos = todos.filter((todo) => {
        return todo.id !== request.params.id;
    })

    if (newTodos.length !== todos.length) {
        todos = newTodos;
        saveTODO(todos);
        response.json({messsage: "Todo activity deleted"});
    } else {
        response.status(404).send("Todo activity not found");
    }
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})

