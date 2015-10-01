angular.module('todoApp', ['localdatastorage'])
							.controller('TodoController', ['dataStorage', TodoController]);


//console.log('ref dataStorage from todomodule', localdatastorage.dataStorage);
function TodoController(dataStorage){

	var todoCtrl = this;
	todoCtrl.addTodo = addTodo;
	todoCtrl.clearCompleted = clearCompleted;
	todoCtrl.manageDonePile = manageDonePile;
	todoCtrl.undoDoneItems = undoDoneItems;
	todoCtrl.clearDoneItems = clearDoneItems;
	todoCtrl.clearDoneList = clearDoneList;
	todoCtrl.remaining = remaining;
	todoCtrl.removeLocalStorageData = removeLocalStorageData;

	//initialise the localStorage setup
	dataStorage.localStorageObj.init();

	//set the todos list in VIEW to object passed from localStorage MODEL
	todoCtrl.todos = dataStorage.localStorageObj.localData.todos;
	todoCtrl.donepile = dataStorage.localStorageObj.localData.donepile;

	showhideDonepile();
	

	//get text from input and print to list
	function addTodo(){
		//push user input string (with other values) to the todos array.
		todoCtrl.todos.push({text: todoCtrl.todoText, done:false});
		//reset the input field to blank for next use
		todoCtrl.todoText = '';
		
		//update localStorage (by passing new todos list data to function in localstorage.js)
		dataStorage.localStorageObj.storeData(todoCtrl.todos);
	}

	function clearCompleted(){
		var oldTodos = todoCtrl.todos;
		todoCtrl.todos = [];  //reset todos array to empty

		angular.forEach(oldTodos, function(todo){ //iterate the oldTodos
			if (!todo.done){
				todoCtrl.todos.push(todo); //push the todos with done:false to the reset todos array.
			} else {
				todoCtrl.donepile.push(todo); //get the items with done:true and push to the donepile array
			}
			showhideDonepile();
		});

		//update todos localStorage (passing new todos data to function in localstorage.js))		
		dataStorage.localStorageObj.storeData(todoCtrl.todos);
		//update donepile localStorage (passing new donepile data to function in localstorage.js)
		dataStorage.localStorageObj.storeDonePile(todoCtrl.donepile);
	}

	function manageDonePile(evtarget){
		var oldPile = todoCtrl.donepile;
		todoCtrl.donepile = [];

		angular.forEach(oldPile, function(item){
			if (evtarget=='move'){
				todoCtrl.undoDoneItems(item);
			} else if (evtarget=='clear'){
				todoCtrl.clearDoneItems(item);
			}
		});
	}

	function undoDoneItems(doneitem){
		//when checkbox next to done pile item is checked, move it back to TODO's list			
		if (doneitem.ticked) {
			todoCtrl.todos.push({text: doneitem.text, done: false});
			//update localStorage 
			dataStorage.localStorageObj.storeData(todoCtrl.todos);
			dataStorage.localStorageObj.storeDonePile(todoCtrl.donepile);
		} else {
			todoCtrl.donepile.push({text: doneitem.text, done: true});
			//update localStorage 
			dataStorage.localStorageObj.storeDonePile(todoCtrl.donepile);
		}
		showhideDonepile();
	}

	function clearDoneItems(doneitem){
		if (!doneitem.ticked) {
			todoCtrl.donepile.push({text: doneitem.text, done: false});
		}	
		//update localStorage
		dataStorage.localStorageObj.storeDonePile(todoCtrl.donepile);
		showhideDonepile();
	}

	function clearDoneList(){
		todoCtrl.donepile = [];
		//update localStorage
		dataStorage.localStorageObj.storeDonePile(todoCtrl.donepile);
		todoCtrl.donepilehide = true;

	}

	function remaining(){
		var count = 0;
		angular.forEach(todoCtrl.todos, function(todo){
			//if this item is 'done:false', add 1 to 'count'
			count += todo.done ? 0 : 1;
		});
		return count; //returns number of not done items
	}
	function showhideDonepile(){
		if (todoCtrl.donepile.length <= 0){
			todoCtrl.donepilehide = true;
		} else {
			todoCtrl.donepilehide = false;
		}
	}

	function removeLocalStorageData(){
		window.confirm('Are you absolutely sure? This will permenantly remove all your saved data for this ToDos list.');
		localStorage.removeItem('todoslist');
		localStorage.removeItem('donelist');

		todoCtrl.donepilehide = true;
	}





}



