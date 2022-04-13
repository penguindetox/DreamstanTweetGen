import { TwitterAPIHandler } from "../data/TwitterAPIHandler";
import { setIntervalAsync } from "set-interval-async/dynamic";
import fs, { stat } from 'fs';
import { DreamStanTweetGenerator } from "../model/DreamStanTweetGenerator";

var api = new TwitterAPIHandler();
var tweetfile = DreamStanTweetGenerator.loadTweetsFile('v2dreamstantweets');

function getTweetFromFile():any{
    var randomNum = Math.floor(Math.random() * tweetfile.amount);

    var sentTweet = false;

    var tweet = tweetfile.tweets[randomNum];

    if(tweet.includes('@')){
        return getTweetFromFile()
    }


    
    api.tweet(tweet);
    

}

getTweetFromFile();

//api.tweet()

setIntervalAsync(() =>{
    getTweetFromFile();
},900000); 

