(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports.template = `
    <div>
        <p class = "alert alert-info loading" ng-show = "loading">loading</p>
        <h2>Hacker News Top Stories</h2>
        <form name = "searchForm">
            <label for "searchField">Enter Search Phrase</label>
            <input 
                type = "text" 
                aria-label="search text"
                ng-model = "searchText"
                name = "searchField"
                class = "form-control"
            >
        </form>
        
        <ul class="list-group">
            <li class="list-group-item" ng-repeat = "itemNum in topStoriesIndex" ng-show = "items[itemNum].data.title.toLowerCase().includes(searchText.toLowerCase())">
                    <p>
                        Placeholder for article #{{itemNum}}.  Loading: {{items[itemNum].loading}}. Error: {{items[itemNum].error}}
                    </p>
                    <p class = "story" ng-show = "items[itemNum].data.url">
                        <a target="_blank" href = "{{items[itemNum].data.url}}">{{ items[itemNum].data.title }}</a>
                    </p>
                    <p class = "story" ng-show = "items[itemNum].error">
                        could not load data for article #{{itemNum}} 
                        <a 
                            ng-click = "getItem(itemNum); $event.preventDefault();"
                            href="#"
                        >    
                        try again
                        </a>
                    </p>
                    <p class = "story" ng-show = "!items[itemNum].error && items[itemNum].loading">
                        loading...
                    </p>
                    <p class = "story" ng-show = "!items[itemNum].error && !items[itemNum].loading && !items[itemNum].data.title">
                        No title found for this article.  See <a target="_blank" href="https://news.ycombinator.com/">https://news.ycombinator.com/</a>.
                    </p>
                    <p class = "story" ng-show = "!items[itemNum].error && !items[itemNum].loading && !items[itemNum].data.url">
                        \"{{ items[itemNum].data.title }}\" : No url found for article.   See <a target="_blank" href="https://news.ycombinator.com/">https://news.ycombinator.com/</a>.
                    </p>
            </li>
        </ul>
    </div>
`
},{}],2:[function(require,module,exports){
let template = require("./hacker-news-search-template").template;


angular.module("hackerNewsSearchApp",[])
.directive("hackerNewsSearch", function() {
    return {
        template: template,
        controller : ["$scope", "$q", "hackerNewsService", function($scope, $q, hackerNewsService) {

            $scope.loading = true;
            $scope.topStoriesIndex = [];
            $scope.items = {};
            $scope.searchText = "";

            $scope.getItem = function(id) {
                $scope.items[id] = {};
                $scope.items[id].loading = true;
                $scope.items[id].error = false;
                hackerNewsService.getStory(id)
                    .then((response) => {
                        if (response.status == "SUCCESS") {
                            $scope.items[id].data = response.data;
                            $scope.items[id].loading = false;
                        } else {
                            $scope.items[id].loading = false;
                            $scope.items[id].error = true;
                        }
                    });
            }

            hackerNewsService.getTopStoriesIndex()
            .then((response)=>{
                let promises = [];
                $scope.topStoriesIndex = response.topStoriesIndex;
                $scope.topStoriesIndex.forEach((id) => {
                    promises.push(
                        $scope.getItem(id)
                    );
                });
                $q.all(promises)
                .then(()=>{
                    $scope.loading = false;
                })
            })

        }]
    }
})

require("./hacker-news-service");
},{"./hacker-news-search-template":1,"./hacker-news-service":3}],3:[function(require,module,exports){
angular.module("hackerNewsSearchApp")
.service("hackerNewsService", ["$http", "$q", function($http, $q) {
    this.itemNumbers = [];
    this.items = {};
    let self = this;
    function getItemUrl (itemNum) {
        return `https://shaky-hacker-news.herokuapp.com/item/${itemNum}`;
    }
    self.getStory = function (itemNum) {
        let url = getItemUrl(itemNum);
        let deferred = $q.defer();
        $http.get(url)
        .then(response => {
            if (response.status == 200) {
                deferred.resolve({
                    status : "SUCCESS",
                    data : response.data
                })
            } else {
                deferred.resolve({
                    status : "FAIL",
                })
            }
        }).catch(()=>{
            deferred.resolve({
                status : "FAIL",
            })
        })
        return deferred.promise;
    }
    self.topStoriesUrl = "https://shaky-hacker-news.herokuapp.com/topstories";
    
    self.getTopStoriesIndex = function() {
        let deferred = $q.defer();
        $http.get(self.topStoriesUrl)
        .then(function (response) {
            if (response.status == 200) {
                deferred.resolve({
                    status : "SUCCESS",
                    topStoriesIndex : response.data.slice(0, 100)
                })
            } else {
                deferred.resolve({
                    status : "FAIL",
                    topStoriesIndex : []
                })
            }
        })
        .catch(function() {
            deferred.resolve({
                status : "FAIL",
                topStoriesIndex : []
            })
        })
        return deferred.promise;
    }

}]);
},{}]},{},[2]);
