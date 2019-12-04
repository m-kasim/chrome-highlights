// Data set
const dictionary = 'data/data.tsv'

// JavaScript is the language of Hell
main();

// Program structure
function main()
{
    // Get dictionary, then parse it.
    getFileContents();
}

// Parse dictionary
async function getFileContents() {

    let response = null;
    //response = await this.getFileContents();

    const url = chrome.runtime.getURL( dictionary );

    response = await fetch(url);

    const text = await response.text();

    this.parse(text);

    return text;
}

// Parse dictionary
function parse(parameter)
{
    let data = parameter.split('\n');

    // Indexes:
    //  [0] - word
    //  [1] - translated meaning
    //  [2] - definition
    //  [3] - example
    //  [4] - synonim (not present on all values)
    let data_split = [];

    for (i = 0; i < data.length; i++)
    {
      data_split.push( data[i].split('\t') );
    }

    // Now search within webpage for these search_words
    search_words(data_split);
}

// Search for words
function search_words(parameter)
{
    let html_dictionary = parameter;

    for (i = 0; i < html_dictionary.length; i++)
    {
        //DEBUG
        //console.log(html_dictionary[i][0]);

        // Strip emojis
        let no_emoji = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
        search_word = html_dictionary[i][0].replace(no_emoji, '')
        // DEBUG
        //console.log("[DEBUG] Without emojis:", search_word);

        // Strip special characters
        let regex_special_characters = /[\(\)*|?]+/g
        search_word = search_word.replace(regex_special_characters, '');

        // Strip whitespace
        let regex_whitespace = /\s+/g;
        search_word = search_word.replace(regex_whitespace, '');
        // DEBUG
        //console.log("[DEBUG] final clean result:", search_word);

        // Filter bad words for HTML
        if(search_word === "script" || search_word === "span")
        {
            continue;
        }

        // Replace words in the HTML
        // g - global (all words)
        // i - case insensitive
        let re = new RegExp("\\b" + search_word + "\\b", "gi");
        //let to = '<mark title="🇧🇬 ' + html_dictionary[i][1] + '. \n ☝️Definition: ' + html_dictionary[i][2] +'" style="cursor: pointer;">✨'+ search_word +'</mark>';
        let to = search_word;

        // Lib: Replacer

        findAndReplaceDOMText(document.body, {
            find: re,
            replace: to,
            wrap: 'mark',
            wrapClass: 'extension_dictionary-word',
            id: 'extension_' + search_word,
            title: '🇧🇬 ' + html_dictionary[i][1] + '\n\n ☝️DEFINITION: ' + html_dictionary[i][2] + '\n\n 🚴‍♂️ EXAMPLE: ' + html_dictionary[i][3],
            style: 'cursor: pointer'
        });


        //document.body.innerHTML = document.body.innerHTML.replace(re, to);
    }

}

// UNUSED
//document.body.style.backgroundColor = 'red';
//document.body.innerHTML = document.body.innerHTML.replace(/renege/g, 'test');
//document.body.textContent = document.body.textContent.replace('renege', 'TEST');
//document.write(html_original);
//document.body.parentElement.textContent.replace(re, to);