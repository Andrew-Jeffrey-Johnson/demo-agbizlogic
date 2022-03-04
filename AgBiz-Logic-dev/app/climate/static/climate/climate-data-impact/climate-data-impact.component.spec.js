(function(){
    'use strict';

    describe("climateDataImpactController", function(){
        var $scope,
            $httpBackend,
            $state,
            $q,
            controller,
            climateServiceMock,
            budgetServiceMock,
            modalServiceMock;
        
        beforeEach(module('climateModule'));
        beforeEach(module('mockModule'));

        beforeEach(inject(function($injector){
            $scope = $injector.get("$rootScope");
            $state = $injector.get("$state");
            $q = $injector.get("$q");
            climateServiceMock = $injector.get("climateServiceMock");
            budgetServiceMock = $injector.get("budgetServiceMock");
            modalServiceMock = $injector.get("modalServiceMock");
            
            var $componentController = $injector.get("$componentController");
            controller = $componentController("climateDataImpact", {
                $scope: $scope,
                climateService: climateServiceMock,
                budgetService: budgetServiceMock,
                modalService: modalServiceMock
            });

            spyOn($state, "go").and.returnValue();
        }));

        describe("$onInit", function(){
            beforeEach(function(){
                var climate_budget = 1,
                climate_scenario = 6,
                is_original = 'original',
                state = 'Oregon',
                region = 'Linn';
                
                var scenario = {
                    'id': 1
                };

                var climateBudget = {
                    'id': 5,
                    'climate_factors': [
                        {'id': 1}
                    ]
                };
                

                $state.params = {
                    'original': is_original,
                    'scenario': climate_scenario,
                    'climate_budget': climate_budget,
                    'state': state,
                    'region': region  
                };

                
            });

            it("Checks state parameters for budget_id and makes calls to climateService and Budget service to update and get budget", function(){
                spyOn(climateServiceMock, "retrieveScenario").and.returnValue($q.when({'data': {'id': 6}}));
                spyOn(climateServiceMock, "getClimateData").and.returnValue($q.when({}));
                spyOn(climateServiceMock, "retrieveBudget").and.returnValue($q.when({'data':{
                    'id': 5,
                    'climate_factors': [
                        {'id': 1}
                    ]} 
                }));
                
                controller.$onInit();
                $scope.$digest();


                expect(controller.current_factor.id).toEqual(1);
                expect(controller.climate_scenario.id).toEqual(6);
                expect(controller.climate_budget.id).toEqual(5);
                expect(controller.region).toEqual('Linn');
                expect(controller.state).toEqual('Oregon');
            });

            it("Goes to the manager if we get a null response from the Budget Service call to get the budget", function(){
                spyOn(climateServiceMock, "retrieveScenario").and.returnValue($q.when({'data': {'id': 6}}));
                spyOn(climateServiceMock, "retrieveBudget").and.returnValue($q.when({'data':{}}));

                controller.$onInit();
                $scope.$digest();

                expect($state.go.calls.argsFor(0)).toEqual(["manager"]);
            });

            it("changes to manager state if no scenario in state query parameters", function(){
                delete $state.params['scenario'];
                controller.$onInit();

                expect($state.go.calls.argsFor(0)).toEqual(["manager"]);
            });

            it("goes to manager state if retrieved scenario is empty", function(){
                spyOn(climateServiceMock, "retrieveScenario").and.returnValue($q.when({'data': {}}));

                controller.$onInit();
                $scope.$digest();

                expect($state.go.calls.argsFor(0)).toEqual(["manager"]);
            });

            it("goes to manager state if no climate budget is provided", function(){
                delete $state.params['state'];
                controller.$onInit();

                expect($state.go.calls.argsFor(0)).toEqual(["manager"]);
            });

            it("goes to manager state if no climate budget id is passed in through the params", function(){
                delete $state.params['climate_budget'];
                controller.$onInit();
                expect($state.go.calls.argsFor(0)).toEqual(["manager"]);
            });

            //TODO
            it("Retrieves the short term climate data", function(){
                spyOn(climateServiceMock, "retrieveScenario").and.returnValue($q.when({'data': {'id': 6}}));
                spyOn(climateServiceMock, "retrieveBudget").and.returnValue($q.when({'data':{
                    'id': 5,
                    'climate_factors': [
                        {'id': 1}
                    ]} 
                }));
                spyOn(climateServiceMock, "getClimateData").and.returnValue($q.when({
                    data: {
                        labels: "A",
                        temp: 2,
                        temp_anom: 3,
                        precip: 3,
                        precip_anom: 4
                    }
                }));
                controller.$onInit();
                $scope.$digest();

                expect($state.go.calls.argsFor).not.toBe(["manager"]);
                expect(controller.projection_data).not.toBe(undefined);
            });

            it("Redirects to the summary page if this is the last budget", function(){
                spyOn(climateServiceMock, "retrieveScenario").and.returnValue($q.when({'data': {'id': 6}}));
                spyOn(climateServiceMock, "retrieveNextClimateBudget").and.returnValue($q.when({'data': {
                    'id': 5,
                    'climate_factors': [
                        {'id': 2}
                    ]
                }}));

                $state.params['climate_budget'] = 5;
                $state.params['original'] = 'post-impact';

                controller.$onInit();
                $scope.$digest();

                expect($state.go.calls.argsFor(0)).toContain('summary');
            });

        });
        
        describe("proceed", function(){
            var state,
            region,
            user_estimate
            beforeEach(function(){
                user_estimate = 12.4;
                controller.climate_scenario = {
                    'id': 1,
                };
                controller.climate_budget = {
                    'id': 1,
                    'climate_factors': [{
                        'id': 1
                    }],
                    'user_estimate': user_estimate,
                    'budget': 1
                };
                state = "Oregon";
                region = "Umatilla";
                controller.state = state;
                controller.region = region;
            });

            it("It goes to the budget editor after making some updates to the budgets based on user input", function() {          
                spyOn(modalServiceMock, "alert").and.returnValue();
                spyOn(budgetServiceMock, "copyBudgetByID").and.returnValue($q.when({'data': {
                    'id': 18,
                    'title': 'Test'
                }}));
                spyOn(climateServiceMock, "createBudget").and.returnValue($q.when({'data': {
                    'id': 6,
                    'is_original': false,
                    'climate_scenario': 5,
                    'budget': 1200,
                    'user_estimate': 25.4
                }}));
                spyOn(budgetServiceMock, "updateBudget").and.returnValue($q.when({'data': {
                    'id': 1200,
                    'title': 'Test - After',
                    'modified_data': new Date(),
                    'user_estimate': 25.4
                }}));

                spyOn(budgetServiceMock, "adjustNetReturns").and.returnValue($q.when({'data':{
                    'id': 18
                }}));

                controller.proceed();
                $scope.$digest();


                expect(modalServiceMock.alert).toHaveBeenCalled();
                expect(budgetServiceMock.copyBudgetByID).toHaveBeenCalled();
                expect(budgetServiceMock.updateBudget).toHaveBeenCalled();
                expect(budgetServiceMock.adjustNetReturns).toHaveBeenCalled();
                expect(climateServiceMock.createBudget).toHaveBeenCalled();
                expect($state.go.calls.argsFor(0)).toContain('budgetEditor');
            });

            it("Does nothing if user estimate is undefined", function(){
                controller.climate_budget.user_estimate = undefined;
                
                controller.proceed();

                expect($state.go.calls.argsFor(0)).toEqual([ ]);
            });

            it("Does nothing if the copied budget is undefined", function(){
                spyOn(budgetServiceMock, "copyBudgetByID").and.returnValue($q.when({'data:': {}}));

                controller.proceed();
                $scope.$digest();

                expect(budgetServiceMock.copyBudgetByID).toHaveBeenCalled();
                expect($state.go.calls.argsFor(0)).toEqual([ ]);
            });

            it("Does nothing if the updated budget is undefined", function(){
                spyOn(budgetServiceMock, "copyBudgetByID").and.returnValue($q.when({
                    'data': {
                        'id': 1
                    }
                }));
                spyOn(budgetServiceMock, "updateBudget").and.returnValue($q.when({'data': {}}));

                controller.proceed();
                $scope.$digest();
                expect(budgetServiceMock.copyBudgetByID).toHaveBeenCalled();
                expect(budgetServiceMock.updateBudget).toHaveBeenCalled();
                expect($state.go.calls.argsFor(0)).toEqual([ ]);
            });

            it("Does nothing if the new climate budget is undefined", function(){
                spyOn(budgetServiceMock, "copyBudgetByID").and.returnValue($q.when({
                    'data': {
                        'id': 1
                    }
                }));
                spyOn(budgetServiceMock, "updateBudget").and.returnValue($q.when({'data': {'id': 5}}));
                spyOn(climateServiceMock, "createBudget").and.returnValue($q.when({'data': {}}));
                controller.proceed();
                $scope.$digest();

                expect(budgetServiceMock.copyBudgetByID).toHaveBeenCalled();
                expect(budgetServiceMock.updateBudget).toHaveBeenCalled();
                expect(climateServiceMock.createBudget).toHaveBeenCalled();

                expect($state.go.calls.argsFor(0)).toEqual([ ]);
            });

            it("Does nothing if the budget with adjusted yields is undefined", function(){
                spyOn(budgetServiceMock, "copyBudgetByID").and.returnValue($q.when({
                    'data': {
                        'id': 1
                    }
                }));
                spyOn(budgetServiceMock, "updateBudget").and.returnValue($q.when({'data': {'id': 5}}));
                spyOn(climateServiceMock, "createBudget").and.returnValue($q.when({'data': {'id': 5}}));
                spyOn(budgetServiceMock, "adjustNetReturns").and.returnValue();
                controller.proceed();
                $scope.$digest();

                expect(budgetServiceMock.copyBudgetByID).toHaveBeenCalled();
                expect(budgetServiceMock.updateBudget).toHaveBeenCalled();
                expect(climateServiceMock.createBudget).toHaveBeenCalled();
                expect(budgetServiceMock.adjustNetReturns).toHaveBeenCalled();

                expect($state.go.calls.argsFor(0)).toEqual([ ]);
            });

        });

        describe("back", function(){
            it("goes to region select state with the climate scenario id in the state parameteres", function(){
                controller.climate_scenario = {'id': 4};
                controller.back();

                expect($state.go.calls.argsFor(0)).toContain("regionSelect");
            });
        });


    });

})();