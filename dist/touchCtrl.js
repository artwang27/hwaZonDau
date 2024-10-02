import { Chess } from "./chess.js";
import { CanvasEvent } from "./canvasEvent.js";
import { Solver } from "./solver.js";
import { Sounds } from "./soundPlay.js";
export class TouchCtrl {
    constructor(game) {
        this.solveMode = false; //是否處於解題模式
        this.path = []; //解題結果
        this.stepsCount = []; //轉換成華容道特有的計步方式
        this.pathIdx = 0; //指向第幾步解法
        this.game = game;
        new CanvasEvent(game);
        //***************************************************** */
        this.addDeviceListener('btnBegin', this.onBtnBegin);
        this.addDeviceListener('btnEnd', this.onBtnEnd);
        this.addDeviceListener('btnPrev', this.onBtnPrev);
        this.addDeviceListener('btnNext', this.onBtnNext);
        this.addDeviceListener('btnTaggleMode', this.onBtnToggleMode);
    } //constructor
    //同時設定滑鼠和手機的觸碰事件
    addDeviceListener(domId, fn) {
        let dom = document.getElementById(domId);
        dom.addEventListener("touchstart", (e) => {
            fn(e, this);
        });
        dom.addEventListener("mousedown", (e) => {
            fn(e, this);
        });
    }
    /************************************************* */
    onBtnBegin(e, self) {
        e.preventDefault();
        self.game.showInfo("第零步");
        self.setBoardByPathIndex(0);
    }
    /************************************************* */
    onBtnEnd(e, self) {
        e.preventDefault();
        self.game.showInfo("最後一步");
        self.setBoardByPathIndex(self.path.length - 1);
    }
    //用答案 path 裡的某一個盤面，取代目前的盤面
    //當指定到最開始(begin)或最尾端(end)時使用
    setBoardByPathIndex(index) {
        this.pathIdx = index;
        this.game.setByBoard(this.path[index]);
        this.game.drawBoard();
    }
    /************************************************* */
    onBtnPrev(e, self) {
        e.preventDefault();
        // self.game.showInfo("on 上一步");
        self.onBtnPrev2();
    }
    onBtnPrev2() {
        if (this.pathIdx > 0) {
            let B = this.path[this.pathIdx];
            //反向移動，(相反方向的和為 3)
            this.game.move(B.fromChessId, 3 - B.fromDir);
            this.pathIdx--;
            this.showStepsCount(this.pathIdx);
        }
        else {
            this.pathIdx = 0;
            this.game.showInfo("已經回到第零步了");
        }
    }
    /************************************************* */
    onBtnNext(e, self) {
        e.preventDefault();
        // self.game.showInfo("on 下一步");
        self.onBtnNext2();
    }
    onBtnNext2() {
        if (++this.pathIdx < this.path.length) {
            let B = this.path[this.pathIdx];
            this.game.move(B.fromChessId, B.fromDir);
            this.showStepsCount(this.pathIdx);
        }
        else {
            this.pathIdx = this.path.length - 1;
            this.game.showInfo("已經是最後一步了");
        }
    }
    /************************************************* */
    //切換成手動模式或電腦解題
    onBtnToggleMode(e, self) {
        e.preventDefault();
        self.solveMode = !self.solveMode; //切換狀態
        self.displayButtons(self.solveMode);
        if (self.solveMode) {
            self.computerSolve();
        }
        else {
            self.path = [];
            self.pathIdx = 0;
        }
    }
    //執行電腦解題
    computerSolve() {
        Sounds.playAiSolve();
        let solver = new Solver();
        this.path = solver.solveIt_ByBoard(this.game.board);
        let totalSteps = this.makeStepsCount();
        this.game.showInfo(`解法共 ${totalSteps} 步`);
        this.pathIdx = 0;
    }
    //把實際的步數，轉換為華容道的計步方式(同一顆棋連續移動時，只算一步)
    makeStepsCount() {
        this.stepsCount = [];
        let last = -1; //解法的第一步，fromChessId 本來就是 -1
        let count = 0;
        for (let i = 0; i < this.path.length; i++) {
            if (last !== this.path[i].fromChessId) {
                count++;
                last = this.path[i].fromChessId;
            }
            this.stepsCount[i] = count;
        }
        return count;
    }
    //按鈕的顯示
    displayButtons(sloving) {
        //控制播放按鈕是否顯示
        let buttons = document.getElementById("buttons");
        buttons.style.display = sloving ? "flex" : "none";
        //模式按鈕要顯現什麼提示文字
        let btnTaggleMode = document.getElementById("btnTaggleMode");
        btnTaggleMode.textContent = sloving ? "返回手動模式" : "電腦解題";
        //canvas 是否可被點擊
        let canvas = document.getElementById("canvas");
        canvas.style.pointerEvents = this.solveMode ? "none" : "auto"; // 禁止點擊，恢復點擊
    }
    //秀出目前是解法的第幾步
    showStepsCount(index) {
        let chessName = Chess.getChessName(this.path[index].fromChessId);
        this.game.showInfo(`第 ${this.stepsCount[index]} 步：【${chessName}】 ${index} / ${this.path.length - 1}`);
    }
} //class
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG91Y2hDdHJsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3RvdWNoQ3RybC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBRW5DLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUMvQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUd4QyxNQUFNLE9BQU8sU0FBUztJQU9sQixZQUFZLElBQVU7UUFMdEIsY0FBUyxHQUFHLEtBQUssQ0FBQyxDQUFJLFVBQVU7UUFDaEMsU0FBSSxHQUFZLEVBQUUsQ0FBQyxDQUFJLE1BQU07UUFDN0IsZUFBVSxHQUFVLEVBQUUsQ0FBQyxDQUFDLGVBQWU7UUFDdkMsWUFBTyxHQUFXLENBQUMsQ0FBQyxDQUFHLFNBQVM7UUFHNUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFdEIsMERBQTBEO1FBRTFELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRWxELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBRWxFLENBQUMsQ0FBQSxhQUFhO0lBS2QsZ0JBQWdCO0lBQ2hCLGlCQUFp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QUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQWdCLENBQUM7UUFDOUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxZQUFZO0lBRS9FLENBQUM7SUFHRCxhQUFhO0lBQ2IsY0FBYyxDQUFDLEtBQVk7UUFDdkIsSUFBSSxTQUFTLEdBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxTQUFTLEtBQUssS0FBSyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDeEcsQ0FBQztDQUtKLENBQUEsT0FBTyJ9