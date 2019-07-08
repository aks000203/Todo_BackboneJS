var app = app || {};

// Todo Item View
// --------------

// The DOM element for a todo item...
app.TodoView = Backbone.View.extend({

    //... is a list tag.
    tagName: 'li',

    // Cache the template function for a single item.
    template: _.template($('#item-template').html()),

    // The DOM events specific to an item.
    events: {
        'dblclick label': 'edit',
        'keypress .edit': 'updateOnEnter',
        'blur .edit': 'close',
        'click .toggle': 'toggleCompleted',
        'click .destroy': 'clear'
    },

    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
        this.listenTo(this.model, 'visible', this.toggleVisible);
    },

    // Re-renders the titles of the todo item.
    render: function () {
        this.$el.html(this.template(this.model.attributes));
        this.$el.toggleClass('completed', this.model.get('completed'));
        this.toggleVisible();
        this.$input = this.$('.edit');
        return this;
    },

    toggleVisible: function () {
        this.$el.toggleClass('hidden', this.isHidden());
    },
    isHidden: function () {
        let isCompleted = this.model.get('completed');
        return (
            (!isCompleted && app.TodoFilter === 'completed') ||
            (isCompleted && app.TodoFilter === 'active')
        )
    },

    toggleCompleted: function () {
        this.model.toggle(); //toggle between show/hide the model
    },


    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function () {
        this.$el.addClass('editing');
        this.$input.focus();
    },

    // Close the `"editing"` mode, saving changes to the todo.
    close: function () {
        var value = this.$input.val().trim();

        if (value) {
            this.model.save({
                title: value
            });
        } else {
            this.clear();
        }
        this.$el.removeClass('editing');
    },
    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function (e) {
        if (e.which === ENTER_KEY) {
            this.close();
        }
    },
    clear: function () {
        this.model.destroy();
    }
});