---
name: "Product Description Writer"
author: "ecom-content"
version: "1.0.0"
type: "prompt"
category: "Content Creation"
license: "MIT"
description: "Write compelling product descriptions optimized for conversion and search engines"
tags:
  - prompt
  - content-creation
  - ai
  - automation
models:
  - gpt-4o
  - claude-3.5-sonnet
  - gemini-1.5-pro
parameters:
  temperature:
    type: number
    default: 0.7
    min: 0
    max: 2
    description: "Controls randomness in output generation"
  max_tokens:
    type: integer
    default: 4096
    min: 256
    max: 16384
    description: "Maximum number of tokens to generate"
  streaming:
    type: boolean
    default: false
    description: "Enable streaming output"
inputs:
  query:
    type: string
    required: true
    description: "Primary input for the skill"
  context:
    type: object
    required: false
    description: "Additional context for processing"
outputs:
  result:
    type: string
    description: "Primary output from the skill"
  metadata:
    type: object
    description: "Execution metadata including tokens used and latency"
---

# Product Description Writer

Write compelling product descriptions optimized for conversion and search engines

## Usage

This skill can be used standalone or as part of an Agent workflow on SkillsHub.

### Standalone

```
skillshub run ecom-content/Product-Description-Writer --input "Your query here"
```

### In Agent

Add this skill to your Agent configuration to enable its capabilities.
