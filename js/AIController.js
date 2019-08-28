/*
外部函数 

evaluate(matrix) //评估函数
generateAllNextPossibleMove(matrix, color) //落子位置函数

*/
var cnt_cut = 0, cnt_cut_old=0;
const MIN = Number.NEGATIVE_INFINITY;
const MAX = Number.POSITIVE_INFINITY;

var alpha = Number.NEGATIVE_INFINITY,
	beta = Number.POSITIVE_INFINITY;

var alphaMultiple = 0.1,
	betaMultiple = 10;

var pointCounter = 0, pointCounter_old=0;

//board 当前棋盘, deep 思考步数
var FunctionMaxMin = function(board, color, deep) {
	var best = MIN;
	//console.log(board);
	var boardTemp = StepGenerator.copyAndWrapBoard(board);
	var points = StepGenerator.generateAllNextPossibleMove(boardTemp, color);
	//console.log(points);
	var bestPoints = [];
    //console.log(points);
	console.log("min v2");
	for(var i = 0; i < points.length; i++){
	    var now_point = points[i];
	    //console.log("*** i= " + i);
		boardTemp[now_point[0]+2][now_point[1]+2] = color;         //下子的颜色

		var value = min_2(boardTemp, Math.abs(color-1), best>MIN ? best: MIN, MAX, deep-1);

		pointCounter++;

		if(value == best){
            console.log("Equal: " + value);
			bestPoints.push(now_point);
		}
		else if(value > best){
            console.log("Bigger: " + value);
			best = value;
			bestPoints = [];
			bestPoints.push(now_point);
		}
		else{
			console.log('Smaller:' + value);
		}
        boardTemp[now_point[0]+2][now_point[1]+2] = 'e'; 
        console.log("*** i= " + i + " / " + (pointCounter-pointCounter_old) + " // "+ (cnt_cut-cnt_cut_old) );
        cnt_cut_old=cnt_cut;
        pointCounter_old=pointCounter;
	}
	console.log("搜索节点数："+pointCounter);
	var result = bestPoints[Math.floor(Math.random() * bestPoints.length)];
	if(result == undefined)
		return [];
	return [result[0]+1, result[1]+1]; //此处是为了方便手动下棋，电脑下棋应当把 +1 部分都去掉，直接return result
}

var max_2 = function (board, color, alpha, beta, deep) {
    // if (deep > 1) {
    //     console.log("max deep" + deep);
    //     //console.log("cut: " + cnt_cut);
    // }
    var board_15=board_cnv_15(board);
    if (deep <= 0 || ModuleWinnerCheck.checkWinnerInAiController(board_15, color)) {
        var v = ModuleEvaluate.evaluate(board_15);
        //console.log(deep + " max layer " + v);
        return v;
    }
    var best = MIN;
    var points = StepGenerator.generateAllNextPossibleMove(board, color);
    for (var i = 0; i < points.length; i++) {
        pointCounter++;
        var p = points[i];
        board[p[0] + 2][p[1] + 2] = color;
        var v = min_2(board, Math.abs(color - 1), best>alpha ? best: alpha, beta, deep - 1);
        board[p[0] + 2][p[1] + 2] = 'e';
        if (v > best) {
            best = v;
        }
        if (v> beta) {
            cnt_cut++;
            break;
        }
    }
    return best;
}

var min_2 = function (board, color, alpha, beta, deep) { //在此的board為19*19格式
    // if (deep > 1) {
    //     console.log("min deep" + deep);
    //     console.log("cut: " + cnt_cut);
    // }
    var board_15=board_cnv_15(board); //轉為15*15格式
    //var v = ModuleEvaluate.evaluate(board_15);
    if (deep <= 0 || ModuleWinnerCheck.checkWinnerInAiController(board_15, color)) {  
        var v = ModuleEvaluate.evaluate(board_15);
        //console.log("min layer "+ v);
        return v;
    }
    var best = MAX;
    var points = StepGenerator.generateAllNextPossibleMove(board, color);//啟發式搜索，傳回值為15*15 base
    //console.log("min start for " + deep);
    for (var i = 0; i < points.length; i++) {
        pointCounter++;
        var p = points[i];
        board[p[0] + 2][p[1] + 2] = color;
        var v = max_2(board, Math.abs(color - 1), alpha, best < beta ? best: beta, deep - 1);
        board[p[0] + 2][p[1] + 2] = 'e';
        if (v < best) {
            best = v;
        }
        if (v < alpha) {
            cnt_cut++;
            break; //剪枝
        }      
    }
    return best;
}

var board_cnv_15=function(board){
    var res=[];
    for(let i=2; i<17;i++){
        let arr=[];
        for(let j=2; j<17;j++){
            var b=board[i][j];
            arr.push(b);
        }
        res.push(arr);
    }
    return res;
}

//max函数
//var max = function(board, color, alpha, beta, deep){
//	var v = ModuleEvaluate.evaluate(board);
//	if(deep <= 0 || ModuleWinnerCheck.checkWinnerInAiController(board, color))
//		return v;

//	var best = MIN;
//	var points = StepGenerator.generateAllNextPossibleMove(board, color);

//	for( var i = 0; i < points.length; i++){

//		pointCounter++;

//		var p = points[i];
//		board[p[0]+2][p[1]+2] = color;
//		var v = min(board, Math.abs(color-1), alpha, best > betaMultiple*beta? best : beta, deep-1);
//		board[p[0]+2][p[1]+2] = 'e';
//		if(v > best)
//			best = v;
//		if(v > alpha)  
//			break;
//		//alpha：上一层（min层）的当前最小值，v：当前层（mx层）的下一层的最小值
//		/*我方在当前位置的下子，应当使对方紧接着的下子所产生的优势不超过对方上一步下子所产生的优势*/
//	}

//	return best;
//};

////min函数
//var min = function(board, color, alpha, beta, deep){
//	var v = ModuleEvaluate.evaluate(board);
//	if(deep <= 0 || ModuleWinnerCheck.checkWinnerInAiController(board, color))
//		return v;

//	var best = MAX;
//	var points = StepGenerator.generateAllNextPossibleMove(board, color);

//	for( var i = 0; i < points.length; i++){

//		pointCounter++;

//		var p = points[i];
//		board[p[0]+2][p[1]+2] = color;
//		var v = max(board, Math.abs(color-1), best < alphaMultiple*alpha? best : alpha, beta, deep-1);
//		board[p[0]+2][p[1]+2] = 'e';
//		if(v < best)
//			best = v;
//		if(v < beta)
//			break;
//		//beta：上一层（max层）的当前最大值，v：当前层（min层）的下一层的最大值
//		/*对方在当前位置的下子，应当使我方紧接着的下子所产生的优势超过我方上一步下子所产生的优势*/
//	}

//	return best;
//};

