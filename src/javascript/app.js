Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    logger: new Rally.technicalservices.Logger(),
    items: [
        {xtype:'container',itemId:'selector_box', padding: 5, margin: 5, defaults: { margin: 5 }, layout: { type: 'hbox' } },
        {xtype:'container',itemId:'display_box', padding: 5, margin: 5 }
        /*,
        {xtype:'tsinfolink'}
        */
    ],
    launch: function() {
        this._addSelectors(this.down('#selector_box'));
        this._replaceTimesheet();

    },
    _addSelectors: function(container) {
        container.add({
            xtype:'rallydatefield',
            value: new Date(),
            listeners: {
                scope: this,
                change: function( db, newValue, oldValue, eOpts ) {
                    this.logger.log("Date chosen: ", newValue);
                    this._replaceTimesheet(newValue);
                }
            }
        });
        
        container.add({
            xtype:'rallybutton',
            text:'Add from Other Timesheet',
            scope: this,
            handler: function() {
                this._showAddFromEarlierWeekDialog();
            }
        });
    },
    _replaceTimesheet: function(date_in_week){
        this.down('#display_box').removeAll(true);
        
        this.timesheet = this.down('#display_box').add({
            xtype:'tstimesheet',
            date_in_week: date_in_week,
            user_oid: this.getContext().getUser().ObjectID
        });
    },
    _showAddFromEarlierWeekDialog: function() {
        if ( this.dialog ) { this.dialog.destroy(); }
        
        this.dialog = Ext.create('Rally.technicalservices.PreviousTimesheetDialog',{
            user_oid: this.getContext().getUser().ObjectID,
            listeners: {
                scope: this,
                weekChosen: function(dialog, start_of_week, time_entry_items ){
                    this.logger.log("WEEK CHOSEN: ",start_of_week,time_entry_items);
                    this._addTimeEntryItems(time_entry_items);
                }
            }
        }).show();
    },
    _addTimeEntryItems: function(ties) {
        var start_of_week = this.timesheet.getStartOfWeek();
        var me = this;
        Rally.data.ModelFactory.getModel({
            type: 'TimeEntryItem',
            success: function(model) {
                var promises = [];
                Ext.Array.each(ties,function(tie){
                    me.logger.log('ties ',tie);
                    var tie_config = {
                        WeekStartDate: start_of_week,
                        User: { _ref: tie.get('User')._ref }
                    };
                    
                    var task = tie.get('Task');
                    if ( task && task._ref ){
                        tie_config.Task = { _ref: task._ref };
                    }
                    
                    var workproduct = tie.get('WorkProduct');
                    if ( workproduct && workproduct._ref ) {
                        tie_config.WorkProduct = { _ref: workproduct._ref };
                    }
                    
                    var project = tie.get('Project');
                    if ( project && project._ref ) {
                        tie_config.Project = { _ref: project._ref };
                    }
                    me.logger.log("tie_config: ",tie_config);
                    promises.push(me._createTimeEntryItem(model,tie_config));
                });
                Deft.Promise.all(promises).then({
                    scope: me,
                    success: function(operations){
                        console.log("Operations ",operations);
                        me._replaceTimesheet(me.down('rallydatefield').getValue() || new Date());
                    },
                    failure: function(error) {
                        alert(error);
                    }
                });
            }
        });
    },
    _createTimeEntryItem: function(model,tie_config){
        var deferred = Ext.create('Deft.Deferred');
        
        var tie = Ext.create(model,tie_config);
        tie.save({
            callback: function(result,operation) {
                deferred.resolve(operation);
            }
        });
        
        return deferred.promise;
    }
});
