var numbers = [10,2,100,302,7,15,200,234,12];


var sorted = [];


for (var i=0; i < numbers.length; i++){
	var num = numbers[i];
	for(var j=sorted.length; j > 0; j-- ){
		if(sorted[j] < num){
			sorted[j+1] = num;
			break;
		}else{
			sorted[j+1] = sorted[j];
		}
	}
}

console.log("sorted",sorted);