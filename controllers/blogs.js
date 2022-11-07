const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// blogsRouter.get('/', (request, response) => {
//     Blog
//       .find({})
//       .then(blogs => {
//         response.json(blogs)
//       })
//   })

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
})

blogsRouter.get('/:id', async (request, response) => {
  const id = request.params.id.trim();

  Blog.findById(id)
    .then(blog => {
      if (!blog) {
        return response.status(404).end();
      } else {
        response.json(blog)
      }
    })
    .catch(error => {
      console.log(error)
      response.status(500).send({error: 'malformatted id'})
    })
})


  
// blogsRouter.post('/', (request, response) => {
//     console.log("req: ", request.body)
//     const blog = new Blog(request.body)
//     console.log(blog)
//     blog
//       .save()
//       .then(result => {
//         response.status(201).json(result)
//       })
//   })

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })
  try {
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog);
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  Blog.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
})

blogsRouter.patch('/:id', async (request, response, next) => {
  Blog.findByIdAndUpdate(request.params.id, {$set: request.body}, { new: true, runValidators: true })
    .then(blog => {
      response.status(201).end()
    })
})

  module.exports = blogsRouter