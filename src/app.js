const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const validateId = (request, response, next) => {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({message: "Invalid ID"});
  }

  return next()
}

app.use("/repositories/:id", validateId);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;

  const repo = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0,
  }

  repositories.push(repo);

  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;

  const index = repositories.findIndex(repo => repo.id === id)
  if (index < 0) {
    return response.status(400).json({message: "ID not found"});
  }

  const repo = {
    ...repositories[index],
    url,
    title,
    techs,
  }

  repositories[index] = repo

  return response.status(200).json(repo)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repo => repo.id === id)
  if (index < 0) {
    return response.status(400).json({message: "ID not found"});
  }

  repositories.splice(index, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repo => repo.id === id)
  if (index < 0) {
    return response.status(400).json({message: "ID not found"});
  }

  const updatedRepo = {
    ...repositories[index],
    likes: repositories[index].likes + 1,
  }

  repositories[index] = updatedRepo

  return response.status(200).json(updatedRepo)
});

module.exports = app;
