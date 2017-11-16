/**
 * Model contains schema of TodoAPI
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    name: {
        type: String,
        Required: 'Enter task name'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    event: {
        type: String,
        enum: ['todoPending', 'todoUnMarkedAsDone', 'todoMarkedAsDone'],

        default: ['todoPending']
    },
    events: {
        type: String,
        default: 'todoPending'
    }
});


module.exports = mongoose.model('Task', TaskSchema);