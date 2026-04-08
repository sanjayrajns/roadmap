import argparse
import json
from pathlib import Path

def parse_llm_json(response_text: str) -> dict:
    """Safely extracts JSON from a probabilistic LLM response string."""
    try:
        # Strip markdown if present
        clean_text = response_text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_text)
    except json.JSONDecodeError:
        print("Warning: LLM returned invalid JSON. Falling back to default strategy.")
        return None

def trim_roadmap(raw_roadmap: dict, user_goals: dict) -> dict:
    """
    Simulates sending the raw_roadmap + user goals to an LLM provider (e.g. Gemini/OpenAI).
    Deterministic fallback enforces output strictly to the Roadmap Schema.
    """
    experience = user_goals.get("experience_level", "beginner")
    time_commit = user_goals.get("time_commitment", 10)

    # Simulated AI logic:
    # If the user has advanced experience, skip the "Fundamentals" stage
    stages = raw_roadmap.get("stages", [])
    if experience == "advanced":
        stages = [s for s in stages if "fundamental" not in s.get("stage_name", "").lower()]

    # If time commitment is low, reduce recommended projects
    if int(time_commit) < 10:
        for stage in stages:
            if len(stage.get("recommended_projects", [])) > 1:
                stage["recommended_projects"] = stage["recommended_projects"][:1]

    custom_roadmap = {
        "role": raw_roadmap.get("role", "unknown"),
        "stages": stages
    }

    return custom_roadmap

def main():
    parser = argparse.ArgumentParser(description='AI Customization for Roadmap payload.')
    parser.add_argument('--role', required=True, help='Role roadmap to load (e.g. frontend)')
    parser.add_argument('--user_goals', required=True, help='JSON string matching User Input Schema')
    args = parser.parse_args()

    tmp_dir = Path(".tmp")
    input_file = tmp_dir / f"{args.role}_roadmap.json"
    output_file = tmp_dir / f"{args.role}_customized.json"

    if not input_file.exists():
        import sys
        sys.stderr.write(f"Error: Required input {input_file} not found. Run ingest_roadmap.py first.\n")
        sys.exit(1)

    with open(input_file, "r", encoding="utf-8") as f:
        raw_roadmap = json.load(f)

    try:
        user_goals = json.loads(args.user_goals)
    except json.JSONDecodeError as e:
        import sys
        sys.stderr.write(f"Error: --user_goals must be valid JSON. Details: {e}\nRaw input: {args.user_goals}\n")
        sys.exit(1)

    # MOCK AI INVOCATION
    customized_payload = trim_roadmap(raw_roadmap, user_goals)

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(customized_payload, f, indent=2)

    print(f"Success: {args.role} tailored and written to {output_file}")

if __name__ == "__main__":
    main()
