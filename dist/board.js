import { Chess } from "./chess.js";
import { Dirs } from "./direction.js";
import * as Tools from "./Tools.js";
//專供運算的 board
export class Board {
    //讀入棋子的初始位置(二維座標)
    constructor() {
        this.fromChessId = -1;
        this.fromDir = 0;
        this.hash = 0;
        this.chessesPos = [];
        this.boardMap = [];
        this.parent = null;
        //讀入棋子位置，重新布局
        this.loadLevel = (levelStr) => {
            this.chessesPos = this.levelStringToPositions(levelStr);
            this.initBoardMap();
            this.putAllChesses(); //使用 chessesPos 來放入棋子
        };
        //移動時的主程式 move Main
        //嘗試把棋子朝dir方向移動
        this.move = (chessId, dir) => {
            let ok = this.tryMoveIt(chessId, dir);
            if (ok) {
                this.updateBoardData(chessId, dir);
            }
            return ok;
        };
        //判斷某顆棋(chessId)是否能朝此方向(dir)移動
        this.tryMoveIt = (chId, dir) => {
            let ch = Chess.getChess(chId); //取出棋子
            let pos = this.chessesPos[chId]; //取出位置
            let x = pos.x + Dirs[dir].dx;
            let y = pos.y + Dirs[dir].dy;
            //console.log(ch.id, ch.name, Directions.asString(dir));
            //把這顆棋子將移到的範圍做檢查
            return !this.isOverlapOther(chId, ch.rows, ch.cols, x, y);
        };
        //是否可以把某顆棋子移動到 board[r,c] ?
        this.isEmptySafeCell = (chId, r, c) => {
            let targetId = this.boardMap[r][c];
            //是自己的一部份，或是此處為空白
            return (targetId == chId || targetId == Board.Empty);
        };
        //某顆棋子已經確定可以往此方向移動，所以更新 board 的內容
        this.updateBoardData = (chId, dir) => {
            this.eraseChess(chId); //刪除原本在 board 裡的資訊
            this.updateChessPosition(this.chessesPos, chId, dir); //更新位置
            this.putChess(chId); //填入新的在 board 裡的資訊
            this.fromChessId = chId;
            this.fromDir = dir;
            //this.hash 尚未處理！若有解題的需要，請由外部來指定
        };
        //已經確定可以移動，此時要更新某一顆棋子移動之後的新座標
        this.updateChessPosition = (chessesPos, chId, dir) => {
            let pos = chessesPos[chId];
            pos.x += Dirs[dir].dx;
            pos.y += Dirs[dir].dy;
        };
        //傳入某顆棋子目前位置，計算移動之後的新座標
        this.getNewMovePosition = (pos, dir) => {
            let newPos = {}; //建立新的 pos
            newPos.x = pos.x + Dirs[dir].dx;
            newPos.y = pos.y + Dirs[dir].dy;
            return newPos;
        };
        //************************************* */
        this.putAllChesses = () => {
            Chess.chesses.forEach(ch => {
                this.putChess(ch.id);
            });
        };
        //********* private function ************ */
        //把某顆棋子所佔的空間填上 fillData
        this.fillChessStatus = (id, fillData) => {
            let pos = this.chessesPos[id];
            let ch = Chess.getChess(id);
            this.fillDataToBoardMap(pos, ch.rows, ch.cols, fillData);
        };
        //把某顆棋子所佔的空間填入 chess.id
        this.putChess = (id) => {
            this.fillChessStatus(id, id);
        };
        //把某顆棋子所佔的空間填入空白
        this.eraseChess = (id) => {
            this.fillChessStatus(id, Board.Empty);
        };
        //曹操孟德是否已經移到出口
        this.isGoal = () => {
            let caoPos = this.chessesPos[0]; //找出曹操
            return caoPos.y === 4 && caoPos.x === 2; //是否在(2,4)的出口位置
        };
        //把 boardMap 的邊緣填入牆壁，棋盤內部填滿空白
        this.initBoardMap = () => {
            this.boardMap = [];
            let boardMap = this.boardMap;
            for (let r = 0; r < Board.RowSize + 2; r++) {
                boardMap.push([]);
                for (let c = 0; c < Board.ColSize + 2; c++) {
                    if (r === 0 || r === Board.RowSize + 1 || c === 0 || c === Board.ColSize + 1) {
                        boardMap[r][c] = Board.Wall;
                    }
                    else {
                        boardMap[r][c] = Board.Empty;
                    }
                }
            }
        };
        //深拷貝 this (board) 物件，並產生新的複製物件
        this.copy = () => {
            let newBoard = new Board();
            newBoard.fromChessId = this.fromChessId;
            newBoard.fromDir = this.fromDir;
            newBoard.hash = this.hash;
            newBoard.parent = this.parent;
            newBoard.chessesPos = Tools.deepCopy(this.chessesPos);
            newBoard.boardMap = Tools.deepCopy(this.boardMap);
            return newBoard;
        };
        this.fromChessId = -1;
        this.fromDir = 0;
        this.hash = 0;
        this.parent = null;
        this.chessesPos = [];
        this.initBoardMap();
    }
    //把這顆棋子所佔的範圍做檢查，看是否與其他區塊重疊
    isOverlapOther(chId, rows, cols, x, y) {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (!this.isEmptySafeCell(chId, y + r, x + c)) {
                    return true;
                }
            }
        }
        return false;
    }
    //在 boardMap 的特定位置，橫向、縱向填入特定的標記  
    fillDataToBoardMap(pos, rows, cols, fillData) {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                this.boardMap[r + pos.y][c + pos.x] = fillData;
            }
        }
    }
    //找出(由左而右，逐列掃描尋找)棋盤的第一格空白的位置，準備放入棋子
    findEmptyCell() {
        for (let r = 1; r <= Board.RowSize; r++) {
            for (let c = 1; c <= Board.ColSize; c++) {
                if (this.boardMap[r][c] === Board.Empty) {
                    return { x: c, y: r };
                }
            }
        }
        alert("找不到空白的地方可以放置棋子");
        return { x: -1, y: -1 }; //發生錯誤
    }
    //用 levelString(關卡字串) 來決定棋子的位置
    /*
    關卡字串是由 0~4所組成的字串
    levelStr 是用記錄棋子的【形狀】來產生棋局
    形狀0:曹操孟德，有1顆
    形狀1:關羽，有1顆
    形狀2:張飛，趙雲，馬超，黃忠，共4顆
    形狀3:兵卒奴僕，共4顆
    形狀4:空格、空格，共2顆

    另外，對於相同形狀的複數棋子，不必計較其真實名稱，
    例如形狀2，有張飛，趙雲，馬超，黃忠，共 4 種可能，解析時會自動產生出不同的棋子名稱
    */
    levelStringToPositions(levelStr) {
        const Blank = 4; //空白棋子的索引
        let chIdAry = [[0], [1], [2, 3, 4, 5], [6, 7, 8, 9], [10, 11]]; //每種 shape 的 chess Id
        if (levelStr.length !== 12) {
            alert("關卡字串的長度必須是12個字！");
            return [];
        }
        let B = new Board();
        for (let i = 0; i < 12; i++) {
            let kind = parseInt(levelStr[i]); //這是哪一種形狀的棋子
            let chId = chIdAry[kind].pop(); //從此種形狀挑出一顆棋子
            if (chId === undefined) {
                alert(`kind 為 ${kind} 的棋子超過了所需的數量`);
                return [];
            }
            let pos = B.findEmptyCell();
            if (kind === Blank) {
                //888只是隨意給的，只要非零即可
                B.fillDataToBoardMap(pos, 1, 1, 888);
            }
            else {
                B.chessesPos[chId] = pos;
                B.fillChessStatus(chId, chId);
            }
        } //for
        return B.chessesPos;
    }
} //Board
Board.RowSize = 5; //不包含圍牆
Board.ColSize = 4; //不包含圍牆
Board.Empty = -1; //空格
Board.Wall = -2; //牆壁邊界
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9hcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYm9hcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDdEMsT0FBTyxLQUFLLEtBQUssTUFBTSxZQUFZLENBQUM7QUFHcEMsYUFBYTtBQUNiLE1BQU0sT0FBTyxLQUFLO0lBY2QsaUJBQWlCO0lBQ2pCO1FBVEEsZ0JBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNqQixZQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ1osU0FBSSxHQUFHLENBQUMsQ0FBQztRQUNULGVBQVUsR0FBZSxFQUFFLENBQUM7UUFDNUIsYUFBUSxHQUFlLEVBQUUsQ0FBQztRQUMxQixXQUFNLEdBQWlCLElBQUksQ0FBQztRQWU1QixhQUFhO1FBQ2IsY0FBUyxHQUFFLENBQUMsUUFBZSxFQUFFLEVBQUU7WUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDeEQsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFHLHFCQUFxQjtRQUNqRCxDQUFDLENBQUE7UUFHRCxtQkFBbUI7UUFDbkIsZUFBZTtRQUNmLFNBQUksR0FBRyxDQUFDLE9BQWUsRUFBRSxHQUFXLEVBQVcsRUFBRTtZQUM3QyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN0QyxJQUFJLEVBQUUsRUFBRSxDQUFDO2dCQUNMLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZDLENBQUM7WUFDRCxPQUFPLEVBQUUsQ0FBQztRQUNkLENBQUMsQ0FBQTtRQUdELDhCQUE4QjtRQUM5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