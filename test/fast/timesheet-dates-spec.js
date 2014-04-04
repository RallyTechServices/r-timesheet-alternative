describe("When applying dates to the timesheet", function() {
    
    it("should figure beginning of week when given day of week as a JS Date",function(){
        var ts = Ext.create('Rally.technicalservices.TimeSheet',{test_flag:true});
        expect(ts._getStartOfWeek(new Date(2014,03,06)) ).toBe("2014-04-06T00:00:00.000Z");
        expect(ts._getStartOfWeek(new Date(2014,03,06,23,0,0)) ).toBe("2014-04-06T00:00:00.000Z");
        expect(ts._getStartOfWeek(new Date(2014,03,07)) ).toBe("2014-04-06T00:00:00.000Z");
        expect(ts._getStartOfWeek(new Date(2014,03,08)) ).toBe("2014-04-06T00:00:00.000Z");
        expect(ts._getStartOfWeek(new Date(2014,03,09)) ).toBe("2014-04-06T00:00:00.000Z");
        expect(ts._getStartOfWeek(new Date(2014,03,10)) ).toBe("2014-04-06T00:00:00.000Z");
        expect(ts._getStartOfWeek(new Date(2014,03,11)) ).toBe("2014-04-06T00:00:00.000Z");
        expect(ts._getStartOfWeek(new Date(2014,03,12)) ).toBe("2014-04-06T00:00:00.000Z");
        expect(ts._getStartOfWeek(new Date(2014,03,12,23,0,0)) ).toBe("2014-04-06T00:00:00.000Z");
        expect(ts._getStartOfWeek(new Date(2014,03,13)) ).toBe("2014-04-13T00:00:00.000Z");
    });
    
    it("should figure beginning of week when given day of week as an ISO Date",function(){
        var ts = Ext.create('Rally.technicalservices.TimeSheet',{test_flag:true});
        expect(ts._getStartOfWeek("2014-04-06")).toBe("2014-04-06T00:00:00.000Z");
        expect(ts._getStartOfWeek("2014-04-06T00:00:59") ).toBe("2014-04-06T00:00:00.000Z");
        expect(ts._getStartOfWeek("2014-04-06T23:00:59") ).toBe("2014-04-06T00:00:00.000Z");
        expect(ts._getStartOfWeek("2014-04-07")).toBe("2014-04-06T00:00:00.000Z");
        expect(ts._getStartOfWeek("2014-04-08")).toBe("2014-04-06T00:00:00.000Z");
        expect(ts._getStartOfWeek("2014-04-09")).toBe("2014-04-06T00:00:00.000Z");
        expect(ts._getStartOfWeek("2014-04-10")).toBe("2014-04-06T00:00:00.000Z");
        expect(ts._getStartOfWeek("2014-04-11")).toBe("2014-04-06T00:00:00.000Z");
        expect(ts._getStartOfWeek("2014-04-12")).toBe("2014-04-06T00:00:00.000Z");
        expect(ts._getStartOfWeek("2014-04-12T23:00:59")).toBe("2014-04-06T00:00:00.000Z");
        expect(ts._getStartOfWeek("2014-04-13")).toBe("2014-04-13T00:00:00.000Z");
    });
    
    it("should not die if provided undefined for start date",function(){
        var ts = Ext.create('Rally.technicalservices.TimeSheet',{test_flag:true});
        var undefined_date;
        expect(ts._getStartOfWeek(undefined_date) ).toBeDefined();
    });
});