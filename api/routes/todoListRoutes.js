/**
 * Route file lists all end points of TodoAPI
 */

'use strict';

module.exports = function(app) {
	var todoList = require('../controllers/todoListController');


	app.route('/tasks')
		.get(todoList.listAllTasks) // Get endpoint to get list of all tasks
		.post(todoList.createTask); // Post endpoint to create a task

	// Task_id based endpoints
    app.route('/tasks/:taskId')
		.get(todoList.listTask) // Get endpoint to list a specific task by id
		.put(todoList.updateTask) // Put endpoint to update a task
		.delete(todoList.deleteTask); // Delte endpoint to delete a task by task_id
};
