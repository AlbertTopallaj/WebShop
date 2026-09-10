import {useState} from "react";
import "./ModuleForm.css"
import {getInstances} from "../../scripts/ModuleRegistry.js";
import {useToast} from "../Toast/Toast.jsx";
import {getCart} from "../CartContext/CartContext.jsx";

export default function ModuleForm({module, context}) {
    const descriptor = module.descriptor
    const methods = descriptor.methodsAndInputs[0]

    const [values, setValues] = useState({})
    const [validInputs, setValidInputs] = useState(false)
    const {toast} = useToast()

    const methodInputs = methods.inputs.map(input => {
        if (input.type === "reference") return context[input.name]
        return values[input.name]
    })

    const {refreshCart} = getCart()

    const visibleInputCount = methods.inputs.filter(input => input.type !== "reference").length;

    const instance = getInstances().find(instance => instance.constructor?.descriptor?.name === descriptor.name)

    return (
        <form className={`${descriptor.name} ${visibleInputCount === 1 ? "single" : "multi"}`}
              onSubmit={(e) =>  e.preventDefault()}
              onChange={(e) => {
                  setValues(
                      {
                          ...values,
                          [e.target.name]: e.target.value
                      })
                  setValidInputs(e.currentTarget.checkValidity())
              }}
        >

            {methods.inputs.map(input => {

                if (input.type === "text" || input.type === "number") {
                    return (
                        <div className={"module-input"} id={input.name}>
                            <input
                                type={input.type}
                                name={input.name}
                                placeholder={input.label}
                                required={input.required}
                                pattern={input.pattern}
                            />
                        </div>
                    )
                }

                if (input.type === "select") {
                    return (
                        <div className="module-option" id={input.name}>
                            <label>{descriptor.name}</label>
                            <select name={input.name} required={input.required}>
                                {input.options.map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )
                }
            })}

            <button className="module-add-button"
                    type="button"
                    disabled={!validInputs || !instance}
                    onClick={async () => {
                        if (!instance) return;
                        try {
                            await instance.run(...methodInputs);
                            refreshCart()
                        } catch (err) {
                            toast(err.message, 2000);
                        }
                    }}>
                Add
            </button>
        </form>
    )
}