module.exports.template = `
    <div>
        <p class = "alert alert-info loading loading-message" ng-if = "loading">{{loadingMessages[loadingMessage]}}</p>
        <p class = "alert alert-warning error loading-error" ng-if = "serverError" ng-cloak>{{mainLoadingErrorMessage}}</p>
        <h2>Hacker News Top Stories</h2>
        <form name = "searchForm">
            <label for "searchField">Enter Search Phrase</label>
            <input 
                type = "text" 
                aria-label="search text"
                ng-model = "searchText"
                name = "searchField"
                class = "form-control main-search"
            >
        </form>
        <div class="story-list-container" ng-show = "!loading">
            <ul class="list-group">
                <li class="list-group-item story-list-item" ng-repeat = "itemNum in topStoriesIndex" data-item-num="{{itemNum}}" ng-show = "items[itemNum].loading || items[itemNum].error || items[itemNum].data.title.toLowerCase().includes(searchText.toLowerCase())">
                        <p class = "story" data-story = "success" ng-if = "items[itemNum].data.url">
                            <a target="_blank" href = "{{items[itemNum].data.url}}">{{ items[itemNum].data.title }}</a>
                        </p>
                        <p class = "story" data-story = "error" ng-if = "items[itemNum].error">
                            could not load data for article #{{itemNum}} 
                            <a 
                                ng-click = "getItem(itemNum); $event.preventDefault();"
                                href="#"
                            >    
                            try again
                            </a>
                        </p>
                        <p class = "story" data-story = "loading" ng-if= "!items[itemNum].error && items[itemNum].loading">{{items[itemNum].loadingMessage}}</p>
                        <p class = "story" data-story = "no-title" ng-if = "!items[itemNum].error && !items[itemNum].loading && !items[itemNum].data.title">
                            No title found for this article.  See <a target="_blank" href="https://news.ycombinator.com/">https://news.ycombinator.com/</a>.
                        </p>
                        <p class = "story" data-story = "no-url" ng-if = "!items[itemNum].error && !items[itemNum].loading && !items[itemNum].data.url">
                            \"{{ items[itemNum].data.title }}\" : No url found for article.   See <a target="_blank" href="https://news.ycombinator.com/">https://news.ycombinator.com/</a>.
                        </p>
                </li>
            </ul>
        </div>
    </div>
`