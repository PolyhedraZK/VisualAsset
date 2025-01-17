# VisualAsset Repository

## Overview
This repository stores visual assets related to various Polyhedra projects (EXPchain, Expander, Polyhedra, Proof Cloud, etc.).
Whenever changes are made to the main branch, these assets are automatically synced to Google Cloud Storage via GitHub Actions.

## Directory Structure
- **EXPchain**: Contains EXPchain-specific logos, 3D animations, and other media assets in various formats (SVG, MP4, GIF).
- **Expander**: Contains Expander project assets including 3D animations and vector logos.
- **Illustration**: Contains blog images, web illustrations, and litepaper figures organized by project.
- **Polyhedra**: Contains Polyhedra-related assets including animations and branding materials.
- **Proof Cloud**: Contains assets for Proof Cloud media and branding, including 3D animations and vector logos.
- **zkBridge**: Contains assets for zkBridge protocol branding and demonstrations.
- **Deck**: Contains presentation and deck-related assets.
- **element**: Contains UI and design element assets.

## Asset Guidelines
### Supported Formats
- Vector Graphics: SVG
- Raster Images: PNG, JPG
- Animations: MP4, GIF
- High-resolution assets use @2x suffix

### Naming Conventions
- Use descriptive, meaningful filenames that reflect the asset's content
- Include format/variant suffixes where applicable (e.g., `_Black on White@2x`)
- Maintain consistent naming across related assets
- Use proper capitalization for project names (e.g., "EXPchain", "Proof Cloud")

## Contributing New Assets
1. Create a new branch for your changes
2. Add or update assets in the appropriate directory
3. Follow the established naming conventions
4. Submit a pull request for review
5. Once merged, assets will automatically sync to Google Cloud Storage

## Continuous Integration / Storage Sync
This repository uses GitHub Actions ([.github/workflows/storage-sync.yml](./.github/workflows/storage-sync.yml)) to automatically upload assets to Google Cloud Storage when changes are merged to the main branch. The workflow:
- Authenticates with Google Cloud
- Syncs all asset directories to the configured storage destination
- Runs automatically on push to main branch

## License and Usage
All assets in this repository are proprietary and confidential. Usage, reproduction, or distribution without explicit permission is prohibited.
