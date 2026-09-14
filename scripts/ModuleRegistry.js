const modules =  []

export function registerModule(module) {
    if (!module.descriptor) throw new Error("Module must have a static descriptor")

    modules.push(module)
}

export function getModules() {
    return modules
}
