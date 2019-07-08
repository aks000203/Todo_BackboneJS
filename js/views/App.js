var app=app||{};

app.AppView=Backbone.View.extend({
    el:"#todoapp",

    statstemplate: _.template($('#stats-template').html()),
    events:{
        'keypress #new-todo' : 'createOnEnter',
        'click #clear-completed' : 'clearCompleted',
        'click #toggle-all': 'toggleAllComplete'
    },
    //caching these variables locally to make them easy to use
    initialize:function(){
        this.allCheckbox=this.$('#toggle-all')[0];
        this.input=this.$('#new-todo');
        this.$footer=this.$('#footer');
        this.$main=this.$('#main');

        this.listenTo(app.Todos, 'add', this.addOne);
        this.listenTo(app.Todos, 'reset', this.addAll);
        this.listenTo(app.Todos, 'change:completed', this.filterOne); //Listens for changes in completed flag to each todo item
        this.listenTo(app.Todos, 'filter', this.filterAll);
        this.listenTo(app.Todos, 'all', this.render);
        app.Todos.fetch();
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
            this.$("#filters li a")
            .removeClass('selected')
            .filter('[href="#/' + (app.todoFilter || '' ) + '"]')
            .addClass('selected');
        } else{
            this.$main.hide();
            this.$footer.hide();
        }
        this.allCheckbox.checked=!remaining;
    },
    addOne:function(todo){
        let view =new app.TodoView({model: todo});
        $("#todo-list").append(view.render().el);
    },

    addAll:function(){
        this.$('todo-list').html('');
        app.Todos.each(this.addOne, this)
    },
    filterOne:function(todo){
        todo.trigger('visible');
    },
    filterAll:function(){
        app.Todos.each(this.filterOne, this);
    },
    //this function generates attributes for a new todo item added
    newAtributes:function(){
        return {
            title: this.input.val().trim(),
            order:app.Todos.nextOrder(),
            completed: false
        };
    },
    //this creates a new todo item on hitting the enter button
    createOnEnter:function(event){
        if(event.which!= ENTER_KEY || !this.input.val().trim()){
            return;
        }
        app.Todos.create(this.newAtributes());
        this.input.val('');//Empty the input field after todo item has been created
    },

    clearCompleted:function(){
        _.invoke(app.Todos.completed(), 'destroy');
        return false;
    },

    toggleAllComplete:function(){
        let completed=this.allCheckbox.checked;
        app.Todos.each(function(todo){
            todo.save({
                'completed': completed
            });
        });
    }

});