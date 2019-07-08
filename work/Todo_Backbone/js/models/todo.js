//This is a todo model that is representing individual todo items.
let app=app || {};
//There are two values we need for each todo item: The title and whether it is completed or not.

let Todo=Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false
    },
    toggle: function(){
    this.save({
        completed:!this.get('completed')
    })}
})