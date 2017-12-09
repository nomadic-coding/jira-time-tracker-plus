(function () {

    document.addEventListener('DOMContentLoaded', restoreOptions);
    document.getElementById('save').addEventListener('click', saveOptions);

    function saveOptions() {

        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        var baseUrl = document.getElementById('baseUrl').value;
        var apiExtension = document.getElementById('apiExtension').value;
        var jql = document.getElementById('jql').value;
        var itemsOnPage = document.getElementById('itemsOnPage').value;
		var projects = document.getElementById('projects').value;
		var issues = document.getElementById('issues').value;
        var displayType = document.querySelector('input[name="displayType"]:checked').value;

        chrome.storage.sync.set({
            username: username,
            password: password,
            baseUrl: baseUrl,
            apiExtension: apiExtension,
            jql: jql,
            itemsOnPage : itemsOnPage,
			projects : projects,
            issues: issues,
            displayType: displayType
        }, function() {
            var status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(function() {
              status.textContent = '';
            }, 1000);
        });
    }


    function restoreOptions() {

        chrome.storage.sync.get({
            username: '',
            password: '',
            baseUrl: '',
            apiExtension: '/rest/api/2',
            jql: 'assignee=currentUser()',
            itemsOnPage : 10,
			projects : '',
            issues: '',
            displayType: ''
        }, function(items) {
            document.getElementById('username').value = items.username;
            document.getElementById('password').value = items.password;
            document.getElementById('baseUrl').value = items.baseUrl;
            document.getElementById('apiExtension').value = items.apiExtension;
            document.getElementById('jql').value = items.jql;
            document.getElementById('itemsOnPage').value = items.itemsOnPage;
			document.getElementById('projects').value = items.projects;
			document.getElementById('issues').value = items.issues;
            document.querySelector('input[value="'+ items.displayType +'"]').checked = true;
        });
    }
    
})(); 
