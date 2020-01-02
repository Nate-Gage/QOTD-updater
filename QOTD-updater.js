const request = require('request')

request({
    headers: {
        'Content-Type': 'application/json',
        'authID': 'NPzUv3AcNcgmA7X6'
    },
    uri: 'http://localhost:3000/quotes/',
    method: 'DELETE'
}, function (err, res, body) {
    if (err) {
        console.log('There was an error deleting documents from database. ' + res.statusCode);
    } else {
        console.log('Initial deletion successful. Received ' + res.statusCode);

        var options = {
            url: 'https://developers.youversionapi.com/1.0/verse_of_the_day?version_id=206',
            headers: {
                'accept': 'application/json',
                'Accept-Language': 'en',
                'x-youversion-developer-token': 'vlDqZNJSCXQMMP5m0GsEMghNwCY',
                'User-Agent': 'nategage'
            }
        };

        function youversionCallback(error, response, body) {
            if (error || response.statusCode != 200) {
                console.log('Error getting data from Youversion.');
            } else {
                var verseJSONArray = JSON.parse(body);

                verseJSONArray.data.forEach(function(item, index) {
                    console.log('I am at object # ' + index);
                    
                    const updatedQuote = {
                        date: item.day,
                        body: item.verse.text,
                        source: item.verse.human_reference
                    }
    
                    const formData = JSON.stringify(updatedQuote)
    
                    request({
                        headers: {
                            'Content-Type': 'application/json',
                            'authID': 'NPzUv3AcNcgmA7X6'
                        },
                        uri: 'http://localhost:3000/quotes/',
                        body: formData,
                        method: 'POST'
                    }, function (err, res, body) {
                        if (err) {
                            console.log('There was an error posting to database. ' + res.statusCode);
                        } else {
                            console.log('Success! Received ' + res.statusCode);
                        }
                    });
                })
                
            }
        }

        request(options, youversionCallback);
    };
});



//module.exports = quoteUpdater

