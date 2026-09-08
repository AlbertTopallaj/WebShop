import {useState} from "react";
import "./ModuleForm.css"
import {getInstances} from "../../scripts/ModuleRegistry.js";

export default function ModuleForm({module, context}) {
    const descriptor = module.descriptor
    const methods = descriptor.methodsAndInputs[0]

    const [values, setValues] = useState({})
    const [validInputs, setValidInputs] = useState(false)

    const methodInputs = methods.inputs.map(input => {
        if (input.type === "reference") return context[input.name]
        return values[input.name]
    })

    const visibleInputCount = methods.inputs.filter(input => input.type !== "reference").length;

    const instance = getInstances().find(instance => instance.constructor?.descriptor?.name === descriptor.name)

    return (
        <form className={`${descriptor.name} ${visibleInputCount === 1 ? "single" : "multi"}`}
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

                if (input.type === "text") {
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
                    onClick={() => {
                        if (instance) {
                            instance.run(...methodInputs)
                        } else {
                            console.info("Module is not instantiated yet");
                        }
                    }}>
                Add
            </button>
        </form>
    )
}