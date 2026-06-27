const fs = require('fs');

const htmlContent = fs.readFileSync('/Users/lionelfrancis/Downloads/YardVybes.html', 'utf-8');

// Extract the template
const templateMatch = htmlContent.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
if (templateMatch && templateMatch[1]) {
  let template = templateMatch[1];
  try {
    template = JSON.parse(template);
  } catch(e) {
    console.error("Failed to parse template JSON");
  }
  fs.writeFileSync('extracted_template.html', template);
  console.log("Template extracted to extracted_template.html");
} else {
  console.log("Template not found");
}

// Extract manifest keys to see what's there
const manifestMatch = htmlContent.match(/<script type="__bundler\/manifest">([\s\S]*?)<\/script>/);
if (manifestMatch && manifestMatch[1]) {
  try {
    const manifest = JSON.parse(manifestMatch[1]);
    console.log("Manifest contains", Object.keys(manifest).length, "assets:");
    for (const key of Object.keys(manifest)) {
      console.log(`  ${key}: ${manifest[key].mime} (compressed: ${manifest[key].compressed})`);
    }
  } catch(e) {
    console.error("Failed to parse manifest JSON");
  }
} else {
  console.log("Manifest not found");
}

