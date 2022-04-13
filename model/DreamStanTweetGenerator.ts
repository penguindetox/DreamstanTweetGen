import { MarkovChain } from "./MarkovChain";
import _ from 'lodash';
import fs from 'fs-extra';

export interface TweetFile{
    name:string;
    type:string;
    amount:number;
    tweets:string[];
}

export class DreamStanTweetGenerator extends MarkovChain{
    constructor(sentences:string[] = [], modelname:string = ""){
        super(sentences,modelname);
    }

    public createTweet(): string{
        var sentence = "";
        var currentstate: string[] = this.chooseRandomStartingState();
        if(!currentstate){
            var sentencearr = sentence.split(" ");
            sentencearr.shift();
            return sentencearr.join(" ");
        }

        sentence += currentstate.join(" ") + " ";

        while(true){
            var word = this.generateWord(currentstate);

            if(word == "__END__"){
                var sentencearr = sentence.split(" ");
                sentencearr.shift();
                return sentencearr.join(" ");
            }
            if(word.length + sentence.length > 280){
                var sentencearr = sentence.split(" ");
                sentencearr.shift();
                return sentencearr.join(" ");
            }

            sentence += word + " ";
            currentstate = this.getNextState(currentstate,word);

        }
    }

    private getNextState(currentstate:string[],generatedword:string):string[]{
        var newstate: string[] = [];

        newstate.push(currentstate[1]);
        newstate.push(generatedword);
        return newstate;
    }

    private generateWord(curstate:string[]): string{
        var randomnum: number = Math.random();
        var stateindex: number = _.findIndex(this.transition.states,(el): boolean =>{
            return el[0] === curstate[0] && el[1] === curstate[1];
        })

        if(stateindex == -1){
            return "__END__";
        }

        var totalprob: number = 0;
        for(var i = 0; i < this.transition.words.length; i++){
            if(this.transition.comps[stateindex][i] == 0){
                continue;
            }
            if(this.transition.comps[stateindex][i] + totalprob >= randomnum){
                return this.transition.words[i];
            }else{
                totalprob += this.transition.comps[stateindex][i];
            }
        }

        return "";
    }

    public generateTweetsAndSaveToFile(filename:string,amountOfTweets:number):void {
        if(!fs.pathExistsSync("./tweets")){
            fs.mkdirSync("./tweets");
        }
        var alltweets: string[] = [];
        for(var i = 0; i < amountOfTweets; i++){
            var tweet = this.createTweet();

            alltweets.push(tweet);
        }

        fs.writeJSONSync("./tweets/"+filename + ".sky",{"name":filename,"type":"tweets","amount":amountOfTweets,"tweets":alltweets});
        console.log("FINISHED SAVING TWEETS");
    }

    public static loadTweetsFile(filename:string): TweetFile{
        var tweetfile: TweetFile = fs.readJSONSync("./tweets/" + filename + ".sky");
        
        if(tweetfile.type != "tweets"){
            throw new Error("FILEError");
        }


        return tweetfile;
    }
}