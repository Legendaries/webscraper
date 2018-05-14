(function() {
    const rp = require('request-promise');
    const cheerio = require('cheerio');

    // TODO: Input url
    const url_base = '';
    const space_char = '%20';

    function removeDuplicates(arr) {
        let temp = new Map();
        arr.forEach(element => temp.set(element, true));
        return Array.from(temp.keys());
    }

    async function scrape(url, fname, lname) {
        let uri = url + fname + space_char + lname;

        const options = {
            uri: uri,
            transform: body => cheerio.load(body),
        };

        let output = JSON.stringify([fname, lname, '', '', '', '', false]);

        let $ = await rp(options);

        try {
            let result = $.parseHTML($.html());
            let json = JSON.parse(result[0].data);
            let results = json.results.result;

            if (results.first.toLowerCase() === fname.toLowerCase() && results.last.toLowerCase() === lname.toLowerCase()) {
                output = JSON.stringify([
                    results.first,
                    results.last,
                    results.class,
                    results.major,
                    results.email,
                    results.phone,
                    true,
                ]);
            }
        } catch (e) {
            console.log(e);
        }

        return output;
    }

    /** Scrapes a specific unnamed web page and returns a list of the names from the roster. */
    async function scrapeUrl(url) {
        const options = {
            uri: url,
            transform: body => cheerio.load(body),
        };

        // Load the HTML Source
        let $ = await rp(options);

        // Gets all span elements with the class txt-blue under the roster id
        let spans = $('#roster').find('span.txt-blue');

        // Maps all the spans to names
        // noinspection JSCheckFunctionSignatures
        let values = spans.text().split('\n')
            .filter(element => element.includes('('))
            .map((element) => element.split('(')[0].trim());

        return removeDuplicates(values);
    }

    async function scrapePerson(person) {
        console.log(`Looking for ${person}`);
        let [fn, ln] = person.split(' ');

        return await scrape(url_base, fn, ln);
    }

    module.exports.url = scrapeUrl;
    module.exports.person = scrapePerson;
}());