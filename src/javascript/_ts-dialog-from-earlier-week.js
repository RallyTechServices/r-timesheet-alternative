Ext.define('Rally.technicalservices.PreviousTimesheetDialog', {
    extend: 'Rally.ui.dialog.Dialog',
    alias:'widget.tsprevioustimesheetdialog',
    config: {
        /**
         * @cfg {String}
         * Title to give to the dialog
         */
        title: 'Tasks from Other Timesheets',
        /**
         * 
         * @cfg {Integer} user_oid ObjectID of the user for the timesheet
         */
        user_oid: -1,
        /**
         * @cfg {String} selectionButtonText Text to show on button for picking the week
         */
        selectionButtonText: "Copy These Items",
        height: 250,
        width: 450
    },
    items: [{
        xtype:'panel',
        border: false,
        items: [
            {xtype:'container',itemId:'date_box'},
            {xtype:'container',itemId:'grid_box',layout:'fit'}
        ]
    }],
    
    constructor: function(config) {
        this.mergeConfig(config);
        this.callParent([this.config]);
    },

    initComponent: function() {
        this.callParent(arguments);
        this.addEvents(
                /**
                 * @event weekChosen
                 * Fires when user clicks done
                 * @param {Rally.technicalservices.PreviousTimesheetDialog} this
                 * @param {String} selected week start date (ISO)
                 * @param [{TSTimeTask}] Time Entry Items from selected week
                 */
                'weekChosen'
        );

        this.addCls('chooserDialog');

        this._addTimeGrid(Rally.util.DateTime.add( new Date(), "week", -1 ));
        this._addButtons();
    },
    _addTimeGrid: function(week_date){
        this.down('#grid_box').removeAll(true);
        
        this.time_grid = this.down('#grid_box').add({
            xtype:'tstimesheet',
            date_in_week: week_date,
            user_oid: this.user_oid,
            show_timesheet_header: false
        });
        
        this.setTitle("Tasks from Week Starting " + this.time_grid.getStartOfWeek().replace(/T.*$/,""));

        return;
    },
    _addButtons: function() {
        var me = this;
        var onChange = function(db,new_value){
            
        };
        
        this.down('panel').addDocked({
            xtype: 'toolbar',
            dock: 'bottom',
            padding: '0 0 10 0',
            layout: {
                type: 'hbox',
                pack: 'center'
            },
            ui: 'footer',
            items: [
                {
                    xtype:'rallydatefield',
                    value: Rally.util.DateTime.add( new Date(), "week", -1 ),
                    listeners: {
                        scope: this,
                        change: function( db, newValue, oldValue, eOpts ) {
                            this._addTimeGrid(db.getValue());
                        }
                    }
                },
                {
                    xtype: 'rallybutton',
                    text: this.selectionButtonText,
                    cls: 'primary small',
                    scope: this,
                    handler: function() {
                        var start_of_week = this.time_grid.getStartOfWeek();
                        var time_entry_items = this.time_grid.getTimeEntryItems() || [];
                        this.fireEvent('weekChosen', this, start_of_week, time_entry_items);
                        this.close();
                    }
                },
                {
                    xtype: 'rallybutton',
                    text: 'Cancel',
                    cls: 'secondary small',
                    handler: this.close,
                    scope: this
                }
            ]
        });
    }
});