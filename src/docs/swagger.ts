import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerPath = path.resolve(__dirname, "../../swagger.yml");

const swaggerYaml = fs.readFileSync(swaggerPath, "utf-8");

export const swaggerDocument = YAML.parse(swaggerYaml);

export const swaggerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>FixFlow API Documentation</title>

  <link
    rel="stylesheet"
    href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
  />
</head>

<body>
  <div id="swagger-ui"></div>

  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>

  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: "/swagger.json",
        dom_id: "#swagger-ui",

        deepLinking: true,

        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],

        layout: "StandaloneLayout"
      });
    };
  </script>
</body>
</html>
`;
