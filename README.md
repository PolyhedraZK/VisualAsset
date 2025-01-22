# VisualAsset Repository

## Overview
This repository stores visual assets related to various Polyhedra projects (EXPchain, Expander, Polyhedra, Proof Cloud, etc.).
Whenever changes are made to the main branch, these assets are automatically synced to Google Cloud Storage via GitHub Actions.

## Resource Links：
Prefix: https://visual-assets.polyhedra.network
Suffix: Same path as Github

## Directory Structure
- **Font**: Includes font packs for all Polyhedra projects.
- **Icon**: Includes resources for all Polyhedra projects that draw icons and cannot be used directly in SVG format. (PNG).
- **Image**: Includes all Polyhedra project image resources, mainly large-size website graphics.(PNG, JPG)
- **Logo**: Includes all Polyhedra Logo resources for all projects. EXPchain, Expander, Polyhedra, Proof Cloud, etc. (SVG, MP4, PNG)
- **NFT**: Includes all polyhedra releases of NFT image or video resources. (MP4)
- **SEO**: Includes SEO mapping for all polyhedra projects. (JPG)
### Stopped Updating
- **EXPchain**: Contains EXPchain-specific logos, 3D animations, and other media assets in various formats (SVG, MP4, GIF).「Stop Updating」
- **Expander**: Contains Expander project assets including 3D animations and vector logos.「Stop Updating」
- **Illustration**: Contains blog images, web illustrations, and litepaper figures organized by project.「Stop Updating」
- **Polyhedra**: Contains Polyhedra-related assets including animations and branding materials.「Stop Updating」
- **Proof Cloud**: Contains assets for Proof Cloud media and branding, including 3D animations and vector logos.「Stop Updating」
- **zkBridge**: Contains assets for zkBridge protocol branding and demonstrations.「Stop Updating」
- **Deck**: Contains presentation and deck-related assets.「Stop Updating」
- **element**: Contains UI and design element assets.「Stop Updating」

## Asset Guidelines
### Supported Formats
- Vector Graphics: SVG
- Raster Images: PNG, JPG
- Animations: MP4, GIF
- High-resolution assets use @2x suffix

### Naming Conventions
- Use descriptive, meaningful filenames that reflect the asset's content
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
