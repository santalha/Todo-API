/**
 * Controller implements API endpoints
 */

'use strict';

var mongoose = require('mongoose'),
    halson = require('halson'), // HAL support
    Task = mongoose.model('Task');


/**
 * Get a list of all events associated with todos in chronological order by using last updated time
 * @param req
 * @param res
 */
exports.listAllTasks = function (req, res) {
    Task.find({}, function (err, task) {
        if (err) {
            res.send(err);
        }

        var result = [];
        res.setHeader('Content-Type', 'application/hal+json');
        for (var i = 0; i < task.length; i++) {
            var obj = task[i];
            var resource = halson({
                task_name: obj.name,
                event: obj.event,
                updated_at: obj.updated_at,
                events: obj.events,
                task_id: obj.id,
            })
            result.push(resource);
        }

        function comp(a, b) {
            return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
        }
        result.sort(comp);
        res.status(200);
        res.json({status: true, todo: result});
    });
};

/**
 * Endpoint to create and save a task
 * @param req
 * @param res
 */

exports.createTask = function (req, res) {
    var new_task = new Task(req.body);
    new_task.save(function (err, task) {
        if (err) {
            res.status(500);
            res.setHeader('Content-Type', 'application/vnd.error+json');
            res.json({message: "Failed to save the task"});
        }
        res.setHeader('Content-Type', 'application/hal+json');
        var resource = halson({
            task_id: task.id,
            task_name: task.name,
            event: task.event,
            created_at: task.created_at,
            updated_at: task.updated_at,
            events: task.events
        })
        res.status(200);
        res.send(JSON.stringify(resource));

    });
};

/**
 * Endpoint to list a task
 * @param req
 * @param res
 */
exports.listTask = function (req, res) {
    Task.findById(req.params.taskId, function (err, task) {
        if (err) {
            res.status(500);
            res.setHeader('Content-Type', 'application/vnd.error+json');
            res.json({message: "Failed to fetch the task"});
        } else if (task == null) {
            res.status(404);
            res.setHeader('Content-Type', 'application/vnd.error+json');
            res.json({message: "Task not found for taskId = " + req.params.taskId});
        } else {
            res.setHeader('Content-Type', 'application/hal+json');
            var resource = halson({
                task_id: task.id,
                task_name: task.name,
                event: task.event,
                created_at: task.created_at,
                updated_at: task.updated_at,
                events: task.events
            })
            res.send(JSON.stringify(resource));
        }
    });
};

/**
 * Endpoint to mark a task as Done or unmark as Done.
 * 'Event' is a required field in the request parameters, otherwise error 400 is thrown
 * @param req
 * @param res
 */
exports.updateTask = function (req, res) {
    if (req.body.event == null) {
        res.status(400);
        res.setHeader('Content-Type', 'application/vnd.error+json');
        res.json({message: "An event is required to mark an update"});
    }
    else {
        Task.findById(req.params.taskId, function (err, task) {
            if (err) {
                res.status(500);
                res.setHeader('Content-Type', 'application/vnd.error+json');
                res.json({message: "Failed to update the task"});
            }
            else {
                // update and save
                var events = task.events + ', ' + req.body.event;
                task.name = task.name;
                task.event = req.body.event;
                task.created_at = task.created_at;
                task.updated_at = Date.now();
                task.events = events;

                task.save(function (err, task1) {
                    if (err) {
                        res.status(500);
                        res.setHeader('Content-Type', 'application/vnd.error+json');
                        res.json({message: "Failed to update the task"});
                    }
                    res.status(200);
                    res.setHeader('Content-Type', 'application/hal+json');
                    var resource = halson({
                        task_id: task1.id,
                        task_name: task1.name,
                        event: task1.event,
                        created_at: task1.created_at,
                        updated_at: task1.updated_at,
                        events: task1.events
                    })
                    res.send(JSON.stringify(resource));


                });
            }
        });
    }
};

/**
 * Endpoint to delete a task
 * @param req
 * @param res
 */
exports.deleteTask = function (req, res) {

    Task.remove({
        _id: req.params.taskId
    }, function (err, task) {
        if (err)
            res.send(err);
        res.status(200);
        res.json({message: 'Task successfully deleted'});
    });
};
