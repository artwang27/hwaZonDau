var _a;
//控制各種音效的輸出
export class Sounds {
    static playTime(audio, ms) {
        audio.currentTime = 0;
        audio.play().then(() => {
            setTimeout(() => {
                audio.pause();
            }, ms);
        });
    }
    //為了 preload 各個 mp3檔 而存在
    static loading() {
        console.log('load audios...');
    }
}
_a = Sounds;
Sounds.soundDin = new Audio('./mp3/din.mp3');
Sounds.soundBoo = new Audio('./mp3/boo.mp3');
Sounds.soundAiSlove = new Audio('./mp3/aiSolve.mp3');
Sounds.soundError = new Audio('./mp3/error.mp3');
Sounds.soundGoal = new Audio('./mp3/goal.mp3');
Sounds.soundNewLevel = new Audio('./mp3/newLevel.mp3');
Sounds.playDin = () => _a.soundDin.play();
Sounds.playBoo = () => _a.soundBoo.play();
Sounds.playAiSolve = () => _a.soundAiSlove.play();
Sounds.playError = () => _a.soundError.play();
Sounds.playGoal = () => _a.soundGoal.play();
Sounds.playNewLevel = () => _a.soundNewLevel.play();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291bmRQbGF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NvdW5kUGxheS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsV0FBVztBQUNYLE1BQU0sT0FBTyxNQUFNO0lBZ0JmLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBc0IsRUFBRSxFQUFTO1FBQzdDLEtBQUssQ0FBQyxXQUFXLEdBQUMsQ0FBQyxDQUFDO1FBQ3BCLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRSxFQUFFO1lBQ2xCLFVBQVUsQ0FBQyxHQUFFLEVBQUU7Z0JBQ1gsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2xCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELHdCQUF3QjtJQUN4QixNQUFNLENBQUMsT0FBTztRQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtJQUNqQyxDQUFDOzs7QUEzQk0sZUFBUSxHQUFDLElBQUksS0FBSyxDQUFDLGVBQWUsQ0FBQyxBQUEzQixDQUE0QjtBQUNwQyxlQUFRLEdBQUMsSUFBSSxLQUFLLENBQUMsZUFBZSxDQUFDLEFBQTNCLENBQTRCO0FBQ3BDLG1CQUFZLEdBQUMsSUFBSSxLQUFLLENBQUMsbUJBQW1CLENBQUMsQUFBL0IsQ0FBZ0M7QUFDNUMsaUJBQVUsR0FBQyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxBQUE3QixDQUE4QjtBQUN4QyxnQkFBUyxHQUFDLElBQUksS0FBSyxDQUFDLGdCQUFnQixDQUFDLEFBQTVCLENBQTZCO0FBQ3RDLG9CQUFhLEdBQUMsSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQUFBaEMsQ0FBaUM7QUFFOUMsY0FBTyxHQUFFLEdBQUUsRUFBRSxDQUFBLEVBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEFBQTFCLENBQTJCO0FBQ2xDLGNBQU8sR0FBRSxHQUFFLEVBQUUsQ0FBQSxFQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxBQUExQixDQUEyQjtBQUNsQyxrQkFBVyxHQUFFLEdBQUUsRUFBRSxDQUFBLEVBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEFBQTlCLENBQStCO0FBQzFDLGdCQUFTLEdBQUUsR0FBRSxFQUFFLENBQUEsRUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQUFBNUIsQ0FBNkI7QUFDdEMsZUFBUSxHQUFFLEdBQUUsRUFBRSxDQUFBLEVBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEFBQTNCLENBQTRCO0FBQ3BDLG1CQUFZLEdBQUUsR0FBRSxFQUFFLENBQUEsRUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQUFBL0IsQ0FBZ0MifQ==