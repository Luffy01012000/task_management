import { TaskController } from '../controller/taskController.js'
import { TaskService } from '../service/taskService.js'
import MongoTaskRepository from '../repository/taskRepository.js'

/**
 * Dependency Injection Container for the Auth module.
 * This container initializes and manages the dependencies for the Auth module,
 * including repositories, services, and controllers.
 */
class Container {
  static init() {
    // Initialize repositories
    const repositories = {
      taskRepository: new MongoTaskRepository()
    }

    // Initialize services with their respective repositories

    const taskService = new TaskService(repositories.taskRepository)

    const services = {
      taskService
    }

    // Initialize controllers with their respective services
    const controller = {
      taskController: new TaskController(services.taskService)
    }

    return {
      repositories,
      services,
      controller
    }
  }
}

const initialized = Container.init()
export { Container }
export default initialized
