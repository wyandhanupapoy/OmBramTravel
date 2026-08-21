
import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

const sourcePath = path.join(process.cwd(), "src/messages/id.json");
const sourceData = JSON.parse(fs.readFileSync(sourcePath, "utf8"));

const targetLocales = [
  { code: "ms", name: "Bahasa Melayu (Malaysia/Singapore)" },
  { code: "th", name: "Thai (Thailand)" },
  { code: "ta", name: "Tamil (Singapore/India)" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" }
];

async function translate() {
  for (const locale of targetLocales) {
    console.log(`Translating to ${locale.name}...`);
    const prompt = `You are a professional translator. Translate the following JSON content from Bahasa Indonesia to ${locale.name}.
Maintain the exact JSON structure and keys. Only translate the string values. Keep placeholders like {pct} or {em} intact. Do not translate the keys.
Return ONLY valid JSON.

JSON:
${JSON.stringify(sourceData)}`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      
      const outPath = path.join(process.cwd(), `src/messages/${locale.code}.json`);
      fs.writeFileSync(outPath, response.text, "utf8");
      console.log(`Saved ${locale.code}.json`);
    } catch (e) {
      console.error(`Error translating ${locale.code}:`, e);
    }
  }
}

translate();

