Ext.define('TSTimeTask',{
    extend: 'Ext.data.Model',
    fields: [
        { name: 'tie', type: 'auto' },
        { name: 'Name', type: 'string', defaultValue:'', 
            convert: function(value,record){
                if ( record.get('tie') && record.get('tie').get('TaskDisplayString')) {
                    return record.get('tie').get('TaskDisplayString');
                }
                if ( record.get('tie') && record.get('tie').get('WorkProductDisplayString')) {
                    return record.get('tie').get('WorkProductDisplayString');
                }
                if ( record.get('tie') && record.get('tie').get('ProjectDisplayString')) {
                    return record.get('tie').get('ProjectDisplayString');
                }
                return '';
            }
        },
        { name: 'ObjectID', type: 'int', defaultValue:-1, 
            convert: function(value,record){
                if ( record.get('tie') ) {
                    return record.get('tie').get('ObjectID');
                }
                return '';
            }
        }
    ]
    
});