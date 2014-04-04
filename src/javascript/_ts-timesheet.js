/**
 * An grid for displaying timesheet information
 */
 Ext.define('Rally.technicalservices.TimeSheet', {
    extend: 'Ext.Container',
    alias: 'widget.tstimesheet',
    logger: new Rally.technicalservices.Logger(),
    config: {
        /**
         * @cfg {String/Date} date_in_week a date in the week for this timesheet.  If not
         * provided, default to today
         */
        date_in_week: new Date(),
        /**
         * @cfg {Boolean} test_flag  set to true to skip steps that involve going to the server
         * (for unit testing only)
         */
        test_flag: false,
        /**
         * 
         * @cfg {Integer} user_oid  the ObjectID of the user for this timesheet
         */
        user_oid: -1,
        /**
         * @cfg {Boolean} show_timesheet_header Use to show or hide the items above the table.
         */
        show_timesheet_header: true
    },
    items: [
        { xtype:'container', itemId: 'timesheet-header', tpl: '<tpl>Week Starting: {start_of_week:substr(0,10)}</tpl>' },
        { xtype:'container', itemId: 'timesheet-grid-box', margin: 5, height: 175 }
    ],
    constructor: function(config) {
        this.mergeConfig(config);
        this.callParent([this.config]);
    },

    initComponent: function() {
        this.callParent(arguments);
        this.start_of_week = this._getStartOfWeek(this.date_in_week);
        if ( this.show_timesheet_header ) {
            this.down('#timesheet-header').update(this);
        }

        if ( !this.test_flag ) { 
            this._getTimeEntryItemsForWeekStarting(this.start_of_week).then({
                scope: this,
                success: function(ties) {
                    this.ties = ties;
                    this._createStoreAndGrid(ties);
                }
            });
        }
    },
    _createStoreAndGrid: function(ties) {
        var configured_data = [];
        Ext.Array.each(ties,function(tie){
            configured_data.push({tie:tie});
        });
        
        var time_task_store = Ext.create('Rally.data.custom.Store',{
            model: 'TSTimeTask',
            pageSize: 5,
            data: configured_data
        });
        
        this.logger.log("HEIGHT: ", this.getHeight());
        
        this.down('#timesheet-grid-box').add({
            xtype:'rallygrid',
            store: time_task_store,
            pagingToolbarCfg: {
                pageSizes: [5, 15, 25, 50],
                store: time_task_store
            },
            columnCfgs: [
                { dataIndex:'Name', text: 'Name', flex: 1 }
            ]
        });
    },
    /*
     * Given a start date, get the time entry items (each line on the time sheets)
     * ( Returns a promise )
     */
    _getTimeEntryItemsForWeekStarting:function(start_of_week){
        var deferred = Ext.create('Deft.Deferred');
        
        Ext.create('Rally.data.wsapi.Store',{
            model:'TimeEntryItem',
            autoLoad: true,
            filters: [
                {property:'WeekStartDate',value:start_of_week},
                {property:'User.ObjectID',value:this.user_oid}
            ],
            listeners: {
                scope: this,
                load: function(store,ties){
                    this.logger.log("from database",ties);
                    deferred.resolve(ties);
                }
            }
        });
        return deferred.promise;
    },
    /*
     * Given a date, return the ISO string for the beginning of the week
     */
    _getStartOfWeek: function(date_in_week){
        if ( typeof(date_in_week) == 'undefined' ) {
            date_in_week = new Date();
        }
        if ( typeof(date_in_week) == "string" ) {
            var timezone_offset = new Date().getTimezoneOffset() / 60;
            var timezone_offset_string = Math.abs(timezone_offset) + ":00";
            
            if ( Math.abs(timezone_offset) < 10 ) {
                timezone_offset_string = "0" + timezone_offset_string;
            }
            if ( timezone_offset > 0 ) {
                timezone_offset_string = "-" + timezone_offset_string;
            } else {
                timezone_offset_string = "+" + timezone_offset_string;;
            }
            if ( ! /Z/.test(date_in_week) ) {
                if ( /T/.test(date_in_week) ) {
                    date_in_week = date_in_week + timezone_offset_string;
                } else {
                    date_in_week = date_in_week + "T00:00:00" + timezone_offset_string;
                }
            }
            date_in_week = Rally.util.DateTime.fromIsoString(date_in_week);
        }
        var day_of_week = date_in_week.getDay();
        var day_of_month = date_in_week.getDate();
        // push to midnight
        date_in_week.setHours(0,0,0,0);
        
        // determine what beginning of week is
        var start_of_week_js = date_in_week;
        start_of_week_js.setDate( day_of_month - day_of_week );
        
        var start_of_week_iso = Rally.util.DateTime.toIsoString(start_of_week_js).replace(/T.*$/,"T00:00:00.000Z");
        return start_of_week_iso;
    },
    getStartOfWeek: function() {
        return this.start_of_week;
    },
    getTimeEntryItems: function() {
        return this.ties || [];
    }
});