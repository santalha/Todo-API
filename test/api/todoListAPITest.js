/**
 * Tests to verify Todo API CRUD operations
 */

"use strict";

var should = require('should'),
    request = require('supertest'),
    app = require('../../server.js'),
    mongoose = require('mongoose'),
    todoModel = mongoose.model('Task'),
    server = request.agent("http://localhost:3000");


describe('Todo API CRUD tests', function () {

    /**
     * Test to verify 'Get' endpoint
     */
    describe('Get all tasks', function () {

        before(function (done) {
            server
                .post('/tasks')
                .end(function () {
                    done();
                })
        });

        it("Should get success status and an array of todo", function (done) {

            server
                .get("/tasks")
                .expect("Content-type", /json/)
                .expect(200) // THis is HTTP response
                .end(function (err, res) {
                    res.status.should.equal(200);
                    done();
                });

        });
    });

    /**
     * Test to verify 'Post' endpoint
     */
    describe('Post a todo', function () {
        it('Should allow to post a todo and return the task_id', function (done) {
            var params = {name: "Todo Test"};
            server
                .post('/tasks')
                .send(params)
                .expect(200)
                .end(function (err, results) {
                    results.status.should.equal(200);
                    results.body.should.have.property('task_id');
                    done();
                });
        });
    });

    /**
     * Test to verify Delete endpoint
     */
    describe('Delete a todo', function () {
        var id;
        before(function (done) {
            var params = {todo: "Todo to delete"};
            server
                .post('/tasks')
                .send(params)
                .end(function (err, result) {
                    id = result.body.task_id;
                    done();
                })
        });

        it('Should delete todo by task_id', function (done) {
            server
                .delete('/tasks/' + id)
                .end(function (err, result) {
                    result.status.should.equal(200);
                    done();
                })

        });

    });

    /**
     * Test to verify Put endpoint by updating task status
     */
    describe('Update a todo', function () {
        var id;
        before(function (done) {
            var newTodo = {todo: "Todo from hooks to update"};
            server
                .post('/tasks')
                .send(newTodo)
                .end(function (err, result) {
                    id = result.body.task_id;
                    done();
                })
        });

        it('Should update the event of todo', function (done) {
            var params = {event: 'todoUnMarkedAsDone'};
            server
                .put('/tasks/' + id)
                .send(params)
                .end(function (err, result) {
                    result.status.should.equal(200);
                    done();
                })

        });
    });

});

