import { Matrix } from "./math/Matrix";

export class TransitionMatrix extends Matrix{
    public startstates:string[][];
    public states:string[][];
    public words:string[];

    constructor(startstates:string[][],states:string[][],words:string[],p:number[][]){
        super(p);
        this.startstates = startstates;
        this.words = words;
        this.states = states;
    }

    public toString(){
        var fulltext = "";
        var topline = "";

        for(var i = 0; i < this.words.length; i++){
            topline += "      " + this.words[i];
        }

        topline += "\n";
        fulltext += topline;

        for(var i = 0; i < this.states.length; i++){
            var mainstr = "";

            mainstr += this.states[i].join("_");

            for(var j =0; j < this.comps[i].length; j++){
                mainstr +=  "   " + String(this.comps[i][j]);
            }

            mainstr += "\n";

            fulltext += mainstr;
        }




        return fulltext;
    }
}