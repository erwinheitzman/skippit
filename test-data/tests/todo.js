// #1b: import the page object class instance
const todoPage = require('../pages/todo.page');
const firstTodo = new todoPage.Todo('first todo');
const secondTodo = new todoPage.Todo('second todo');
const thirdTodo = new todoPage.Todo('third todo');
const fourthTodo = new todoPage.Todo('fourth todo');
const editedTodo = new todoPage.Todo('edited todo');

let isMobileEmulated;

describe('todo app', () => {
	before(() => {
		// #2: add navigation to http://todomvc.com/examples/vanillajs/
		todoPage.open();

		isMobileEmulated = browser.options.capabilities['goog:chromeOptions']
			&& browser.options.capabilities['goog:chromeOptions'].mobileEmulation;
	});
	beforeEach(() => {
		// #3: use the `execute` command to clear the localStorage and then refresh the page
		browser.execute(() => localStorage.clear());
		browser.refresh();
	});

	// #4:
	it('create todo', () => {
		// create todo item
		todoPage.createTodo('first todo');

		// assert 1 item in list

        /**
         * assert the todo count
         */
		browser.waitUntil(() => todoPage.todos.length === 1);

        /**
         * asserting the text containing the total todo's left
         */
		browser.waitUntil(() => todoPage.count.getText() === '1');

		// assert list contains the input item
		firstTodo.self.waitForExist();
	});

	// #5:
	it('edit todo', () => {
		// create a todo item
		todoPage.createTodo('first todo');

		// edit the created todo item
		todoPage.editTodo(firstTodo, 'edited todo');

		// // assert changed item in text in todo item
		editedTodo.self.waitForExist();
	});

	// #6:
	it('delete todo', () => {
		// create 2 todo items
		todoPage.createTodo('first todo');
		todoPage.createTodo('second todo');

		// delete first todo item
		if (isMobileEmulated) {
			firstTodo.self.click();
		} else {
			firstTodo.self.moveTo();
		}
		firstTodo.deleteButton.waitForDisplayed();
		firstTodo.deleteButton.click();

		// assert 1 item in todo list
		browser.waitUntil(() => todoPage.todos.length === 1);

		// assert todo text equals second input todo item
		secondTodo.self.waitForExist();
	});

	// #7:
	it('complete one todo', () => {
		// create 2 todo items
		todoPage.createTodo('first todo');
		todoPage.createTodo('second todo');

		// complete first todo item
		firstTodo.completeToggle.click();

		// assert first todo item has class completed
		browser.waitUntil(() => firstTodo.isCompleted());
	});

	// #8:
	it('show active/completed todos', () => {
		// create 2 todo items
		todoPage.createTodo('first todo');
		todoPage.createTodo('second todo');

		// complete first todo item
		firstTodo.completeToggle.click();

		// when click on show active
		todoPage.filter.active.click();

		// assert todo text equals second input todo item
		secondTodo.self.waitForExist();

		// when click on show completed
		todoPage.filter.completed.click();

		// assert todo text equals first input todo item
		firstTodo.self.waitForExist();
	});

	// #9:
	it('complete all todos', () => {
		// create 4 todo items
		todoPage.createTodo('first todo');
		todoPage.createTodo('second todo');
		todoPage.createTodo('third todo');
		todoPage.createTodo('fourth todo');

		// complete all todo items
		// todoPage.toggleCompleteAll.click();

		// assert 4 todo items completed
		browser.waitUntil(() => firstTodo.isCompleted());
		browser.waitUntil(() => secondTodo.isCompleted());
		browser.waitUntil(() => thirdTodo.isCompleted());
		browser.waitUntil(() => fourthTodo.isCompleted());
	});

	// #10:
	it('delete all completed todos', () => {
		// create 4 todo items
		todoPage.createTodo('first todo');
		todoPage.createTodo('second todo');
		todoPage.createTodo('third todo');
		todoPage.createTodo('fourth todo');

		// complete all todo items
		todoPage.toggleCompleteAll.click();

		// delete all completed items
		// todoPage.clearAllCompleted.click();

		// assert 0 todo items in todo list
		browser.waitUntil(() => todoPage.todos.length === 0);
	});

	// #11:
	it('add custom command to the Browser object', () => {
		// add a custom command to the Browser object
		browser.addCommand('removeAsideElement', function () {
			$('aside').waitForExist();
			browser.execute((sideElement) => sideElement.remove(), $('aside'));
			$('aside').waitForExist(null, true);
		});

		// use the command
		browser.removeAsideElement();
	});

	// #12:
	it('add custom command to the Element object', () => {
		// add a custom command to the Element object
		browser.addCommand('removeAsideElement', function () {
			this.waitForExist();
			browser.execute((sideElement) => sideElement.remove(), this);
			this.waitForExist(null, true);
		}, true);

		// use the command
		$('aside').removeAsideElement();
	});
});