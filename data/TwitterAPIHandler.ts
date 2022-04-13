import TwitterAPI from 'twitter-api-v2';
import fs from 'fs-extra';

export class TwitterAPIHandler{
    public twitter: TwitterAPI;
    constructor(){
        var file = fs.readJSONSync("./data/raw/apiconfig.json");
        this.twitter = new TwitterAPI({"appKey":file.API_KEY,"appSecret":file.API_SECRET, accessToken:file.ACCESS_TOKEN_KEY,accessSecret:file.ACCESS_TOKEN_SECRET});
        
    }

    public async tweet(status:string){
        var tweet = await this.twitter.readWrite.v2.tweet(status);

        return tweet;
    }

    public async search(query:string,amount:number){
        var intial = await (await this.twitter.readWrite.search(query,{"tweet.fields":["lang"]})).fetchLast(amount)
        
        return intial.tweets;
    }
}