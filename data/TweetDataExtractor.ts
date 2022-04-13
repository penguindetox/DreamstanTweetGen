import { TwitterAPIHandler } from "./TwitterAPIHandler";
import fs from 'fs-extra';

export class TweetDataExtractor{
    public static twitterapi: TwitterAPIHandler = new TwitterAPIHandler();
    public async GenerateRawTwitterData(query:string,amount:number):Promise<string>{
        //var rawdata = await fs.readFile()
        var rawfilename = "raw" + query;
        if(rawfilename.includes("#")){
            rawfilename.slice(rawfilename.indexOf("#"),1);
            rawfilename += "tag.txt";

        }else{
            rawfilename += ".txt";
        }
        var result = await TweetDataExtractor.twitterapi.search( query + " -is:retweet",amount);
        var rawtext = "";

        for(var i = 0; i < result.length; i++){
            if(result[i].lang == "en"){
                //if(result[i].text.charAt(0) == "R" && result[i].text.charAt(1) == "T"){
                //    continue;
                //}

                if(result[i].text.includes("fanart") || result[i].text.includes("https://")) continue;
                rawtext += result[i].text + " |/nt ";
            }
        }
        if(!fs.pathExists("./data/raw")){
            fs.mkdirSync("./data/raw");
        }
        fs.writeFileSync("./data/raw/" + rawfilename,rawtext);

        return rawtext;
    }

    private readRawFile(file:string): string{
        var rawfile = fs.readFileSync("./data/raw/" + file);

        return rawfile.toString().toLowerCase();
    }

    public convertRawFileToSentences(file:string):string[]{
        var rawtweets = this.readRawFile(file).split(" |/nt ");

        var sentences: string[] = [];
        for(var i = 0; i < rawtweets.length; i++){
            sentences.push(rawtweets[i].replace(/(\n)/gm, ""));
        }

        return sentences;
    }

    public convertRawfilesIntoSentences(files:string[]): string[]{
        var allsentences: string[] = [];
        for(var i = 0; i < files.length; i++){
            var filesentences:string[] = this.convertRawFileToSentences(files[i]);
           allsentences =  allsentences.concat(filesentences)
        }

        return allsentences;
    }
}