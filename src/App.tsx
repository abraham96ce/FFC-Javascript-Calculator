import { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { roundToPrecision } from "./utils";


/**
 * Componente principal de la calculadora.
 * 
 * Este componente utiliza hooks de React para manejar el estado de la
 * calculadora, incluyendo la expresión actual, el último resultado y la 
 * respuesta a mostrar. Permite realizar operaciones matemáticas básicas.
 * 
 * @component
 */
function App() {
  const[answer, setAnswer] = useState(""); // Respuesta actual a mostrar
  const[expression, setExpression] = useState(""); // Expresión matemática en formato de texto
  const et = expression.trim(); // Expresión recortada para manejo interno
  const [lastResult, setLastResult] = useState(""); // Último resultado calculado


  /**
   * Verifica si un símbolo es un operador.
   * 
   * @param {string} symbol - Símbolo a verificar.
   * @returns {boolean} - Verdadero si es un operador, falso de lo contrario.
   */
  const isOperator = (symbol: string) => {
    return /[*/+-]/.test(symbol);
  }

  /**
   * Maneja la presión de botones.
   * 
   * @param {string} symbol - Símbolo del botón presionado.
   */
  const buttonPress = (symbol: string) => {
    if (symbol === "clear") {
      setAnswer(""); // Limpia respuesta
      setExpression("0"); // Reinicia expresión
      setLastResult(""); // Reinicia el último resultado
    } else if (symbol === "negative") {
      // Alterna signo del número actual
      if (answer === "") return;
      setAnswer(answer.charAt(0) === "-" ? answer.slice(1) : "-" + answer);
    } else if (symbol === "percent") {
      // Calcula porcentaje del número actual
      if (answer === "") return;
      setAnswer((parseFloat(answer) / 100).toString());
    } else if (isOperator(symbol)) {
      handleOperator(symbol);     // Maneja operadores
    } else if (symbol === "=") {
      calculate();                // Calcula resultado
    } else if (symbol === "0") {
      handleZeroInput();          // Maneja entrada de cero
    } else if (symbol === ".") {
      handleDecimalInput();       // Maneja entrada de decimal
    } else {
      handleNumberInput(symbol);  // Maneja entrada de número
    }
  }

  /**
   * Maneja la entrada de operadores.
   * 
   * @param {string} symbol - Símbolo del operador.
   */
  const handleOperator = (symbol:string) => {
    const lastChar = expression.charAt(expression.length - 1);
    const lastAnswerChar = answer.charAt(answer.length - 1);

    // Cambia el operador si el último carácter es también un operador
    if (isOperator(lastChar) && lastChar !== '-') {
      if (!isOperator(lastAnswerChar)) {
        setExpression(expression.slice(0, -1) + " " + symbol + " ");
      }
    } else {
      // Si hay un último resultado, lo utiliza para iniciar la nueva operación
      if (lastResult !== "") {
        setExpression(lastResult + " " + symbol + " ");
        setLastResult("");
      } else {
        setExpression(et + " " + symbol + " ");
      }
    }
  }

   /**
   * Maneja la entrada de un cero.
   */
  const handleZeroInput = () => {
    if (expression.charAt(0) !== "0") {
      setExpression(expression + "0");
    }
  }

  /**
   * Maneja la entrada de un punto decimal.
   */
  const handleDecimalInput = () => {
    const lastNumber = expression.split(/[-+/*]/g).pop();
    if (!lastNumber) return;
    if (lastNumber.includes(".")) return;
    setExpression(expression + ".");
  }

  /**
   * Maneja la entrada de un número.
   * 
   * @param {string} symbol - Símbolo del número.
   */
  const handleNumberInput = (symbol: string) => {
    if (expression.charAt(0) === "0") {
      setExpression(expression.slice(1) + symbol);
    } else {
      setExpression(expression + symbol);
    }
  }

   /**
   * Realiza el cálculo de la expresión actual.
   */
  const calculate = () => {
    if(isOperator(et.charAt(et.length - 1))) return;
    const parts = et.split(" ");
    const newParts = [];

    // Reorganiza la expresión para respetar el orden de operaciones
    for(let i = parts.length - 1; i >= 0; i--){
      if(["*", "/", "+"].includes(parts[i]) && isOperator(parts[i-1])){
        newParts.unshift(parts[i]);
        let j = 0;
        let k = i - 1;
        while(isOperator(parts[k])){
          k--;
          j++;
        }
        i-=j;
      } else {
        newParts.unshift(parts[i]);
      }
    }
    const newExpression = newParts.join(" ");
    
    let result;
    try {
      result = eval(newExpression);
      result = roundToPrecision(result, 4); // Redondeo a 4 decimales
    }catch(error){
      result = "Error"; // Manejo de errores en caso de que la evaluación falle
    }
    setAnswer(result.toString()); // Actualiza la respuesta
    setLastResult(result.toString());// Guarda el último resultado
    setExpression(""); // Reinicia la expresión
  };

  return (
    <div className='container'>
      <h1 className='text-center my-4'>Javascript Calculator</h1>
      <div id='calculator' className='card p-3'>
        <div id='display' style={{textAlign: "right"}}>
          <div id='answer'>{answer}</div>
          <div id='expression'>{expression}</div>
        </div>
        <div className='d-flex justify-content-between'>
          <button id='clear' onClick={() => buttonPress("clear")} className="special">C</button>
          <button id='negative' onClick={() => buttonPress("negative")} className="special">+/-</button>
          <button id='percentage' onClick={() => buttonPress("percent")} className="special">%</button>
          <button id='divide' onClick={() => buttonPress("/")} className="operator">/</button>
        </div>

        <div className='d-flex justify-content-between'>
          <button id='seven' onClick={() => buttonPress("7")} className="number">7</button>
          <button id='eight' onClick={() => buttonPress("8")} className="number">8</button>
          <button id='nine' onClick={() => buttonPress("9")} className="number">9</button>
          <button id='multiply' onClick={() => buttonPress("*")} className="operator">*</button>
        </div>

        <div className='d-flex justify-content-between'>
          <button id='four' onClick={() => buttonPress("4")} className="number">4</button>
          <button id='five' onClick={() => buttonPress("5")} className="number">5</button>
          <button id='six' onClick={() => buttonPress("6")} className="number">6</button>
          <button id='subtract' onClick={() => buttonPress("-")} className="operator">-</button>
        </div>

        <div className='d-flex justify-content-between'>
          <button id='one' onClick={() => buttonPress("1")} className="number">1</button>
          <button id='two' onClick={() => buttonPress("2")} className="number">2</button>
          <button id='three' onClick={() => buttonPress("3")} className="number">3</button>
          <button id='add' onClick={() => buttonPress("+")} className="operator">+</button>
        </div>

        <div className='d-flex justify-content-between'>
          <button id='zero' onClick={() => buttonPress("0")} className="number">0</button>
          <button id='decimal' onClick={() => buttonPress(".")} className="number">.</button>
          <button id='equals' onClick={() => buttonPress("=")} className="operator">=</button>
        </div>
      </div>
    </div>
  );
}

export default App;
