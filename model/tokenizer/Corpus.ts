export class Corpus{
    public raw_sentences: string[];
    public unique_words: string[] = [];
    constructor(raw_sentences: string[]){
        this.raw_sentences = raw_sentences;

    }

    //generates all the different word pairs and counts what words comes after the pair
    public generatePairCount(){
        var lookuptable: any = {};
        var startingStates: string[][] = [];
        
        for(var i = 0; i < this.raw_sentences.length; i++){
            var corpus = this.raw_sentences[i].split(" "); 
           


            if(corpus[0] === ""){
                corpus.shift();
                corpus.unshift("__START__");
            }else{
                corpus.unshift("__START__") 
            }

            var toremove:number[] = [];

            for(var j = 0; j < corpus.length; j++){
                if(corpus[j].includes("@")){
                    toremove.push(j);
                }
            }

            for(var j = 0; j < toremove.length; j++){
                corpus.splice(toremove[j] - j,1);
            }
            
            var tokenized = corpus
            .map((_, index) => corpus.slice(index, index + 2))
            .filter((group) => {
                return group.length === 2
            });

            startingStates.push(tokenized[0]);


            for(var j = 0; j < tokenized.length; j++){
                if(tokenized[j + 1]){
                    if(lookuptable[tokenized[j] as any]){
                        if(lookuptable[tokenized[j] as any][tokenized[j + 1][1]]){
                            lookuptable[tokenized[j] as any][tokenized[j + 1][1]] += 1;
                        }else{
                            lookuptable[tokenized[j] as any][tokenized[j + 1][1]] = 1;
                        }
                        
                        continue;
                    }
                    
                    lookuptable[tokenized[j] as any] = {};
                    lookuptable[tokenized[j] as any][tokenized[j + 1][1]] = 1;
                }else{
                    if(lookuptable[tokenized[j] as any]){
                        if(lookuptable[tokenized[j] as any]["__END__"]){
                            lookuptable[tokenized[j] as any]["__END__"] += 1;
                        }else{
                            lookuptable[tokenized[j] as any]["__END__"] = 1;
                        }
                        
                        continue;
                    }
    
                    lookuptable[tokenized[j] as any] = {};
                    lookuptable[tokenized[j] as any]["__END__"] = 1;
                }
            }
        }

        lookuptable["STARTING_STATES"] = startingStates;

        return lookuptable;
    }

    //generates all unique words within the corpus
    public getAllUniqueWords(): string[]{
        var tokens:string[] = [].concat(...this.tokenize() as any);

        this.unique_words = [...new Set(tokens)];
        this.unique_words.push("__END__");

        return this.unique_words;
    }

    //converts the whole sentence into individual words
    private tokenize():string[][]{
        var alltokens:string[][] = [];
        for(var i = 0; i < this.raw_sentences.length; i++){
            var sentence = this.raw_sentences[i].split(" ")
            alltokens.push(sentence);
        }

        return alltokens;
       
    }
}