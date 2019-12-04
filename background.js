chrome.runtime.onInstalled.addListener(function()
{
    // Set data to local storage
    chrome.storage.sync.set({color: '#3aa757'}, function()
    {
        console.log('The color is green.');
    });

    // When URL changes
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function()
    {

        // When an URL is loaded
        chrome.declarativeContent.onPageChanged.addRules([{
          // Activation condition
          conditions: [new chrome.declarativeContent.PageStateMatcher( { pageUrl: { hostEquals: 'developer.chrome.com' },}) ],

          // Activate button
          actions: [new chrome.declarativeContent.ShowPageAction()]

        }]);

    });
});
