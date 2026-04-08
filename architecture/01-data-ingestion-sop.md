# SOP 01: Data Ingestion and Graph Mapping

## 1. Goal
Extract and map raw markdown/JSON data from the `roadmap.sh` structure to the finalized `Roadmap Schema` payloads defined in the System Constitution.

## 2. Inputs
- Target role string (e.g., "frontend", "backend")
- Output location for the parsed schema (`.tmp/`)

## 3. Tool Logic (Python)
The deterministic python tool (`tools/ingest_roadmap.py`) will:
1. Initialize environment variables from `.env`.
2. Fetch the metadata structure for the specified role (from cached repos or directly from kamranahmedse/developer-roadmap).
3. Process the hierarchical Markdown/JSON nodes.
4. Translate nodes into the strict `Roadmap Schema`.
5. Write the final JSON file into `.tmp/{role}_roadmap.json`.

## 4. Edge Cases
- **Missing Nodes/Files**: Gracefully fallback to an empty stage array for missing structures.
- **Malformed Markdown**: Use resilient python regex/parsers to identify `[Title]` vs `(URL)`. 
- **Non-Standard Roadmap Patterns**: Force map non-standard branches into the "Alternative Options" branch to prevent breaking strictly linear JSON graphs.

## 5. Usage
```bash
python tools/ingest_roadmap.py --role frontend
```
