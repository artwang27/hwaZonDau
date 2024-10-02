//監測滑鼠或手機觸碰，控制 canvas 範圍內的動作 
export class CanvasEvent {
    constructor(game) {
        //canvasRect: DOMRect;    //canvas 在 body 裡的座標
        this.Scale = 100; //由螢幕 canvas 實際大小，反求每顆棋子所占空間的大小(px)
        this.rectLeft = 0; //螢幕 canvas 在 body 裡的座標
        this.rectTop = 0; //螢幕 canvas 在 body 裡的座標
        this.startX = 0; // 滑鼠(碰觸)移動的起始X座標
        this.startY = 0; // 起始Y座標
        this.endX = 0; // 結束X座標
        this.endY = 0; // 結束Y座標
        //移動棋子
        this.moveChess = () => {
            let chId = this.getChessId();
            if (chId >= 0) {
                this.game.move(chId, this.getMoveDirection());
            }
        };
        //由滑鼠位置反查棋子的 id
        this.getChessId = () => {
            let x = Math.ceil((this.startX - this.rectLeft) / this.Scale);
            let y = Math.ceil((this.startY - this.rectTop) / this.Scale);
            return this.game.board.boardMap[y][x];
        };
        this.game = game;
        // 取得滑動區域
        this.canvas = document.getElementById('canvas');
        this.getScale();
        //***************************************************** */
        // 監聽 touchstart 事件，記錄起始位置
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startX = e.touches[0].clientX; // 起始X
            this.startY = e.touches[0].clientY; // 起始Y
        });
        // 添加 mouse 事件來模擬
        this.canvas.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.startX = e.clientX;
            this.startY = e.clientY;
        });
        //***************************************************** */
        // 監聽 touchend 事件，記錄結束位置並判斷滑動方向
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.endX = e.changedTouches[0].clientX; // 結束X
            this.endY = e.changedTouches[0].clientY; // 結束Y
            this.moveChess();
        });
        this.canvas.addEventListener('mouseup', (e) => {
            this.endX = e.clientX;
            this.endY = e.clientY;
            this.moveChess();
        });
        //***************************************************** */
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });
        //***************************************************** */
    } //constructor
    //由螢幕 canvas 實際大小，反求每顆棋子的大小(px)
    getScale() {
        this.Scale = this.canvas.getBoundingClientRect().width / 4; //每一橫列有四顆棋子
        this.rectLeft = this.canvas.getBoundingClientRect().left;
        this.rectTop = this.canvas.getBoundingClientRect().top;
    }
    //判斷這個手勢是往哪個方向滑動
    getMoveDirection() {
        const threshold = 10; //大於閥值，才進入判斷
        const diffX = this.endX - this.startX; // X軸的移動距離
        const diffY = this.endY - this.startY; // Y軸的移動距離
        // 判斷滑動方向
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > threshold) {
                // console.log('右滑');
                return 2;
            }
            else if (diffX < -threshold) {
                // console.log('左滑');
                return 1;
            }
        }
        else {
            if (diffY > threshold) {
                // console.log('下滑');
                return 3;
            }
            else if (diffY < -threshold) {
                // console.log('上滑');
                return 0;
            }
        }
        return 3; //預設向下
    }
} //class
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FudmFzRXZlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY2FudmFzRXZlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsNkJBQTZCO0FBQzdCLE1BQU0sT0FBTyxXQUFXO0lBZ0JwQixZQUFZLElBQVU7UUFidEIsOENBQThDO1FBQzlDLFVBQUssR0FBQyxHQUFHLENBQUMsQ0FBRSxtQ0FBbUM7UUFDL0MsYUFBUSxHQUFDLENBQUMsQ0FBQyxDQUFDLHVCQUF1QjtRQUNuQyxZQUFPLEdBQUMsQ0FBQyxDQUFDLENBQUUsdUJBQXVCO1FBRW5DLFdBQU0sR0FBRSxDQUFDLENBQUMsQ0FBQyxpQkFBaUI7UUFDNUIsV0FBTSxHQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVE7UUFDbkIsU0FBSSxHQUFFLENBQUMsQ0FBQyxDQUFHLFFBQVE7UUFDbkIsU0FBSSxHQUFFLENBQUMsQ0FBQyxDQUFHLFFBQVE7UUF1RG5CLE1BQU07UUFDTixjQUFTLEdBQUMsR0FBRSxFQUFFO1lBQ1YsSUFBSSxJQUFJLEdBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQzNCLElBQUksSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUNaLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO1lBQ2xELENBQUM7UUFDTCxDQUFDLENBQUE7UUFXRCxlQUFlO1FBQ2YsZUFBVSxHQUFDLEdBQVMsRUFBRTtZQUNsQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxJ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