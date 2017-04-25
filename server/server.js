var request = require("request")
var async = require('async');
var _ = require("lodash");
var jsdom = require("jsdom");
var tm = require('text-miner');
var fs = require('fs');
// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

//Auxiliar variables to process Search request
var spotifyToken;
var tokenExpired = false;
var analizeWholeSet;
var factorNoLyrics;
var results;
var analyseSize;

var client_id = '749748f5ea93499ea4177c896e6adef8'; // Your client id
var client_secret = '987de9323c0140cbbc2005bd29d73d54'; // Your secret

router.post('/auth', (req, res) => {

    var code = req.body.code

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'http://localhost:3000/auth'
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {

            // use the access token to access the Spotify Web API
            var token = body.access_token;
            res.set('Access-Control-Allow-Origin', '*').status(200).json(body)
        }
        else{
            res.set('Access-Control-Allow-Origin', '*').send(response)
        }
    });
})

router.post('/refresh', (req, res) => {

    var token = req.body.token

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token: token
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {

            res.set('Access-Control-Allow-Origin', '*').status(200).json(body)
        }
    });
})


router.post('/getSaddestSongs', (req, res) => {

    //extracts the Spotify token, artist id and artist name from the request body
    spotifyToken = req.body.spotifyToken
    artist = req.body.artistName
    var artistId = req.body.artistId

    //Checks of the request was a Header with the Spotify API token
    if (!spotifyToken || spotifyToken === "" || spotifyToken === " ")
        res.set('Access-Control-Allow-Origin', '*').status(400).json({ error: { status: 400, message: 'Spotify OAuth Token missing' } })


    //Checks if the request is empty
    if (!artistId || artistId === "" || artistId === " ")
        res.set('Access-Control-Allow-Origin', '*').status(400).json({ error: { status: 400, message: 'Body should have an \'artist\' property' } })

    //Checks if additional parameters where included in the URL
    results = req.body.results ? req.body.results : 10
    factorNoLyrics = req.body.factor_no_lyrics ? (req.body.factor_no_lyrics == 'true') : false
    analyseSize = req.body.analyse_set_size ? req.body.analyse_set_size : 15
    analizeWholeSet = req.body.thorough_analysis ? (req.body.thorough_analysis == 'true') : true

    //Prepares the request to get all the artist's albums
    var options = {
        method: 'GET',
        url: 'https://api.spotify.com/v1/artists/' + artistId + '/albums',
        qs: { album_type: 'album,single', market: 'US' }
    };

    request(options, (error, response, body) => {
        if (error) throw new Error(error);

        var albums = JSON.parse(body).items

        //Async call to get all the songs from every album
        async.map(albums, getAlbums, (asyncError, asyncResults) => {
            if (asyncError) {
                res.set('Access-Control-Allow-Origin', '*').status(asyncError.error.status).json(asyncError);
            } else {

                //Array to gold all retrieved songs
                var songs = []

                //Extracts all the songs from every album
                asyncResults.forEach((album) => {
                    if (album != null)
                        album.songs.forEach((song) => {

                            song.artist = artist
                            songs.push(song)
                        })
                })

                //Discards all songs that have a 'valence' property and that are not remixes or live performances
                var bestCandidates = _.uniqBy(songs.filter((song) => {
                    if (song.hasOwnProperty('valence') && song.valence > 0 && !(song.name.includes("Rmx") || song.name.includes("RMX") || song.name.includes("Remix") || song.name.includes("REMIX") || song.name.includes("Live") || song.name.includes("Reprise")))
                        return true
                    return false
                }), 'name').sort((a, b) => { //Sort the array from lowest to highest valence 
                    return a.valence - b.valence;
                })

                //If true, the array is reduced to the specified size
                if(analizeWholeSet === false)
                    bestCandidates = bestCandidates.slice(0, analyseSize);

                //Async call to get the saddest songs from the search size
                async.map(bestCandidates, getSaddestSongs, (qError, qResult) => {
                    if (qError)
                        res.send(qError)
                    else {

                        //Filters all the empty objects out, arranges the items from highest
                        //to lowest Gloom Index and slices the array at the specified size 
                        res.set('Access-Control-Allow-Origin', '*').status(200).json(qResult.filter((song) => {
                            if (song && song != null)
                                return true
                            return false
                        }).sort((a, b) => {
                            return b.gloomIndex - a.gloomIndex;
                        }).slice(0, results > bestCandidates.length ? bestCandidates.length : results));
                    }
                })
            }
        });
    });
})

var getAlbums = (album, callback) => {

    var rAlbum = {};
    rAlbum.title = album.name;
    rAlbum.songs = []

    //Prepares the request to get all the songs from an album
    var options = {
        method: 'GET',
        url: 'https://api.spotify.com/v1/albums/' + album.id
    };

    request(options, (error, response, body) => {
        if (error) return callback(error);

        //Saves the album info
        var album = { name: JSON.parse(body).name, imageUrl: JSON.parse(body).images[1].url }

        //Creates an array with all the retrieved songs
        var songs = JSON.parse(body).tracks.items

        //Concats the song's id into a single string
        var ids = "";
        songs.forEach((song) => {
            ids += song.id + ","
        })

        //Prepares a request to get the audio features of all the songs
        var options = {
            method: 'GET',
            url: 'https://api.spotify.com/v1/audio-features?ids=' + ids,
            headers:
            {
                authorization: 'Bearer ' + spotifyToken,
                accept: 'application/json'
            }
        };

        request(options, function (error, response, body) {
            if (error) return callback(error);

            //Creates and object with all the results
            var songsFeatures = JSON.parse(body);

            //Checks if the results are valid
            if (songsFeatures.audio_features)

                //Extracts the necessary info from each song
                songsFeatures.audio_features.forEach((features, i) => {
                    var songData = {}
                    songData.name = songs[i].name;
                    songData.id = songs[i].id;
                    songData.duration = songs[i].duration_ms / 1000;
                    songData.valence = features.valence
                    songData.album = album
                    songData.externalUrl = songs[i].external_urls.spotify;

                    rAlbum.songs.push(songData)
                })

            if (songsFeatures.error)
                if (songsFeatures.error.status === 401)
                    return callback(songsFeatures)

            return callback(null, rAlbum)
        });

    });
}

var getSaddestSongs = (song, callback) => {

    //Prepare request to search for the song's lyrics
    var options = {
        method: 'GET',
        url: 'https://api.genius.com/search',
        qs: { q: song.name + ' ' + song.artist },
        headers:
        {
            authorization: 'Bearer r6Iqkw0s2aZkGRnW0q0Ug7IogdTLTFt3Yi9lgT_F2Tk82mjy-CfozS4laU2SEPEd'
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        var lyricsArray = JSON.parse(body)

        //If lyrics were retrieved
        if (lyricsArray.response.hits.length > 0) {

            //Instnace of the normalized track title, artist name and the lyric's full title
            var nFullTitke = normalizeText(lyricsArray.response.hits[0].result.full_title)
            var nSongName = normalizeText(song.name)
            var nSongArtist = normalizeText(song.artist)

            //Checks if the lyric's indeed belong to the searched song
            if (nFullTitke.includes(nSongName)) {

                //Use the Jsdom module to extract the lyrics from the lyric's URL
                jsdom.env(
                    lyricsArray.response.hits[0].result.url,
                    ["http://code.jquery.com/jquery.js"],
                    (err, window) => {

                        //Extracts the text from the 'lyrics' tag and removes the extra spaces, tabs and line jumps
                        song.lyrics = window.$("lyrics").text().replace(/\r?\n|\r/g, ' ').replace(/\[.*?\]/g, '').replace(/\s\s+/g, ' ')

                        //Checks if there are still lyrics
                        if (song.lyrics && song.lyrics !== "" && song.lyrics !== " ") {

                            //Rates the song
                            song = scoreLyrics(song)
                            return callback(null, song)
                        }
                        else {

                            //Checks if even though there are no lyrics, the song should be rated 
                            if (factorNoLyrics === true) {
                                song = scoreLyrics(song)
                                return callback(null, song)
                            }
                            else
                                return callback(null, null)
                        }
                    }
                );
            }
            else {

                //Checks if even though there are no lyrics, the song should be rated
                if (factorNoLyrics === true) {
                    song = scoreLyrics(song)
                    return callback(null, song)
                }
                else
                    return callback(null, null)
            }
        }
        else {
            
            //Checks if even though there are no lyrics, the song should be rated
            if (factorNoLyrics === true) {
                song = scoreLyrics(song)
                return callback(null, song)
            }
            else
                return callback(null, null)
        }

    });
}

// Loads the words rated as 'sad' from the Lexicon into an array
var loadSadWords = () => {
    var sadWords = [];
    var lines = fs.readFileSync('NRC-Emotion-Lexicon-Wordlevel-v0.92.txt', 'ascii').split('\r\n');

    lines.forEach((line) => {
        var [term, category, flag] = line.split('\t');

        if ((category == 'sadness') && (flag == 1)) {
            sadWords.push(term);
        }
    });

    return sadWords;
}

var sadWords = loadSadWords();

//Calculates a certain song's Gloom Index 
var scoreLyrics = (song) => {

    //Checks if the song has lyrics
    if (song.lyrics) {

        //Creates a corpus with the every word from the lyrics using the Text Miner module
        var text = song.lyrics.replace(/\(|\)|:|\'/g, '');
        var corpus = new tm.Corpus([]);
        corpus.addDoc(text);
        corpus
            .clean()
            .removeNewlines()
            .removeInterpunctuation()
            .removeInvalidCharacters()
            .removeWords(tm.STOPWORDS.EN)
            .toLower()
            .stem('Lancaster');

        //Parses the corpus into an array called vocabulary
        var terms = new tm.Terms(corpus);
        var vocabulary = terms.vocabulary;

        //Counts how many words there are in the lyrics
        var counts = terms.dtm[0];
        var wordCount = counts.reduce((a, b) => a + b, 0);

        var sadWordCount = 0;

        vocabulary.forEach((word, i) => {
            
            //Checks if a word is in the sadWords array
            if (sadWords.indexOf(word) > -1) {
                sadWordCount = sadWordCount + (1 * counts[i]);
            }
        });

        //Caluclates the pecentage of sad words in the lyrics
        var pctSad = sadWordCount / wordCount

        //Calculated the lyrical density of the song
        var lyricalDensity = wordCount / song.duration

        //Calculates the song's Gloom Index
        song.gloomIndex = ((1 - song.valence) + (pctSad * (1 + lyricalDensity))) / 2
        // console.log('Gloom index for lyrics %s: %2', song.name, song.gloomIndex)

        delete song.lyrics;
        delete song.duration; 
        delete song.valence;
        
        return song
    }
    else {
        //if there where no lyrics, we asign an low arbitrary value to the necessary
        //parameters to calculate the song's Gloom Index
        song.gloomIndex = ((1 - song.valence) + (0.001 * (1 + 0.001))) / 2
        
        return song
    }
}


//Removes special characters from a string and turns it to lower case
var normalizeText = (text) => {
    return text.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, "")
}

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);