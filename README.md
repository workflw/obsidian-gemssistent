# Gemini Assistant for Obsidian

Gemini Assistant is an Obsidian desktop plugin that connects to the local Gemini CLI and provides a Codex-like chat workflow inside your vault.

## Features

- Chat with Gemini from an Obsidian sidebar
- Start separate chat sessions
- Attach the current note or selected Markdown files as context
- Include the active note as context
- Ask Gemini CLI to make controlled edits in the current vault
- Summarize the active note
- Generate text at the cursor or from a selection

## Requirements

- Obsidian Desktop
- Gemini CLI installed and authenticated
- A trusted local environment where you understand that the plugin can ask Gemini CLI to edit files in your vault

Install Gemini CLI and sign in before using this plugin:

```bash
npm install -g @google/gemini-cli
gemini
```

## Security notes

This plugin uses Gemini CLI in non-interactive mode and passes vault context to it when enabled. It can request file edits in your vault via Gemini CLI's editing capabilities.

Before using it on important vaults:

- Keep backups enabled
- Review changes with Obsidian Git or another diff tool
- Do not attach notes containing secrets unless you intend to send that context to Gemini
- Do not commit `data.json`; it may contain local paths, accounts, API keys, or tokens

## Manual installation

Copy these files into your vault under `.obsidian/plugins/gemini-assistant/`:

- `main.js`
- `manifest.json`
- `styles.css`

Then enable the plugin in Obsidian settings.

## Release files

Official Obsidian releases must attach exactly these files to each GitHub release:

- `main.js`
- `manifest.json`
- `styles.css`

The GitHub release tag must match the `version` in `manifest.json`, for example `1.0.0`.
