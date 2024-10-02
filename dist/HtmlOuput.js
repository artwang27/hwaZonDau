//以某一個 Dom 元素作為文字輸出的介面
export class HtmlOutput {
    //指定要輸出的 html dom 元素
    constructor(htmlId) {
        this.elem = document.getElementById(htmlId);
        if (this.elem == null) {
            alert(`找不到 id 為 ${htmlId} 的 Dom 元素`);
        }
    }
    print(str) {
        var _a;
        const positon = "beforeend";
        (_a = this.elem) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML(positon, str);
    }
    //換行列印
    println(str) {
        var _a;
        const positon = "beforeend";
        (_a = this.elem) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML(positon, str + "<br>"); //用 br 換行
    }
    clear() {
        if (this.elem)
            this.elem.textContent = "";
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSHRtbE91cHV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0h0bWxPdXB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxzQkFBc0I7QUFDdEIsTUFBTSxPQUFPLFVBQVU7SUFHbkIsb0JBQW9CO0lBQ3BCLFlBQVksTUFBYTtRQUNyQixJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUMsSUFBRyxJQUFJLENBQUMsSUFBSSxJQUFFLElBQUksRUFBQyxDQUFDO1lBQ2hCLEtBQUssQ0FBQyxZQUFZLE1BQU0sV0FBVyxDQUFDLENBQUM7UUFDekMsQ0FBQztJQUNMLENBQUM7SUFFRCxLQUFLLENBQUMsR0FBVTs7UUFDWixNQUFNLE9BQU8sR0FBQyxXQUFXLENBQUM7UUFDMUIsTUFBQSxJQUFJLENBQUMsSUFBSSwwQ0FBRSxrQkFBa0IsQ0FBQyxPQUFPLEVBQUMsR0FBRyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELE1BQU07SUFDTixPQUFPLENBQUMsR0FBVTs7UUFDZCxNQUFNLE9BQU8sR0FBQyxXQUFXLENBQUM7UUFDMUIsTUFBQSxJQUFJLENBQUMsSUFBSSwwQ0FBRSxrQkFBa0IsQ0FBQyxPQUFPLEVBQUMsR0FBRyxHQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUztJQUNoRSxDQUFDO0lBRUQsS0FBSztRQUNELElBQUcsSUFBSSxDQUFDLElBQUk7WUFDUixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBQyxFQUFFLENBQUM7SUFDakMsQ0FBQztDQUNKIn0=