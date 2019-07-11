class CalcController {

    constructor() {
        this._audio = new Audio('click.mp3')
        this._audioOnOff = false
        this._lastOperator = ''
        this._lastNumber = ''
        this._operation = []
        this._locale = 'pt-BR'
        this._displayCalcEl = document.querySelector('#display')
        this._dateEl = document.querySelector('#data')
        this._timeEl = document.querySelector('#hora')
        this._currentData
        this.initialize()
        this.initButtonsEvents()
        this.initKeyboard()
    }

    pasteFromClipboard() {
        document.addEventListener('paste', event => {
            const text = event.clipboardData.getData('Text')
            const textCopy = parseFloat(text)
            this.pushOperation(textCopy)
            this.displayCalc = textCopy
        })
    }

    copyToClipboard() {
        const input = document.createElement('input')
        input.value = this.displayCalc
        document.body.appendChild(input)
        input.select()
        document.execCommand('Copy')
        input.remove()
    }

    initialize() {
        this.setDisplayDateTime()

        setInterval(() => {
            this.setDisplayDateTime()
        }, 1000)

        this.setLastNumberToDisplay()
        this.pasteFromClipboard()

        document.querySelectorAll('.btn-ac').forEach(btn => {
            btn.addEventListener('dblclick', event => {
                this.toggleAudio()
            })
        })
    }

    toggleAudio() {
        this._audioOnOff = !this._audioOnOff
    }

    playAudio() {
        if (this._audioOnOff) {
            this._audio.currentTime = 0
            this._audio.play()
        }
    }

    initKeyboard() {
        document.addEventListener('keyup', event => {
            this.playAudio()

            switch (event.key) {
                case 'Escape':
                    this.clearAll()
                    break

                case 'Backspace':
                    this.clearEntry()
                    break

                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(event.key)
                    break

                case 'Enter':
                case '=':
                    this.calc()
                    break
                case '.':
                case ',':
                    this.addDot()
                    break
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(event.key))
                    break
                case 'c':
                    if (event.ctrlKey)
                        this.copyToClipboard()
                    break
            }

        })
    }

    addEventListenerAll(element, events, callback) {
        events.split(' ').forEach(event => {
            element.addEventListener(event, callback, false)
        })
    }

    clearAll() {
        this._operation = []
        this._lastNumber = ''
        this.lastOperation = ''
        this.setLastNumberToDisplay()
    }

    clearEntry() {
        this._operation.pop()
        this.setLastNumberToDisplay()
    }

    setError() {
        this.displayCalc = 'Error'
    }

    getLastOperation() {
        return this._operation[this._operation.length - 1]
    }

    isOperator(value) {
        return (['+', '-', '*', '/', '%'].indexOf(value) > -1)

    }

    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value
    }

    pushOperation(value) {
        this._operation.push(value)

        if (this._operation.length > 3) {
            this.calc()
        }
    }

    getResult() {
        try {
            return eval(this._operation.join(""))
        } catch (e) {
            setTimeout(() => {
                this.setError()
            }, 1)
        }
    }

    calc() {
        let lastOperation = ''
        this._lastOperator = this.getLastItem()

        if (this._operation.length < 3) {
            let firstItem = this._operation[0]
            this._operation = [firstItem, this._lastOperator
                , this._lastNumber]
        }

        if (this._operation.length > 3) {

            lastOperation = this._operation.pop()
            this._lastNumber = this.getResult()

        } else if (this._operation.length == 3) {
            this._lastNumber = this.getLastItem(false)
        }

        let result = this.getResult()

        if (lastOperation == '%') {

            result /= 100
            this._operation = [result]
        } else {

            this._operation = [result]
            if (lastOperation) this._operation.push(lastOperation)
        }

        this.setLastNumberToDisplay()

    }

    getLastItem(isOperator = true) {
        let lastItem
        for (let i = this._operation.length - 1; i >= 0; i--) {

            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i]
                break

            }
        }

        if (!lastItem && lastItem !== 0) {

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber
        }
        return lastItem
    }
    setLastNumberToDisplay() {
        let lastNumber = this.getLastItem(false)
        if (!lastNumber) lastNumber = 0
        this.displayCalc = lastNumber
    }

    addOperation(value) {

        if (isNaN(this.getLastOperation())) {

            if (this.isOperator(value)) {

                this.setLastOperation(value)

            } else {
                this.pushOperation(value)
                this.setLastNumberToDisplay()
            }
        } else {

            if (this.isOperator(value)) {

                this.pushOperation(value)
            } else {
                let newValue;
 
                if (this.getLastOperation().toString() !== '0') {
                    newValue = this.getLastOperation().toString() + value.toString();
                } else {
                    newValue = value.toString();
                }
                 
                this.setLastOperation(newValue);
                 
                this.setLastNumberToDisplay();
            }

        }
    }

    addDot() {
        const lastOperation = this.getLastOperation()
        if (lastOperation.toString().split('').indexOf('.') > -1) return

        if (this.isOperator(lastOperation) || lastOperation == undefined) {
            this.pushOperation('0.')
        } else {
            this.setLastOperation(lastOperation.toString() + '.')
        }

        this.setLastNumberToDisplay()
    }

    executeButton(value) {
        this.playAudio()

        switch (value) {
            case 'ac':
                this.clearAll()
                break

            case 'ce':
                this.clearEntry()
                break

            case 'soma':
                this.addOperation('+')
                break

            case 'subtracao':
                this.addOperation('-')
                break

            case 'multiplicacao':
                this.addOperation('*')
                break

            case 'divisao':
                this.addOperation('/')
                break

            case 'porcento':
                this.addOperation('%')
                break

            case 'igual':
                this.calc()
                break
            case 'ponto':
                this.addDot()
                break
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value))
                break
            default:
                this.setError()
                break
        }
    }

    initButtonsEvents() {
        const buttons = document.querySelectorAll("#buttons > g, #parts > g")
        buttons.forEach((button, index) => {
            this.addEventListenerAll(button, 'click drag', event => {
                let textButton = button.className.baseVal.replace('btn-', '')
                this.executeButton(textButton)
            })
            button.style.cursor = 'pointer'
        })
    }

    setDisplayDateTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale)
    }

    get displayTime() {
        return this._timeEl.innerHTML
    }

    set displayTime(value) {
        return this._timeEl.innerHTML = value
    }

    get displayDate() {
        return this._dateEl.innerHTML
    }

    set displayDate(value) {

        return this._dateEl.innerHTML = value
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML
    }

    set displayCalc(value) {
        if (value.toString().length > 10) {
            this.setError()
            return false
        }
        this._displayCalcEl.innerHTML = value
    }

    get currentDate() {
        return new Date()
    }

    set currentDate(value) {
        this._currentData = value
    }
}






// MEU CALCULO//
// MEU CALCULO//// MEU CALCULO//// MEU CALCULO//// MEU CALCULO//// MEU CALCULO//// MEU CALCULO//// MEU CALCULO//// MEU CALCULO//// MEU CALCULO//// MEU CALCULO//
// MEU CALCULO//
// MEU CALCULO//
// MEU CALCULO//
// MEU CALCULO//
// MEU CALCULO//
// MEU CALCULO//
// MEU CALCULO//
// MEU CALCULO//
// MEU CALCULO//

// MEU CALCULO//
// class CalcController {

//     constructor(){
//         this._audio = new Audio('click.mp3');
//         this._audioOnOff = false;
//         this._lastOperator = '';
//         this._lastNumber = '';

//         this._operation = [];
//         this._locale = ('pt-BR');
//         this._displayCalcEl = document.querySelector("#display");
//         this._dateEl = document.querySelector("#data");
//         this._timeEl = document.querySelector("#hora");
//         this._currentDate;
//         this.initialize();
//         this.initButtonsEvents();
//         this.initKeyboard();

//     }
//         initialize(){
//             this.setdisplaDateTime();
//          setInterval(() =>{
//             this.setdisplaDateTime();
//          }, 1000);
//          this.setLastNumberToDisplay();
//          this.pastFromClipboard();

//          document.querySelectorAll('.btn-ac').forEach(btn=>{

//             btn.addEventListener('dblclick', e=> {

//                 this.toggleAudio();

//             });

//          });


//         }
//         toggleAudio(){
            
//             this._audioOnOff = !this._audioOnOff;
            
//         }

//         playAudio(){
//             if (this._audioOnOff){
//                 this._audio.currentTime = 0;
//                 this._audio.play();
//             }

//         }


//         pastFromClipboard(){

//             document.addEventListener('paste', e=>{

//                 let text = e.clipboardData.getData('Text');
                
//                 this.displayCalc = parseFloat(text);
                
//                 console.log(text);
//             });

//         }

//         copyToClipborad (){
//             let input = document.createElement('input');
//             input.value = this.displayCalc;
//             document.body.appendChild(input)
//             input.select();
//             document.execCommand("Copy") ;
//             input.remove();
//         }

//         initKeyboard(){
//             document.addEventListener('keyup', e =>{
//             console.log(e.key)
//             this.playAudio();
//             switch (e.key) {
              
//                 case 'Escape':
//                     this.clearAll();
//                     console.log('AC')
//                     break;

//                 case 'Backspace':
//                     this.clearEntry();
//                     console.log('CE')
//                     break;
//                 case '+':
//                 case '-':
//                 case '/':
//                 case '*':
//                 case '%':
//                     this.addOperation(e.key);
//                     break;
            
//                 case 'Enter':
//                 case '=':
//                    this.calc();
//                     break;
//                 case '.':
//                 case ',':
//                     this.addDot();

//                         break;

//                 case '0':
//                 case '1':
//                 case '2':
//                 case '3':
//                 case '4':
//                 case '5':
//                 case '6':
//                 case '7':
//                 case '8':
//                 case '9':
//                     this.addOperation(parseInt(e.key));
//                     break;
//                 case 'c':
//                     if (e.ctrlKey) this.copyToClipborad();
//                     break;
              
//             }



//            });
//         }



//         addEventListenerAll(element, events, fn){
//             events.split(' ').forEach(event => {
//                 element.addEventListener(event, fn, false);
//             });
//         }

//         clearAll(){
//             this._operation = [];
//             this._lastNumber = []
//             this._lastOperator = []
//             this.setLastNumberToDisplay();
//             this.displayCalc = '0'

//         };
//         clearEntry(){
                
//                 this._operation.pop();
//                 this.setLastNumberToDisplay();
//                 this.displayCalc = '0'

//         };
//         getLastOperation(){


//             return this._operation[this._operation.length - 1];


//         }
//         isOperator(value){

//            return (['+', '-', '*', '%', '/'].indexOf(value) > -1);


//         }
//         pushOperation(value){

//             this._operation.push(value)

//             if (this._operation.length > 3){

//                 this.calc();
//             }


//         }
// getResult(){
//   try{
//     return eval(this._operation.join(""));
//   } catch(e){
//       setTimeout(()=>{
//           this.setError();
//       }, 1);
//   }
    
// }
// calc(){

//     let last = '';
//     this._lastOperator = this.getLastItem();

//     if (this._operation.length < 3){

//         let firstItem = this._operation[0];
//         this._operation = [firstItem, this._lastOperator, this._lastNumber];
//     }

//     if (this._operation.length > 3){

//         this._lastOperator = this._operation.pop()
//         last = this._operation.pop();
//         this._lastNumber = this.getResult()

//     }else if (this._operation.length == 3){
               
//         this._lastNumber = this.getLastItem(false);

//     }
     

//     console.log('_lastOperator', this._lastOperator);
//     console.log('_lastNumber',this._lastNumber)
//     console.log('_operation', this._operation)
//     console.log('_Result', this.getResult())

// let result = this.getResult();

//     if (last == '%'){

//         result /= 100;

//         this._operation = [result];
//     } else {

//         this._operation = [result];

//         if  (last) this._operation.push(last);
//     }

//     this.setLastNumberToDisplay();

// }

// getLastItem(isOperator = true){

//     let lastItem;

//     for (let i = this._operation.length-1; i >= 0; i--){


//         if(this.isOperator(this._operation[i]) == isOperator) {
//             lastItem = this._operation[i];
//             break;
//         }
//     }

//     if(!lastItem){

//         lastItem = (isOperator) ? this._lastOperator : this._lastNumber;    

//     }

//     return lastItem;
// }

// setLastNumberToDisplay(){
//     let lastNumber = this.getLastItem(false);

//     if (!lastNumber) lastNumber = 0

//     this.displayCalc = lastNumber;


    
// }

//         addOperation(value){
//             console.log('A', value, isNaN(this.getLastOperation()));

//             if (isNaN(this.getLastOperation())){

//                 if(this.isOperator(value)){

//                     this.setLastOperation(value);

//                 } else {
//                     this.pushOperation(value);
//                     this.setLastNumberToDisplay();
//                 }
//                 string

//             } else {

//                 if (this.isOperator(value)){
//                     this.pushOperation(value);


//                 } else {
//                     let newValue;
 
//                     if (this.getLastOperation().toString() !== '0') {
//                         newValue = this.getLastOperation().toString() + value.toString();
//                     } else {
//                         newValue = value.toString();
//                     }
                    
//                     this.setLastOperation(newValue);
                    
//                     this.setLastNumberToDisplay();
//                 let newvalue = this.getLastOperation().toString() + value.toString();
//                 this.setLastOperation((newvalue));
//                     atualizar o display
//                     this.setLastNumberToDisplay();
//                 }

//             }


//             console.log(this._operation);

//         }

//         setLastOperation(value){

//             this._operation[this._operation.length - 1] = value

//         }

//         setError(){
//             this.displayCalc = "Error";
//         }
//         addDot(){
//             let lastOperation = this.getLastOperation();
           
//             if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return; 


//             if (this.isOperator(lastOperation) || !lastOperation){
//                 this.pushOperation('0.');

//             } else {
//                 this.setLastOperation(lastOperation.toString() + '.');
//             }

//             this.setLastNumberToDisplay();
//         }

//         execBtn(value){

//            this.playAudio();
//             switch (value) {
                
//                 case 'ac':
//                     this.clearAll();
//                     console.log('AC')
//                     break;

//                 case 'ce':
//                     this.clearEntry();
//                     console.log('CE')
//                     break;
//                 case 'soma':
//                     this.addOperation('+');
//                     break;
//                 case 'subtracao':
//                         this.addOperation('-');
//                     break;
//                 case 'divisao':
//                         this.addOperation('/');

//                      break;
//                 case 'multiplicacao':
//                         this.addOperation('*');

//                      break;
//                 case 'porcento':
//                         this.addOperation('%');

//                     break;
//                 case 'igual':

//                    this.calc();
//                     break;
//                 case 'ponto':
//                     this.addDot();

//                         break;

//                 case '0':
//                 case '1':
//                 case '2':
//                 case '3':
//                 case '4':
//                 case '5':
//                 case '6':
//                 case '7':
//                 case '8':
//                 case '9':
//                     this.addOperation(parseInt(value));
//                     break;
//                 default:
//                     this.setError();
//                     break;
//             }
//         }



//         initButtonsEvents(){
//             let buttons = document.querySelectorAll("#buttons > g, #parts > g");

//             buttons.forEach((btn, index)=>{

//                 this.addEventListenerAll(btn, 'drag click', e => {

//                     let textBtn = btn.className.baseVal.replace("btn-", "");
//                     this.execBtn(textBtn)

//                 });

//                 this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
//                     btn.style.cursor = "pointer"
//                 })

//             })


//         }

//         setdisplaDateTime(){
//             this.displaDate = this.currentDate.toLocaleDateString(this._locale, {
//                 day: "2-digit",
//                 month: "long",
//                 year: "2-digit"
//             });
//             this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
//         }


//         get displayTime(){
//             return this._timeEl.innerHTML;
//         }
//         set displayTime(value){
//             return this._timeEl.innerHTML = value;
//         }
//         get displaDate(){
//             return this._dateEl.innerHTML;
//         }
//         set displaDate(value){
//             return this._dateEl.innerHTML = value;
//         }

//     get displayCalc(){
//         return this._displayCalcEl.innerHTML;
//     }


//     set displayCalc(value){
//         if(value.toString().length > 10){
//             this.setError();
//             return false;
//         }
//         this._displayCalcEl.innerHTML = value;
//     }
//     get currentDate(){
//         return new Date();
//     }


//     set currentDate(value){
//         this._currentDate = value
//     }

// }