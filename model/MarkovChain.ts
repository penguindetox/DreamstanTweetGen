import { Corpus } from "./tokenizer/Corpus";
import { TransitionMatrix } from "./TransitionMatrix";
import fs from 'fs-extra';

export interface MarkovChainModel{
    name: string;
    states:string[][];
    words:string[];
    p:number[][];
    sentences:string[];
    startingStates:string[][];
}

export class MarkovChain{
    public transition: TransitionMatrix;
    public corpus: Corpus;

    constructor(sentences:string[] = [],modelname:string = ""){
        if(modelname == ""){
            this.corpus = new Corpus(sentences);
            this.transition = this.compile();
        }else{
            var model = MarkovChain.loadModel(modelname);
            this.corpus = new Corpus(model.sentences);
            this.transition = new TransitionMatrix(model.startingStates,model.states,model.words,model.p);
        }

    }

    public chooseRandomStartingState():string[]{
        return this.transition.startstates[Math.floor(Math.random() * this.transition.startstates.length)];
    }

    public saveModel(name:string){
        if(!fs.pathExistsSync("./models")){
            fs.mkdirSync("./models");
        }
        fs.writeFileSync(`./models/${name}.sky`,JSON.stringify({name:name,"type":"markov",startingStates:this.transition.startstates,states:this.transition.states,words:this.transition.words,p:this.transition.comps,sentences:this.corpus.raw_sentences}))
    }

    public static loadModel(name:string): MarkovChainModel{
        var file = fs.readJSONSync(`./models/${name}.sky`);
        if(file.type != "markov"){
            throw new Error("FILEError");
        }

        return file;
    }

    private compile(): TransitionMatrix{
        var count = this.corpus.generatePairCount();
        var allrawstates = Object.keys(count);

        var allstates:string[][] = [];
        var p: number[][] = [];

        var uniquewords = this.corpus.getAllUniqueWords();

        for(var i = 0; i < allrawstates.length; i++){
            if(allrawstates[i] == "STARTING_STATES") continue;
            var header = allrawstates[i].split(",");
            allstates.push(header);

            var rawstatekeys = Object.keys(count[allrawstates[i]])
            var rawstatetotal: number = 0;

            for(var j = 0; j < rawstatekeys.length; j++){
                rawstatetotal += count[allrawstates[i]][rawstatekeys[j]];
            }
           
            var row: number[] = [];
            for(var j = 0; j < uniquewords.length; j++){
                
                if(count[allrawstates[i]][uniquewords[j]]){
                    row.push(count[allrawstates[i]][uniquewords[j]] / rawstatetotal);
                }else{
                    row.push(0);
                }
            }
            //for(var j =0; j < )
            p.push(row);
            
        }

        console.log("FINISHED COMPILING MODEL");
        return new TransitionMatrix(count["STARTING_STATES"],allstates,uniquewords,p);
    }
}