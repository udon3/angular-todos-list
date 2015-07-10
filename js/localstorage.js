
angular.module('localdatastorage', [])
				.factory('dataStorage', dataStorage);

function dataStorage(){

	//localStorage feature detection test
	var localStorageSupported = function(){
		//console.log('localStorageSupported test is running from inside dataStorage');
		var test = 'test';
		try {
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch(e) {
    	alert('Sorry, this webapp needs IE9 or higher to run properly');
      return false;
    }
	};

	var localStorageObj = {
		
		//all localStorage properties and methods should be exposed to the todo_module via refs to localStorageObj
		//dataStorage.localStorageObj.localData.initial
		localData: {
			initial: [
				//some default example items if accessing site for the first time
				{text:'Establish a new world order', done:false}, //access values : todo.text, todo.done
				{text:'Get potatoes', done:false}
			],
			todos: [],
			donepile: []
		},
		init: function(localData){
			if(localStorageSupported()){

				//check if localData exists
				if (localStorage.length === 0){
					//no localStorage data, use default data
					localStorageObj.localData.todos = localStorageObj.localData.initial;
					//todoCtrl.todos = todoCtrl.todosData; //or [] if want to start with a blank
					localStorageObj.localData.donepile = [];
					//localStorageObj.localData.donepilehide = true;
					
				} else {
					//localStorage.removeItem('todoslist'); //for testing empty localStorage
					//use localStorage data
					localStorageObj.localData.todos = localStorageObj.retrieveData();

					if (!localStorage.donelist || localStorage.donelist.length <= 0){ //if donepile doesn't exist or is empty...
						localStorageObj.localData.donepile = [];
						//localStorageObj.localData.donepilehide = true;
					} else {
						localStorageObj.localData.donepile = localStorageObj.retrieveDonePile();
						//localStorageObj.localData.donepilehide = false;
					}
				}

			}//end if
		},
		storeData: function storeData(dataObj){	
			localStorage.setItem('todoslist', JSON.stringify(dataObj));
		},
		//get data from localStorage
		retrieveData: function retrieveData(){
			var retrievedObj = JSON.parse(localStorage.getItem('todoslist'));
			//console.log(localStorage.getItem('todoslist'), retrievedObj);
			return retrievedObj;
		},

		//for the DONE list
		storeDonePile: function storeDonePile(dataObj){
			localStorage.setItem('donelist', JSON.stringify(dataObj));
		},
		retrieveDonePile: function retrieveDonePile(){
			var retrievedObj = JSON.parse(localStorage.getItem('donelist'));
			//console.log(localStorage.getItem('donelist'), retrievedObj);
			return retrievedObj;
		}

	};


	return {
		localStorageObj: localStorageObj
	}
	
}

