#!/bin/bash
# Compile TS skill data files to MJS for the seed script
cd "$(dirname "$0")"

echo "Compiling skill data files..."

for i in 1 2 3 4; do
  INPUT="skills-data-${i}.ts"
  OUTPUT="skills-data-compiled-${i}.mjs"
  if [ -f "$INPUT" ]; then
    # Simple transformation: remove type annotations and 'as const'
    sed 's/ as const//g' "$INPUT" > "$OUTPUT"
    echo "  Compiled $INPUT -> $OUTPUT"
  fi
done

echo "Done!"
