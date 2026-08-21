
import json, os

directory = "src/messages"
key_map = {
    "bandung-utara": "north-bandung-volcano-tour",
    "bandung-selatan": "south-bandung-crater-lake",
    "bandung-kota": "bandung-city-heritage"
}

for filename in os.listdir(directory):
    if filename.endswith(".json"):
        filepath = os.path.join(directory, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        if "tourData" in data:
            new_tourData = {}
            for old_key, val in data["tourData"].items():
                new_key = key_map.get(old_key, old_key)
                new_tourData[new_key] = val
            data["tourData"] = new_tourData
            
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
                
        print(f"Fixed {filename}")

