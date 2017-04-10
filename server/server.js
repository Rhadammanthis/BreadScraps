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
// var analizeWholeSet;
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

    console.time("call");
    console.time("complete");
    spotifyToken = req.body.spotifyToken
    artist = req.body.artistName
    var artistId = req.body.artistId

    //Checks of the request was a Header with the Spotify API token
    if (!spotifyToken || spotifyToken === "" || spotifyToken === " ")
        res.set('Access-Control-Allow-Origin', '*').status(400).json({ error: { status: 400, message: 'Spotify OAuth Token missing' } })


    //Checks if the request is empty
    if (!artistId || artistId === "" || artistId === " ")
        res.set('Access-Control-Allow-Origin', '*').status(400).json({ error: { status: 400, message: 'Body should have an \'artist\' property' } })

    //Checks if the request specified the result array's size. It's 10 by default
    results = req.body.results ? req.body.results : 10
    factorNoLyrics = req.body.factor_no_lyrics ? (req.body.factor_no_lyrics == 'true') : false
    analyseSize = req.body.analyse_set_size ? req.body.analyse_set_size : 15
    analizeWholeSet = req.body.thorough_analysis ? (req.body.thorough_analysis == 'true') : true

    console.log('Factor no lyrics', factorNoLyrics)

    var options = {
        method: 'GET',
        url: 'https://api.spotify.com/v1/artists/' + artistId + '/albums',
        qs: { album_type: 'album,single', market: 'US' }
    };

    request(options, (error, response, body) => {
        if (error) throw new Error(error);

        var albums = JSON.parse(body).items

        console.time("getSongs");

        async.map(albums, getAlbums, (asyncError, asyncResults) => {
            if (asyncError) {
                res.set('Access-Control-Allow-Origin', '*').status(asyncError.error.status).json(asyncError);
            } else {
                console.log('Total albums: ', asyncResults.length);
                var songs = []
                console.timeEnd("getSongs");
                asyncResults.forEach((album) => {
                    if (album != null)
                        album.songs.forEach((song) => {

                            song.artist = artist
                            songs.push(song)
                        })
                })

                // console.log('Artist:', artist)
                // console.log('Total songs: ', songs.length);
                // console.log('Total non empty songs: ', songs.filter((song) => {
                //     if (song.hasOwnProperty('valence') && song.valence > 0)
                //         return true
                //     return false
                // }).length);
                // console.log('Total real songs: ', _.uniqBy(songs.filter((song) => {
                //     if (song.hasOwnProperty('valence') && song.valence > 0)
                //         return true
                //     return false
                // }), 'name').length);

                console.time("filter");

                var saddestSongs = _.uniqBy(songs.filter((song) => {
                    if (song.hasOwnProperty('valence') && song.valence > 0 && !(song.name.includes("Rmx") || song.name.includes("RMX") || song.name.includes("Remix") || song.name.includes("REMIX") || song.name.includes("Live") || song.name.includes("Reprise")))
                        return true
                    return false
                }), 'name').sort((a, b) => {
                    return a.valence - b.valence;
                })

                console.timeEnd("filter");

                console.timeEnd("call");

                if(analizeWholeSet === false)
                    saddestSongs = saddestSongs.slice(0, analyseSize);

                console.log('Array size: ', saddestSongs.length)

                async.map(saddestSongs, getSaddestSongs, (qError, qResult) => {
                    if (qError)
                        res.json.qResult
                    else {
                        console.timeEnd("complete");
                        res.set('Access-Control-Allow-Origin', '*').status(200).json(qResult.filter((song) => {
                            if (song && song != null)
                                return true
                            return false
                        }).sort((a, b) => {
                            return b.gloomIndex - a.gloomIndex;
                        }).slice(0, results > saddestSongs.length ? saddestSongs.length : results));
                    }
                })

            }
        });

    });
    // });
})

var getAlbums = (album, callback) => {

    var rAlbum = {};
    rAlbum.title = album.name;
    rAlbum.songs = []

    var options = {
        method: 'GET',
        url: 'https://api.spotify.com/v1/albums/' + album.id
    };

    request(options, (error, response, body) => {
        if (error) return callback(error);
        // console.log('===> 3')

        // console.log('========>' + album.name)

        var album = { name: JSON.parse(body).name, imageUrl: JSON.parse(body).images[1].url }
        var songs = JSON.parse(body).tracks.items

        var ids = "";
        songs.forEach((song) => {
            ids += song.id + ","
        })

        // console.log(ids.replace(/,\s*$/, ""))

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

            var songsFeatures = JSON.parse(body);

            if (songsFeatures.audio_features)
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

        if (lyricsArray.response.hits.length > 0) {
            var nFullTitke = normalizeText(lyricsArray.response.hits[0].result.full_title)
            var nSongName = normalizeText(song.name)
            var nSongArtist = normalizeText(song.artist)
            // console.log('%s contains \'%s\' and \'%s\'? %s', nFullTitke, nSongName, nSongArtist, nFullTitke.includes(nSongName))
            if (nFullTitke.includes(nSongName)) {
                jsdom.env(
                    lyricsArray.response.hits[0].result.url,
                    ["http://code.jquery.com/jquery.js"],
                    (err, window) => {
                        song.lyrics = window.$("lyrics").text().replace(/\r?\n|\r/g, ' ').replace(/\[.*?\]/g, '').replace(/\s\s+/g, ' ')
                        if (song.lyrics && song.lyrics !== "" && song.lyrics !== " ") {
                            song = scoreLyrics(song)
                            return callback(null, song)
                        }
                        else {
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
                // song = scoreLyrics(song)
                if (factorNoLyrics === true) {
                    song = scoreLyrics(song)
                    return callback(null, song)
                }
                else
                    return callback(null, null)
            }
        }
        else {
            // song = scoreLyrics(song)
            if (factorNoLyrics === true) {
                song = scoreLyrics(song)
                return callback(null, song)
            }
            else
                return callback(null, null)
        }

    });
}

var loadSadWords = (file) => {
    var sadWords = [];
    var lines = fs.readFileSync(file, 'ascii').split('\r\n');

    lines.forEach((line) => {
        var [term, category, flag] = line.split('\t');

        if ((category == 'sadness') && (flag == 1)) {
            sadWords.push(term);
        }
    });

    console.log('Sadness loaded with ', sadWords.length);

    return sadWords;
}

var sadWords = loadSadWords('NRC-Emotion-Lexicon-Wordlevel-v0.92.txt');

var scoreLyrics = (song) => {

    if (song.lyrics) {
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

        var terms = new tm.Terms(corpus);
        var vocabulary = terms.vocabulary;
        var counts = terms.dtm[0];
        var wordCount = counts.reduce((a, b) => a + b, 0);
        var sadWordCount = 0;

        vocabulary.forEach((word, i) => {
            if (sadWords.indexOf(word) > -1) {
                sadWordCount = sadWordCount + (1 * counts[i]);
            }
        });

        console.log('%s sad out of %s in %s, so thats a %s', sadWordCount, wordCount, song.name, (sadWordCount / wordCount))
        song.pctSad = sadWordCount / wordCount
        song.lyricalDensity = wordCount / song.duration
        song.gloomIndex = ((1 - song.valence) + (song.pctSad * (1 + song.lyricalDensity))) / 2
        // console.log('Gloom index for lyrics %s: %2', song.name, song.gloomIndex)
        return song
    }
    else {
        song.gloomIndex = ((1 - song.valence) + (0.001 * (1 + 0.001))) / 2
        console.log('Gloom index for non lyrics %s: %2', song.name, song.gloomIndex)
        return song
    }
}

var normalizeText = (text) => {
    return text.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, "")
}

var getQueryVariable = (variable) => {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);