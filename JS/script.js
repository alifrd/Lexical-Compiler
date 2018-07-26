var Tokens = [] ;
var PlainText = "";
var ClonedPlainText = "";

//Token Structcher
function Token(Row,Col,ST,Name){
	this.Row = Row;
	this.Col = Col;
	this.symboltype = ST;
	this.name = Name;
}

//AJAX Load file
LoadFile = () =>{
	var request = new XMLHttpRequest(); 
	request.open('GET','./Data/data.txt',false ); //(methode,filename,synchoronous )
	request.send();
		if (request.status === 200){
			document.getElementById("input").innerHTML=request.responseText;
		}
		else 
			PlainText =  "ERROR ONE " ;
}

//Mine for Row & Col
var MineTokens = () =>{
	var Row = 1 ; 
	var Col = 1 ;
	var Lastendl = 0 ;
	Repair_plaintext();
	
	for(index in Tokens){

		if (index < 1)
			Col = ClonedPlainText.indexOf(Tokens[index].name) ;
		else
			Col = ClonedPlainText.indexOf(Tokens[index].name , Col) ;
		
		for (var i = 0 , Row = 1; i < Col; i++) {
			if (ClonedPlainText[i]=="\n"){
				Row++;
				Lastendl = i;
			}
		}
		Tokens[index].Row = Row
		Tokens[index].Col = Col - Lastendl ;
	}

}


//Build Tokens
var BuildTokens = () =>{
	Del_Endl();
	window.Syntax_ARR =  PlainText.split(" ");
	Repair_Syntax_Arr();

	for (index in Syntax_ARR){
		Tokens.push(new Token(0,0,"NAN",Syntax_ARR[index]));	
	}
}

//Show Plain Text
var ShowPlainText = () =>{
	document.write(PlainText);
}


var Del_Endl = () =>{
	PlainText = PlainText.replaceAll("\n", " ");
}

//Show Plain Text
var Repair_Syntax_Arr = () =>{
	PlainText.trim();
	for (index in Syntax_ARR){
		Syntax_ARR[index] = Syntax_ARR[index].trim();
	}
}


//Correct Indent
var Repair_plaintext = () =>{
	PlainText = PlainText.replaceAll("(", " ( ");
	PlainText = PlainText.replaceAll(")", " ) ");
	
	PlainText = PlainText.replaceAll("{", " {");
	PlainText = PlainText.replaceAll(",", " ,");
	PlainText = PlainText.toLowerCase();
	PlainText = PlainText.replaceAll("          ", " ");
	PlainText = PlainText.replaceAll("         ", " ");
	PlainText = PlainText.replaceAll("        ", " ");
	PlainText = PlainText.replaceAll("       ", " ");
	PlainText = PlainText.replaceAll("      ", " ");
	PlainText = PlainText.replaceAll("     ", " ");
	PlainText = PlainText.replaceAll("    ", " ");
	PlainText = PlainText.replaceAll("   ", " ");

}

//Replace All Function
String.prototype.replaceAll = function(searchStr, replaceStr) {
    var str = this;
    searchStr = searchStr.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');   
    return str.replace(new RegExp(searchStr, 'gi'), replaceStr);
};

var TypeDefine = () =>{
	var LC ;
	var Identfire = [] ;
	var check;
	for(index in Tokens){
		switch(Tokens[index].name) {
	    case '#include':
	    case 'int':
	    case 'char':
	    case 'string':
	    case 'void':
	    case 'if':
	    case 'else':
	    case 'for':
	    case 'while':
	    case 'cin':
	    case 'cout':
	    case 'get':
	    case 'main':
	    case 'using':
	    case 'namespace':
	    case 'cin.get':
	    	Tokens[index].symboltype = "Key Word" ;
	    	break; 
	    case '=':
	    case '==':
	    case '+':
	    case '++':
	    case '-':
	    case '--':
	    case '/':
	    case '!=':
	    case '!':
	    case '>>':
	    case '<<':
	    	Tokens[index].symboltype = "Oprator" ;
	    	break; 
	    case '(':
	    case ')':
	    case '()':
	    case '<':
	    case '>':
	    case '&':
	    case '&&':
	    case '{':
	    case '}':
	    	Tokens[index].symboltype = "Symbol" ;
	    	break; 
	    case ',':
	    case ';':
	    	Tokens[index].symboltype = "Delimiter" ;
	    	break; 
	    default:
	    	Tokens[index].symboltype = "Unknown";
	    	break;
	    }
	    if(Tokens[index].name[0] == "\"") 
	    	Tokens[index].symboltype = "Litral" ;
	    if(LC == "int" || LC=="char" || LC == "string") {
	    	Tokens[index].symboltype = "identifier" ;
	    	Identfire.push(Tokens[index].name[0]);
	    }
	    if(Identfire.indexOf(Tokens[index].name) !== -1)
	    	Tokens[index].symboltype = "identifier" ;
	    if (/^\d+$/.test(Tokens[index].name)) 
	    		Tokens[index].symboltype = "number" ;
	    	
	    
	    LC = Tokens[index].name;
	}
}

var Clear = () =>{
	document.getElementById("output").value = " ";
}

var Run=() =>{
	PlainText = document.getElementById("input").value;
	ClonedPlainText = document.getElementById("input").value;
	var History ; 
	BuildTokens()
	MineTokens()
	TypeDefine()
	for(index in Tokens){
			History = document.getElementById("output").value;
			document.getElementById("output").value = History.concat("Row:"+Tokens[index].Row+"  Col:"+Tokens[index].Col+"     ( "+Tokens[index].name+" )     Type:"+Tokens[index].symboltype+"\n")
	}
}

