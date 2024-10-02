//http://simonsays-tw.com/web/Klotski/Klotski.html
//華容道遊戲
import { Chess } from './chess.js';
import { Board } from './board.js';
import { HtmlOutput } from './HtmlOuput.js'; //for info輸出
import { Directions } from './direction.js';
import { CanvasBoard } from './canvasBoard.js';
import { TouchCtrl } from './touchCtrl.js';
import { Sounds } from './soundPlay.js';
export class Game {
    //outputId: html 裡用來顯示的 dom Id
    constructor() {
        this.defaultBoardString = "202313233244"; //預設的 board 盤面
        this.canvasBoard = new CanvasBoard();
        this.info = new HtmlOutput("info");
        Chess.createAllChesses();
        this.board = new Board();
        //載入預設的【橫刀立馬】棋局
        this.loadLevel(this.defaultBoardString);
        new TouchCtrl(this);
    }
    //設定新的關卡
    loadLevel(levelStr) {
        this.board.loadLevel(levelStr);
    }
    //注意： board 必須先複製，否則只是把參考指標複製過來而已，接下來的動作會造成指標的混亂，無法正確與外界連動
    setByBoard(board) {
        let newBoard = board.copy();
        this.board = newBoard;
    }
    //嘗試把棋子朝dir方向移動，回傳是否可行
    move(chessId, dir) {
        let ok = this.board.move(chessId, dir);
        if (ok) {
            this.drawBoard(); //在螢幕上顯示
            this.showInfo(""); //清除資訊面板
            this.playSoundWhenMoveOk(chessId); //播放音效
            if (this.board.isGoal()) {
                let congratulationscon = "恭喜過關!!";
                this.showInfo(congratulationscon);
                Sounds.playGoal();
            }
        }
        else {
            let errMsg = `【${Chess.getChessName(chessId)}】不能往 ${this.DirString(dir)} 移動`;
            this.showInfo(errMsg);
            Sounds.playError();
        }
        return ok;
    }
    //當棋子合法移動時，產生音效
    playSoundWhenMoveOk(id) {
        if (id < 6) {
            Sounds.playTime(Sounds.soundBoo, 350);
            //Sounds.playBoo();
        }
        else {
            //Sounds.playDin();
            Sounds.playTime(Sounds.soundDin, 200);
        }
    }
    //******************************** */
    //******************************************************* */
    drawBoard() {
        //this.canvasBoard.draw2();
        this.canvasBoard.draw(this.board.chessesPos);
    }
    //找出所有能朝 dir 方向移動的棋子
    findWhatChessesCanMoveThisDir(dir) {
        let findChesses = [];
        Chess.chesses.forEach(ch => {
            if (this.board.tryMoveIt(ch.id, dir)) {
                findChesses.push(ch);
            }
        });
        return findChesses;
    }
    //輸出訊息
    showInfo(msg) {
        this.info.clear();
        this.info.print(msg);
    }
    //依照方向索引，產生出中文的方向提示
    DirString(dir) {
        return Directions.asString(dir);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9nYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGtEQUFrRDtBQUNsRCxPQUFPO0FBRVAsT0FBTyxFQUFFLEtBQUssRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNsQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQyxDQUFJLFlBQVk7QUFDNUQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzVDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUMvQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBR3hDLE1BQU0sT0FBTyxJQUFJO0lBU2IsOEJBQThCO0lBQzlCO1FBSkEsdUJBQWtCLEdBQUMsY0FBYyxDQUFDLENBQUUsY0FBYztRQUs5QyxJQUFJLENBQUMsV0FBVyxHQUFDLElBQUksV0FBVyxFQUFFLENBQUM7UUFDbkMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVuQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUV6QixJQUFJLENBQUMsS0FBSyxHQUFFLElBQUksS0FBSyxFQUFFLENBQUM7UUFFeEIsZUFBZTtRQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFeEMsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUdELFFBQVE7SUFDRCxTQUFTLENBQUMsUUFBZTtRQUM1QixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBS0QsMERBQTBEO0lB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