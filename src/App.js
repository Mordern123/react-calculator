import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./App.css";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overWrite) {
        return {
          ...state,
          curOperand: payload.digit,
          overWrite: false,
        };
      }
      if (payload.digit === "0" && state.curOperand === "0") return state;
      if (payload.digit === "." && state.curOperand.includes(".")) return state;
      return {
        ...state,
        curOperand: `${state.curOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.curOperand == null && state.preOperand == null) {
        return state;
      }
      if (state.curOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.preOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          preOperand: state.curOperand,
          curOperand: null,
        };
      }
      return {
        ...state,
        preOperand: evaluate(state),
        operation: payload.operation,
        curOperand: null,
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.DELETE_DIGIT:
      if (state.overWrite)
        return {
          ...state,
          overWrite: false,
          curOperand: null,
        };
      if (state.curOperand == null) return state;
      if (state.curOperand.length === 1) {
        return { ...state, curOperand: null };
      }

      return {
        ...state,
        curOperand: state.curOperand.slice(0, -1),
      };
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.curOperand == null ||
        state.preOperand == null
      ) {
        return state;
      }
      return {
        ...state,
        overWrite: true,
        preOperand: null,
        operation: null,
        curOperand: evaluate(state),
      };
      default:
        throw new Error('case wrong')
  }
}

function evaluate({ curOperand, preOperand, operation }) {
  const prev = parseFloat(preOperand);
  const curv = parseFloat(curOperand);
  if (isNaN(prev) || isNaN(curv)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + curv;
      break;
    case "-":
      computation = prev - curv;
      break;
    case "*":
      computation = prev * curv;
      break;
    case "÷":
      computation = prev / curv;
      break;
    case "%":
      computation = prev % curv;
      break;
    default:
      throw new Error('case wrong')
  }
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{ curOperand, preOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="cal-grid d-grid justify-content-center">
      <div className="cal-output d-flex flex-column align-items-end justify-content-between">
        <div className="pre-output">
          {formatOperand(preOperand)} {operation}
        </div>
        <div className="cur-output">{formatOperand(curOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL
      </button>
      <OperationButton operation="%" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
      <OperationButton operation="+" dispatch={dispatch} />
    </div>
  );
}

export default App;
