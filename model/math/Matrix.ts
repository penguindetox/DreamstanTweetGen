import fs from 'fs-extra';

export class Matrix{
    public dims:number[];
    public comps:number[][];
    public type: string = "matrix";

    //set a new matrix
    constructor(comps:number[][]){
        this.comps = comps;

        //for(var i = 0; i < this.comps.length; i++){
        //    if(this.comps[i].length != this.comps[0].length){
        //        throw new Error("DIMError");
        //    }
        //}

        this.dims = [];

        this.dims[0] = this.comps.length;
        this.dims[1] = this.comps[0].length;
    }
    
    
    public static async LoadMatrix(name:string): Promise<Matrix>{
        var matrixfile = await fs.readJSON("./saves/" + name + ".sky");

        if(matrixfile.type != "matrix"){
            throw new Error("FILEError");
        }

        var comps = matrixfile.components;

        return new Matrix(comps);
    }

    public SaveMatrix(filename:string){
        fs.writeFile("./saves/" + filename +".sky",JSON.stringify({"name":"filename","type":"matrix","components":this.comps}));
    }

    //add this matrix to another matrix of the same dimensions
    public add(matrix:Matrix): Matrix{
        if(this.dims[0] == matrix.dims[0]){
            if(this.dims[1] == matrix.dims[1]){
                for(var i = 0; i < this.dims[0]; i++){
                    for(var j = 0; j < this.dims[1]; j++){
                        this.comps[i][j] += matrix.comps[i][j];
                    }
                }
            }else{
                throw new Error("DIMError");
            }
        }else{
            throw new Error("DIMError");
        }

        return this;
    }

    //add two specified matrices of the same dimensions, returns the resultant matrix
    public static add(m1:Matrix,m2:Matrix): Matrix{
        if(m1.dims[0] == m2.dims[0]){
            if(m1.dims[1] == m2.dims[1]){
                var newmatcomps: number[][] = [];
                for(var i = 0; i < m1.dims[0]; i++){
                    for(var j = 0; j < m1.dims[1]; j++){
                        newmatcomps[i][j] = m1.comps[i][j] + m2.comps[i][j];
                    }
                }

                var newmat: Matrix = new Matrix(newmatcomps);

                return newmat;
            }else{
                throw new Error("DIMError");
            }
        }else{
            throw new Error("DIMError");
        }
    }

    //multiplies the matrix with another matrix
    public multiply(m:Matrix){
        if(this.dims[1] == m.dims[0]){
            var matcomps: number[][] = [];

            for(var i = 0; i < this.dims[0]; i++){
                for(var j = 0; j < m.dims[1]; j++){
                    
                }
            }
        }
    }
    //multiplies one matrix with another, outputs the resultant matrix
    public static multiply(m1:Matrix,m2:Matrix): Matrix{
        if(m1.dims[1] == m2.dims[0]){
            var matcomps: number[][] = [];
            for(var i = 0; i < m1.dims[0]; i++){
                var rowcomps: number[] = [];
                for(var j = 0; j < m2.dims[1]; j++){
                   var newcomp:number = 0;
                   for(var k =0; k < m1.dims[1]; k++){
                       console.log(`m1: ${m1.comps[i][k]} m2: ${m2.comps[k][j]}`)
                        console.log("total ",m1.comps[i][k] * m2.comps[k][j]);
                       newcomp += m1.comps[i][k] * m2.comps[k][j];
                   }
                   

                   rowcomps.push(newcomp);
                }

                matcomps.push(rowcomps);
            }

            return new Matrix(matcomps);
        }else{
            throw new Error("DIMError");
        }
    }

    public async save(){

    }
    
}