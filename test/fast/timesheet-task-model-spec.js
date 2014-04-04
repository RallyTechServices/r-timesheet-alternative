describe("When applying dates to the timesheet", function() {
    
    it("should create a time task from a time entry item",function(){
        
        var tie = Ext.create('mockTIE',{
            ObjectID:1
        });
        
        var time_task = Ext.create('TSTimeTask',{ tie: tie });
        
        expect( time_task.get("ObjectID") ).toEqual(1);
        expect( time_task.get("Name") ).toEqual("");
    });
    
    it("should create a time task from a time entry item with a Task",function(){
        var tie = Ext.create('mockTIE',{
            ObjectID:2,
            TaskDisplayString: "TA5: Task Name"
        });
        
        var time_task = Ext.create('TSTimeTask',{ tie: tie });
        
        expect( time_task.get("ObjectID") ).toEqual(2);
        expect( time_task.get("Name") ).toEqual("TA5: Task Name");
        
    });
    
    it("should create a time task from a time entry item with a Story",function(){
        var tie = Ext.create('mockTIE',{
            ObjectID:2,
            WorkProductDisplayString: "US1: Story Name"
        });
        
        var time_task = Ext.create('TSTimeTask',{ tie: tie });
        
        expect( time_task.get("ObjectID") ).toEqual(2);
        expect( time_task.get("Name") ).toEqual("US1: Story Name");
        
    });

    it("should create a time task from a time entry item with a Project",function(){
        var tie = Ext.create('mockTIE',{
            ObjectID:2,
            ProjectDisplayString: "Project Name"
        });
        
        var time_task = Ext.create('TSTimeTask',{ tie: tie });
        
        expect( time_task.get("ObjectID") ).toEqual(2);
        expect( time_task.get("Name") ).toEqual("Project Name");
        
    });
    
    it("should use the Task name if both story and task provided",function(){
        var tie = Ext.create('mockTIE',{
            ObjectID:2,
            WorkProductDisplayString: "US1: Story Name",
            TaskDisplayString: "TA5: Task Name"
        });
        
        var time_task = Ext.create('TSTimeTask',{ tie: tie });
        
        expect( time_task.get("ObjectID") ).toEqual(2);
        expect( time_task.get("Name") ).toEqual("TA5: Task Name");
        
    });

    it("should use the Task name if project, story and task provided",function(){
        var tie = Ext.create('mockTIE',{
            ObjectID:2,
            WorkProductDisplayString: "US1: Story Name",
            TaskDisplayString: "TA5: Task Name",
            ProjectDisplayString: 'Project Name'
        });
        
        var time_task = Ext.create('TSTimeTask',{ tie: tie });
        
        expect( time_task.get("ObjectID") ).toEqual(2);
        expect( time_task.get("Name") ).toEqual("TA5: Task Name");
        
    });
    
    it("should use the Story name if project and story provided",function(){
        var tie = Ext.create('mockTIE',{
            ObjectID:2,
            WorkProductDisplayString: "US1: Story Name",
            ProjectDisplayString: 'Project Name'
        });
        
        var time_task = Ext.create('TSTimeTask',{ tie: tie });
        
        expect( time_task.get("ObjectID") ).toEqual(2);
        expect( time_task.get("Name") ).toEqual("US1: Story Name");
    });
    
    it("should use the Project name if task and story are provided but blank",function(){
        var tie = Ext.create('mockTIE',{
            ObjectID:2,
            WorkProductDisplayString: "",
            TaskDisplayString: "",
            ProjectDisplayString: 'Project Name'
        });
        
        var time_task = Ext.create('TSTimeTask',{ tie: tie });
        
        expect( time_task.get("ObjectID") ).toEqual(2);
        expect( time_task.get("Name") ).toEqual("Project Name");
        
    });
    
});