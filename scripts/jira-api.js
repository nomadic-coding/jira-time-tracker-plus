function JiraAPI(baseUrl, apiExtension, username, password, jql) {

    var apiDefaults = {
        type: 'GET',
        url: baseUrl + apiExtension,

        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(username + ':' + password)
        },
        responseType: 'json',
        data: ''
    };

    return {
        login: login,
        getIssue: getIssue,
        getIssues: getIssues,
        getIssueWorklog: getIssueWorklog,
        updateWorklog: updateWorklog,
        changeStatus: changeStatus,
        setProject: setProject,
        setIssue: setIssue,
        getProjectStatuses: getProjectStatuses,
        getTransitions: getTransitions
    };

    function login() {
        var options = {
            headers: {
                'Authorization': 'Basic ' + btoa(username + ':' + password)
            }
        }
        return ajaxWrapper("/", options);
    };

    function getIssue(id, success, error) {
        return ajaxWrapper('/issue/' + id, { success: success, error: error });
    }

    function getIssues(startAt, maxResults, success, error) {
        return ajaxWrapper('/search?jql=' + jql, { success: success, error: error, data: { startAt: startAt, maxResults: maxResults } });
    }

    function getIssueWorklog(id, success, error) {
        return ajaxWrapper('/issue/' + id + '/worklog', { success: success, error: error });
    }

    function changeStatus(id, statusid, success, error) {
        var url = '/issue/' + id + '/transitions';
        var options = {
            type: 'POST',
            data: JSON.stringify({ transition: { id: statusid } }),
            success: success,
            error: Error
        };
        return ajaxWrapper(url, options);
    }

    function updateWorklog(id, timeSpent, date, comment, success, error) {
        var url = '/issue/' + id + '/worklog';
        var options = {
            type: 'POST',
            data: JSON.stringify({
                "started": moment(date).format('YYYY-MM-DDT' + moment().format('HH:mm:ss.SSS') + 'ZZ'),
                "timeSpent": timeSpent,
                "comment": comment
            }),
            success: success,
            error: error
        }
        return ajaxWrapper(url, options);
    }

    function getProjectStatuses(projectName, success, error) {
        var url = "/project/" + projectName + "/statuses";
        var options = {
            type: 'GET',
            success: success,
            error: error
        };
        return ajaxWrapper(url, options);
    }

    function getTransitions(issueid, success, error) {
        var url = "/issue/" + issueid + "/transitions";
        var options = {
            success: success,
            error: Error
        };
        return ajaxWrapper(url, options);
    }

    function ajaxWrapper(urlExtension, optionsOverrides) {

        var options = $.extend(true, {}, apiDefaults, optionsOverrides || {});
        options.url += urlExtension;

        $.ajax({
            url: options.url,
            type: options.type,
            headers: options.headers,
            data: options.data,
            success: function (data) {
                if (options.success)
                    options.success(data);
            },
            error: function (xhr) {
                if (options.error)
                    options.error({
                        response: xhr.response,
                        status: xhr.status,
                        statusText: xhr.statusText
                    });
            }
        });
    }

    function setProject(projectName) {
        if (projectName != "") {
            if (jql.match(/(parent=)/g)) {
                jql = 'assignee=currentUser()';
            }

            if (jql.match(/(project=)/g)) {
                jql = jql.replace(/(project=\').*(\')/i, '$1' + projectName + '$2');
            }
            else {
                if (jql != "" || jql.length < 3)
                    jql += " and project='" + projectName + "' and not status=Done";
                else
                    jql += "project='" + projectName + "' and not status=Done";
            }
        }
    }
    function setIssue(issueName) {
        if (issueName != "") {
            if (jql.match(/(project=)/g)) {
                jql = 'assignee=currentUser()';
            }
            if (jql.match(/(parent=)/g)) {
                jql = jql.replace(/(parent=\').*(\')/i, '$1' + issueName + '$2');
            }
            else {
                if (jql != "" || jql.length < 3)
                    jql += " and parent='" + issueName + "' ORDER BY cf[10003]";
                else
                    jql += "parent='" + issueName + "' ORDER BY cf[10003]";
            }
        }
    }
}
