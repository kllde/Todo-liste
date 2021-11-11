window.todo_items = [];
window.loaded_items = [];
window.dom_items = [];

function add_item(id, content){
	var ky = 'todo_'+id;
	window.todo_items = JSON.parse(localStorage.getItem("todo_items"));
    if(window.todo_items == null){
        window.todo_items = [];
    }
    window.todo_items[ky] = {"id": id, "status": 0, "content": content};
    let new_list = JSON.stringify({ ...window.todo_items });
	window.localStorage.setItem("todo_items", new_list);
    refresh_content();
}

function done(id){
    var ky = 'todo_'+id;
	window.todo_items[ky].status = 1;
    let new_list = JSON.stringify({ ...window.todo_items });
	window.localStorage.setItem("todo_items", new_list);
    refresh_content();
}

function trash(id){
    var ky = 'todo_'+id;
	delete window.todo_items[ky];
    delete window.dom_items[ky];
    delete window.loaded_items[ky];
    let new_list = JSON.stringify({ ...window.todo_items });
	window.localStorage.setItem("todo_items", new_list);
    refresh_content();
}

function generate_item(id, status, content){
    if(status){
        return `<div id="todo_${id}" class="card bg-light mb-2 done">
              <div class="card-body">
                  <div class="row">
                      <div class="col-md-8 col-12">
                          <h5 class="card-title text-decoration-line-through">${content}</h5>
                      </div>
                      <div class="col-md-4 col-12 btn-group">
                          <a href="javascript:;" disabled="disabled" onclick="done(${id});" class="disabled btn btn-primary">
    						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
    						  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
    						</svg>
    					  </a>
                          <a href="javascript:;" onclick="trash(${id});" class="btn btn-link text-danger btn-sm">
    						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
    						  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
    						</svg> Delete
    					  </a>
                      </div>
                  </div>
              </div>
            </div>`;
    } else {
        return `<div id="todo_${id}" class="card bg-light mb-2">
              <div class="card-body">
                  <div class="row">
                      <div class="col-md-8 col-12">
                          <h5 class="card-title">${content}</h5>
                      </div>
                      <div class="col-md-4 col-12 btn-group">
                          <a href="javascript:;" onclick="done(${id});" class="btn btn-primary">
    						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
    						  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
    						</svg>
    					  </a>
                          <a href="javascript:;" onclick="trash(${id});" class="btn btn-danger">
    						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
    						  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
    						</svg>
    					  </a>
                      </div>
                  </div>
              </div>
            </div>`;
    }
}

function refresh_content(){
    try {
        var todo_html = "";
        window.dom_items = [];
        for (const [key, value] of Object.entries(window.todo_items)) {
          todo_html += generate_item(value.id, value.status, value.content);
          window.dom_items.push(value.id);
          window.dom_items.push(value.status);
        }
        todo_list.style = "display:block;";
        todo_list.innerHTML = todo_html;
    } catch (e) {
        // do nothing
    }
}

(function(){

	// load items saved in localStorage
    try {
        window.todo_items = JSON.parse(localStorage.getItem("todo_items"));
    } catch (e) {
        window.localStorage.setItem("todo_items", "[]");
    }

    // select form
    const todo_form = document.getElementById('todo_form');

    // select input
    const todo_task = document.getElementById('todo_task');

    // select list
    const todo_list = document.getElementById('todo_list');

	// fetch old items
    refresh_content();

    // check from changes
    setInterval(function(){
        try {
            window.todo_items = JSON.parse(localStorage.getItem("todo_items"));
            var tempo = [];
            try {
                for (const [key, value] of Object.entries(window.todo_items)) {
                  tempo.push(value.id);
                  tempo.push(value.status);
                }
            } catch (e) {
                // do nothing
            }
            window.loaded_items = tempo;
        } catch (e) {
            // do nothing
        }

        // check changes between dom and object
        if(JSON.stringify(window.dom_items) != JSON.stringify(window.loaded_items)){
            refresh_content();
        }
    }, 100);


    // execute on submit
    todo_form.onsubmit = function(event){

        // prevent reload
        event.preventDefault();

        // get the current todo task
        var todo_value = todo_task.value;

        // generate random number ID
        var random_value = Math.floor(Math.random() * (99999999999 - 1111111 + 1)) + 1111111;

        if(todo_value.replace(/\s+/g, '') != ''){

			// add to list and localStorage
			add_item(random_value, todo_value);

			// empty the input
            todo_task.value = "";
            document.getElementById('alerts').innerHTML = "";
        } else {
            document.getElementById('alerts').innerHTML = `<div class="alert alert-danger mt-3 pt-1 pb-1">Please write something..</div>`;
        }

    };

})();
