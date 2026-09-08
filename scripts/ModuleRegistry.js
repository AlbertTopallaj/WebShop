const modules =  []
const activeInstances = []

export function registerModule(module) {
    if (!module.descriptor) throw new Error("Module must have a static descriptor")

    modules.push(module)
}

export function registerInstance(instance) {
    console.log(`${instance.constructor.descriptor.name} is instantiated`)
    activeInstances.push(instance)
}

export function getModules() {
    return modules
}

export function getInstances() {
    return activeInstances
}