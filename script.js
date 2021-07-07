const fs = require("fs");

const dist = "./dist";

const files = fs.readdirSync(dist);

const ext = ".js";

files.forEach((file) => {
    const data = fs.readFileSync(dist + "/" + file, "utf-8");
    const lines = data.split("\n");
    let withExt = "";
    lines.forEach((line) => {
        if (line.includes("import")) {
            if (line.indexOf('";') > 0) {
                let lineArr = line.split("");
                lineArr.splice(line.indexOf('";'), 0, ext);
                line = lineArr.join("");
            }
        }
        withExt += line + "\n";
    });
    if (data.includes("import")) {
        fs.writeFileSync(dist + "/" + file, withExt);
    }
});

// copy index.html into ./dist
fs.copyFileSync("./src/index.html", "./dist/index.html");
