class CalcController{

    constructor(){
     this._operation = [];
     this._locale = "pt-br";
     this._displayCalcEl = document.querySelector("#display");
     this._dateEl = document.querySelector("#data");
     this._timeEl = document.querySelector("#hora");
     this._currentDate;
     this.initialize();
     this.initButtonsEvent();
     this.initKeyboard();

  }
   
    addEventListenerAll(element, events, fn){

      events.split(" ").forEach( event => {
        element.addEventListener(event, fn, false);
      });
    }

    clearAll(){
      this._operation = [];
      this.lastNumber = '';
      //this.lastOperator = '';
      this.setLastNumberToDisplay();
    }

    initKeyboard(){

      document.addEventListener("keyup", e =>{

        console.log(e.key);

      switch( e.key ){
        case "Escape":
         this.clearAll();
        break;

        case "Backspace": 
         this.clearEntry();
        break;

        case "+": 
        case "-": 
        case "/": 
        case "*": 
        this.addOperation(e.key);
        break;

        case "Enter": 
        case "=": 
        this.calc();
        break;

        case ".": 
        case ",": 
        this.addDot();
        break;

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
          this.addOperation( parseInt(e.key) );
          break;
          //Caso pressionar CTRL + C para copiar
       case "c":
         if(e.ctrlKey) this. copytoClipBoard();
         break;
     }

      })

    }

    //Método para colar numero copiado do sistema
    PasteFrom(){
      
      //Evento de colar
      document.addEventListener("paste", e =>{

       let text = e.clipboardData.getData("Text");
       
       this.displayCalc = parseFloat(text)
      })
    }
     
    //Método para copiar elemento digitado na calculadora
     copytoClipBoard(){

       let input = document.createElement("input");
       input.value = this.displayCalc;

       document.body.appendChild(input);

       input.select();

       document.execCommand("Copy");

       input.remove();
     }

    
    clearEntry(){
      this._operation.pop();
      this.setLastNumberToDisplay();
    }
    setError(){
       this.displayCalc = "ERROR";
    } 

    setLastOperation(value){
      this._operation[this._operation.length - 1] = value;
    }
    
    getLastOperation(){  
       return this._operation[this._operation.length - 1];
    }

    isOperator(value){
        return ( ['/', '+', '-', '*', '%'].indexOf(value) > - 1);
    }

    pushOperation(value){
       console.log(value);
       this._operation.push(value);

       if(this._operation.length > 3){
           this.calc();  
       }
      
    }

    getResult(){
       return eval(this._operation.join(""));
    }


    //Realiza o calculo dos elementos salvos no ARRAY
    calc(){

      let last = '';

      if(this._operation.length > 3){

        last = this._operation.pop();

        let result = this.getResult();
      }

      
      let result = this.getResult();

      if( last == "%"){
        //Resultado dividido por 100
        result /= 100;
        this._operation = [result];
      }
      else{

        this._operation = [result];

        if(last != ''){
          this._operation.push(last);

        }
      }

      this.setLastNumberToDisplay();
    }

    setLastNumberToDisplay(){
      
      let lastNumber;

      for( let i = this._operation.length - 1; i >= 0; i--){
            
         if(!this.isOperator(this._operation[i]) ){

            lastNumber = this._operation[i];
            break;
         }

       }

       if(!lastNumber) lastNumber = 0;
       this.displayCalc = lastNumber;
    }

   
    addOperation(value){
         console.log("A"+  value + " "+ isNaN( this.getLastOperation()));
        if( isNaN( this.getLastOperation()) ){

            if( this.isOperator(value) ){
              //Trocar operador
              this.setLastOperation(value);
            }
            else{
               //É um numero  
               this.pushOperation(value);
               this.setLastNumberToDisplay();
            }
        }
        else{
              if(this.isOperator(value)){
                 //Caso o usuário digite 2 operadores 2 vezes seguidas ex: '56 + -' 
                 this.pushOperation(value);
              }
              else{
                   //Concatenando o ultimo valor do array com atual para realizar junção
                   let newValue = this.getLastOperation().toString() + value.toString();
                   //Salvando numero digitado como FLOAT
                   this.setLastOperation( newValue );
                   //Atualizar Display
                   this.setLastNumberToDisplay();
              }


         
        }
        console.log(this._operation);
    }

    //Caso usuario digitar um ponto
    addDot(){
       let lastOperation = this.getLastOperation();
       console.log(lastOperation);

       //IndexOf pesquisa elemento dentro do array e retorna 1 caso true
       //Caso o usuario digite ponto 2 vezes 
       if(typeof lastOperation === "string" && lastOperation.split("").indexOf(".") > -1) return;

       if(this.isOperator(lastOperation) || !lastOperation){
          this.pushOperation("0.");
       }else{
           this.setLastOperation(lastOperation.toString() + '.' );
       }

       this.setLastNumberToDisplay();
    }


    execBtn( value ){

        switch( value ){
         case "ac":
          this.clearAll();
         break;

         case "ce": 
          this.clearEntry();
         break;

         case "soma": 
         this.addOperation("+");
         break;

         case "subtracao": 
         this.addOperation("-");
         break;

         case "multiplicacao": 
         this.addOperation("*");
         break;

         case "divisao": 
         this.addOperation("/");
         break;

         case "porcento": 
         this.addOperation("%");
         break;

         case "igual": 
         this.calc();
         break;

         case "ponto": 
         this.addDot();
         break;

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
           this.addOperation( parseInt(value) );
           break;
         default: 
          this.setError();
          break;


      }
    }

    initButtonsEvent(){
     let buttons = document.querySelectorAll("#buttons > g, #parts > g");
     buttons.forEach( (btn, index) =>{
       
         this.addEventListenerAll(btn, "click drag", e => {
          let textBtn = btn.className.baseVal.replace("btn-", "");
          this.execBtn(textBtn);
         });

         this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
           btn.style.cursor = "pointer";
         })
     } )

    }


     initialize(){
        this.setDisplayDateTime();

       setInterval( ()=>{
        this.setDisplayDateTime();
        }, 1000 )

        this.setLastNumberToDisplay();
        this.PasteFrom();
    }

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale);
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }
       
    get displayTime(){
          return this._timeEl.innerHTML;
    }
    set displayTime(value){
            return this._timeEl.innerHTML = value;
    }
    get displayDate(){
        return this._dateEl.innerHTML;
    }
    set displayDate(value){
          return this._dateEl.innerHTML = value;
    }

    get displayCalc(){
         return this._displayCalcEl.innerHTML;
    } 

    set displayCalc(value){
      this._displayCalcEl.innerHTML = value;
    }

    get currentDate(){
      return new Date();
    }
    set currentDate(value){
      this._currentDate = value;
    }

}

