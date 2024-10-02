import { Chess } from "./chess.js";
import { Board } from './board.js';
import { ZobistHash } from "./zobristHash.js";
import { Directions } from "./direction.js";
//自動產生解法
export class Solver {
    //假設已經有了 game 物件
    constructor() {
        this.boardStack = [];
        this.visited = new Set(); //每個棋局有唯一的 hash 值(number型態) ，用來判斷新找的的棋局是否已經搜尋過了
        this.queue = []; //將要搜尋的所有棋局
        //開始解題
        //傳入某個盤面 board
        //傳回解法步驟 path: Board[]
        this.solveIt_ByBoard = (startBoard) => {
            //儲存棋盤狀態所產生的 hash 集合
            this.visited = new Set(); //每個棋局有唯一的 hash 值(number型態) 
            this.queue = []; //將要搜尋的所有棋局
            let index = 0; //逐一指向 queue 的第一個元素 
            //對 startBoard 做複製，避免引響到原本的 board，這個動作很重要！
            let board = startBoard.copy();
            let hash = this.zob.createGameHash(board.chessesPos); //求出起始盤面的 hash 
            board.hash = hash;
            board.fromDir = 0;
            board.fromChessId = -1;
            this.visited.add(hash); //把初始棋局的 hash 加入
            this.queue.push(board); //把初始棋局加入 queue，準備搜尋
            while (index < this.queue.length) {
                let curBoard = this.queue[index]; //取出目前棋局，嘗試移動
                if (curBoard.isGoal()) {
                    // this.findGoal(curBoard,index);
                    return this.findSlovePath(curBoard);
                    break;
                }
                else { //依照目前的 gameState， 搜尋新的 gameState(複數)
                    this.searchEveryChesses(curBoard);
                }
                index++;
            } //while
            return []; //若沒找到
        };
        //對每個棋子移動看看，如果真的可以移動，且尚未搜尋過，那就把新棋局加入等待搜尋的queue佇列
        //每一顆棋子，上下左右動看看
        //注意：不要走回頭路喔
        this.searchEveryChesses = (board) => {
            let hash = board.hash;
            for (let chId = 0; chId < Chess.Total; chId++) {
                for (let dir = 0; dir < 4; dir++) {
                    //這樣的走法，是否走回原本來的路呢？
                    if (this.isGoBackLastBoard(board, chId, dir))
                        continue; //跳過此走法
                    this.tryAddNewBoard(board, chId, dir, hash);
                } //for dir
            } //for chId
        }; //search
        //判斷這樣的走法局是否已經在搜尋範圍內，
        //若尚未搜尋過，那就產生新的棋局，並加入佇列   
        //注意：這裡是遞迴呼叫喔~
        this.tryAddNewBoard = (board, chId, dir, hash) => {
            if (!board.tryMoveIt(chId, dir))
                return;
            //判斷這樣的走法局，是否已經在搜尋範圍內
            let newHash = this.getNewHash(board, chId, dir, hash);
            //若尚未搜尋過，那就
            if (!this.visited.has(newHash)) {
                this.visited.add(newHash);
                //**********鏡像解法只有快幾毫秒，但讓程式變複雜，故不願再使用 ******************/
                // let mirrHash=this.getMirrorHash(board, chId, dir);  //計算此局左右鏡像的 hash 
                // this.visited.add(mirrHash); //把此局左右鏡像的 hash 也存入
                //************************************************************************* */
                //確定要產生新的棋局，並加入佇列   
                let newBoard = this.appendNewBoardToQueue(board, chId, dir, newHash);
                //繼續由這顆棋走看看，能否連續走下去。注意：這裡是遞迴呼叫喔~
                this.continueTryThisChessCanMove(newBoard, chId, dir, newBoard.hash);
            }
        };
        //繼續由這顆棋走看看，能否連續走下去
        this.continueTryThisChessCanMove = (board, chId, dir, hash) => {
            for (let newDir = 0; newDir < 4; newDir++) {
                if (dir + newDir !== 3) { //避免走回原本來的路
                    this.tryAddNewBoard(board, chId, newDir, hash);
                }
            }
        };
        //已經確定這局沒走過，要產生新的棋局，並加入佇列
        this.appendNewBoardToQueue = (board, chId, dir, newHash) => {
            //要保留原始的 board，待會兒還要以此局繼續搜尋先，所以複製成新的 board
            let newBoard = board.copy();
            newBoard.updateBoardData(chId, dir); //移動棋子
            newBoard.hash = newHash; //手動填入新的 hash 值 
            newBoard.parent = board; //手動填入，指向這局的來源
            this.queue.push(newBoard);
            return newBoard;
        };
        //依目前棋局做移動，產生新的 newHash
        this.getNewHash = (curBoard, chId, dir, hash) => {
            let shape = Chess.getShapeType(chId); //這顆棋的幾何形狀
            let pos = curBoard.chessesPos[chId]; //取出原本位置
            let newPos = curBoard.getNewMovePosition(pos, dir); //往dir方向移動後的新座標
            let newHash = this.makeNewHash(pos, newPos, shape, hash);
            return newHash;
        };
        //依棋子的新、舊位置，對原本的 hash 直接做 xor 運算，產生新的 hash
        this.makeNewHash = (pos, newPos, shape, hash) => {
            hash = this.zob.updateHash(pos.y, pos.x, shape, hash); //把舊的擦掉
            hash = this.zob.updateHash(newPos.y, newPos.x, shape, hash); //改成新的
            return hash;
        };
        //此局是否走回原本來的路呢？
        this.isGoBackLastBoard = (board, chessId, dir) => {
            return board.fromChessId === chessId && board.fromDir + dir === 3;
        };
        //秀出通關的走法
        this.findGoal = (board, searchCount) => {
            console.log(`找到出口了！`);
            console.log(`共發現 ${this.queue.length} 種走法，嘗試了前面的 ${searchCount} 次`);
            let path = this.findSlovePath(board);
            console.log(`解法共有 ${path.length - 1} 個步驟，如下====>`);
            this.showSlovePath(path);
        };
        //用回溯法，找出來的路徑
        this.findSlovePath = (board) => {
            let path = [];
            do {
                path.unshift(board);
                //console.log(gs.fromChessId, gs.fromDir);
                if (board.parent === null)
                    break;
                board = board.parent;
            } while (true);
            return path;
        };
        //把路徑印出來
        this.showSlovePath = (path) => {
            let step = 0; //計算共走了幾步
            let lastChessId = -1;
            //注意：i 跳過了 0
            for (let i = 1; i < path.length; i++) {
                let board = path[i];
                let chId = board.fromChessId;
                let dir = board.fromDir;
                let ch = Chess.getChess(chId);
                if (chId !== lastChessId) {
                    step++;
                    lastChessId = chId;
                }
                console.log(`${step}: ${ch.name} -->${Directions.asString(dir)}`);
            }
            console.log(`移動同一顆只算一步的話，共走了 ${step} 步`);
        };
        /*************************************************
        關於鏡像，實驗發現，並沒有比較快，似乎反而慢了幾毫秒
        *************************************************/
        //把此局左右鏡像的 hash 也存入
        this.getMirrorHash = (board, chId, dir) => {
            let mirrHash = this.createMirrorBoardHash(board.chessesPos);
            let shape = Chess.getShapeType(chId); //這顆棋的幾何形狀
            let pos = board.chessesPos[chId];
            let newPos = board.getNewMovePosition(pos, dir); //往dir方向移動後的新座標
            pos = this.mirrorPosition(pos); //改成鏡像位置
            newPos = this.mirrorPosition(newPos); //改成鏡像位置
            mirrHash = this.makeNewHash(pos, newPos, shape, mirrHash);
            return mirrHash;
        };
        //產生鏡像位置
        this.mirrorPosition = (pos) => {
            const RIGHT = Board.ColSize + 1; //5
            return { x: RIGHT - pos.x, y: pos.y };
        };
        //建立左右鏡像棋局，因為只是用來計算 hash，只需設定棋子的鏡像位置即可
        this.createMirrorBoardHash = (chessesPos) => {
            let mirrChessesPos = [];
            for (let i = 0; i < Chess.Total; i++) {
                mirrChessesPos[i] = this.mirrorPosition(chessesPos[i]);
            }
            return this.zob.createGameHash(mirrChessesPos);
        };
        this.zob = new ZobistHash(7, 6, 5); //包含空格，共有5種幾何形狀
    }
    //進入點...
    solve_byLevelString(levelStr) {
        let startBoard = new Board();
        startBoard.loadLevel(levelStr);
        this.solveIt_ByBoard(startBoard);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29sdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsS0FBSyxFQUFHLE1BQU0sWUFBWSxDQUFDO0FBQ3BDLE9BQU8sRUFBRSxLQUFLLEVBQXFCLE1BQU0sWUFBWSxDQUFDO0FBQ3RELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFJNUMsUUFBUTtBQUNSLE1BQU0sT0FBTyxNQUFNO0lBUWYsZ0JBQWdCO0lBQ2hCO1FBUEEsZUFBVSxHQUFZLEVBQUUsQ0FBQztRQUV6QixZQUFPLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQyxDQUFHLCtDQUErQztRQUM5RSxVQUFLLEdBQVksRUFBRSxDQUFDLENBQUksV0FBVztRQWlCbkMsTUFBTTtRQUNOLGNBQWM7UUFDZCxzQkFBc0I7UUFDZixvQkFBZSxHQUFDLENBQUMsVUFBaUIsRUFBUyxFQUFFO1lBQ2hELG9CQUFvQjtZQUNwQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxFQUFVLENBQUMsQ0FBRyw0QkFBNEI7WUFDaEUsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBSSxXQUFXO1lBQy9CLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFJLG9CQUFvQjtZQUV0QywwQ0FBMEM7WUFDMUMsSUFBSSxLQUFLLEdBQUUsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzdCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFHLGVBQWU7WUFDdkUsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDbEIsS0FBSyxDQUFDLE9BQU8sR0FBRSxDQUFDLENBQUM7WUFDakIsS0FBSyxDQUFDLFdBQVcsR0FB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