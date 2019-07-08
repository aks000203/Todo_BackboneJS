let app=app||{};

app.AppView=Backbone.View.extend({
    el:"#todoapp",

    statstemplate: _.template($('#stats-template').html()),
    events:{
        'keypress #new-todo' : 'createOnEnter',
        'click #clear-completed' : 'clearCompleted',
        'click #toggle-all': 'toggleAlComplete'
    },
    initialize:function(){
        this.allCheckbox=this.$('#toggle-all');
        this.$input=this.$('#new-todo');
        this.$footer=this.$('#footer');
        this.$main=this.$('#main');

        this.listenTo(app.Todos, 'add', this.addOne);
        this.listenTo(app.Todos, 'reset', this.addAll);
        this.listenTo(app.Todos, 'change:completed', this.filterOne);
        this.listenTo(app.Todos, 'filter', this.filterAll);
        this.listenTo(app.Todos, 'all', this.render);
        app.Todos.render();
    },
    render:function(){
        let completed=app.Todos.completed().length;
        let remaining=app.Todos.remaining().length;
        if(app.Todos.length){
            this.$main.show();
            this.$footer.show();
            this.$footer.html(this.statstemplate({
                completed: completed,
                remaining: remaining
            }));
            
        }

    },
    addOne:function(todo){
        let view =new app.TodoView({model: todo});
        $("#todo-list").append(view.render().el);
    },

    addAll:function(){
        this.$('todo-list').html('');
        app.Todos.each(this.addOne, this)
    }
});