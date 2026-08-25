import fs from "node:fs"

const db = {}

function add(name, jsonFile) {
    try {
        db[name] = JSON.parse(fs.readFileSync(`./modules/${jsonFile}`, "utf8"))
    } catch (error) {
        console.error("Failed to load data:", error.message);
    }
}

// Individuella modul .json filer laddas här
add("campaign", "campaign.json")

try {
    fs.writeFileSync("db.json", JSON.stringify(db, null, 2))
    console.log("db.json created successfully")
} catch (e) {
    console.log(e.message)
}