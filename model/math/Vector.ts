import { Matrix } from "./Matrix";

export class Vector{
    public comps:number[];
    public dims:number;
    public type: string = "vector";

    constructor(comps:number[]){
        this.comps = comps;
        this.dims = this.comps.length;
    }

    //set the current vector object
    public set(comps:number[]): Vector{
        if(this.dims == this.comps.length){
            this.comps = comps;
        }else{
            throw new Error("DIMError");
        }
        return this;
    }

    //add another vector to the current vector
    public add(vec: Vector): Vector{
        if(this.dims == vec.dims){
            for(var i = 0; i < this.dims; i++){
                this.comps[i] += vec.comps[i];
            }
        }else{
            throw new Error("DIMError");
        }
        return this;
    }

    //adds two vectors of the same dimensions, returns the resultant vector
    public static add(v1:Vector,v2:Vector): Vector{
        //new vector, with initial vectors components
        var newvec: Vector = new Vector(v1.comps);

        if(v1.dims == v2.dims){
            var newveccomps:number[] = [];

            for(var i = 0; i < v1.dims; i++){
                newveccomps[i] = v1.comps[i] + v2.comps[i];
            }

            newvec.set(newveccomps);

            return newvec;
        }else{
            throw new Error("DIMError");
        }
    }

    //get the dot product of two vectors (v1 will act as a column vector) (v2 will act as a row vector)
    public static dot(v1:Vector,v2:Vector){

    }

    //2 vectors multiplied or a vector multiplied by a matrix
    public multiply(k:Vector | Matrix):Vector{
        if(k instanceof Vector){
            if(this.dims == k.dims){
                //should really be doing this as a new component and setting it, but its whatever
                for(var i = 0; i < this.dims; i++){
                    this.comps[i] *= k.comps[i];
                }

                return this;
            }else{  
                throw new Error("DIMError");
            }
        }else if(k instanceof Matrix){
            //column of the first must equal the row of the second
            if(this.dims == k.dims[1]){
                var newvec = new Vector(this.comps);
                var newcomps: number[] = [];

                for(var i = 0; i < k.dims[0]; i++){
                    var newcomp:number = 0;

                    for(var j = 0; j < this.dims; j++){
                        newcomp += this.comps[j] * k.comps[i][j];
                    }

                    newcomps.push(newcomp);
                }

                newvec.set(newcomps);
                this.set(newcomps);

                return newvec;

            }else{
                throw new Error("DIMError");
            }
        }else{
            throw new Error("KError");
        }
    }

    //multiplies a vector with another vector or matrix, returns the resultant vector
    public static multiply(v:Vector,k:Vector | Matrix): Vector{
        if(k instanceof Vector){
            if(v.dims == k.dims){
                var newcomps: number[] = [];

                for(var i = 0; i < v.dims; i++){
                    newcomps[i] = v.comps[i] * k.comps[i];
                }

                var newvec: Vector = new Vector(newcomps);

                return newvec;
            }else{
                throw new Error("DIMError");
            }
        }else if(k instanceof Matrix){
            if(v.dims == k.dims[1]){
                var newcomps: number[] = [];

                for(var i = 0; i < k.dims[0]; i++){
                    var newcomp: number = 0;

                    for(var j = 0; j < v.dims; j++){
                        newcomp += v.comps[j] * k.comps[i][j];
                    }

                    newcomps.push(newcomp);
                }

                var newvec: Vector = new Vector(newcomps);

                return newvec;
            }else{
                throw new Error("DIMError");
            }
        }else{
            throw new Error("KError");
        }
    }

    //gets the distance of the vector from the origin
    public distance():number{
        var length: number = 0;

        for(var i = 0; i < this.comps.length; i++){
            length += this.comps[i] ** 2;
        }

        return Math.sqrt(length);
    }

}