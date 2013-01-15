
function viewUserProfile(s, screenName) {
    return "tweetbot:///user_profile/" + screenName;
}

var actions = [
    [/https?:\/\/twitter\.com\/intent\/tweet\?.*in_reply_to=(\d+)/, "tweetbot:///post?in_reply_to_status_id"],
    [/https?:\/\/twitter\.com\/intent\/retweet\?tweet_id=/, "tweetbot:///retweet/"],
    [/https?:\/\/twitter\.com\/intent\/favorite\?tweet_id=/, "tweetbot:///favorite/"],
    [/https?:\/\/twitter\.com\/intent\/user\?screen_name=/, "tweetbot:///user_profile/"],
    [/https?:\/\/twitter\.com\/intent\/user\?user_id=/, "tweetbot:///user_profile/"],
    [/https?:\/\/twitter\.com\/\w+\/statuse?s?\//, "tweetbot:///status/"],
    [/https?:\/\/twitter\.com\/(\w+)$/, viewUserProfile]
]

// POST parameters not yet parseable in Stable Chrome Channel.
// [/https?:\/\/twitter\.com\/i\/user\/follow\?(.*)/, follow],
/*
function follow(s, query) {
    console.log(query);
    user_id = getQueryStringValue(query, 'user_id');
    return "tweetbot:///follow/" + user_id;
}

function getQueryStringValue(query, key) {
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
}
*/

// Search URL scheme not yet supported by Tweetbot for Mac.
// [/https?:\/\/twitter\.com\/search\?q=(\w+)&/, search],
/*
function search(s, query) {
    return "tweetbot:///search?query=" + query;
}
*/

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        console.log(details.requestBody);
        url = details.url;
        console.log(url);
        var i = 0;
        for (i in actions) {
            action = actions[i];
            regex = action[0];
            replacement = action[1];
            if (regex.test(url)) {
                url = url.replace(regex, replacement);
                break;
            }
        }

        return { redirectUrl: url };
    },
    {urls: ["*://*.twitter.com/*"]},
    ["blocking"]
);

