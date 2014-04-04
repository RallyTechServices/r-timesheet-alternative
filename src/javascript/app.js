Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    logger: new Rally.technicalservices.Logger(),
    items: [
        {xtype:'container',itemId:'selector_box', padding: 5, margin: 5},
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
            listeners: {
                scope: this,
                change: function( db, newValue, oldValue, eOpts ) {
                    this.logger.log("Date chosen: ", newValue);
                    this._replaceTimesheet(newValue);
                }
            }
        });
    },
    _replaceTimesheet: function(date_in_week){
        this.down('#display_box').removeAll();
        
        this.down('#display_box').add({
            xtype:'tstimesheet',
            date_in_week: date_in_week
        });
    }
});
