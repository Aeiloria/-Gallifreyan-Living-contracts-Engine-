# Gallifreyan Matrix Engine

AEILORIA.CORE circular logic parser and 3D extrusion engine for temporal sigils, double-sided medallions, the four-stage transition `x → z → z'`, and compersion telemetry. The on-screen title is **Gallifreyan Matrix Engine // Freedom Bond Visualizer**. The HUD label `v2.4.0` is hardcoded in `src/App.tsx`. `package.json` version is `0.0.0`.

`main` at `037493a1` (18 Nov 2026, “Created using Colab”) contains two separate pieces:

- The Vite visualizer under `src/`.
- `Copy_of_ember_states_stickers_base_emotions_seprating.ipynb`, a Colab notebook that slices an Emberstates sticker sheet. The visualizer does not import it.

Sherman-grid letter data and `src/data/*` are on branch `cursor/data-gathering-1eb1` (draft pull request 1). This README covers `main`.

## Setup

The lockfile is `bun.lock`. There is no `package-lock.json`.

```bash
bun install
bun run dev
```

`dev` runs `vite --port=3000 --host=0.0.0.0`. Open `http://localhost:3000`.

| Script | Command | What it does |
| --- | --- | --- |
| `dev` | `vite --port=3000 --host=0.0.0.0` | Dev server, all interfaces, port 3000 |
| `build` | `vite build` | Production bundle in `dist/` |
| `preview` | `vite preview` | Serves the production bundle |
| `lint` | `tsc --noEmit` | Typecheck |
| `clean` | `rm -rf dist server.js` | Deletes build output |

`npm ci` cannot run here: npm looks for `package-lock.json`, and this repo does not have one.

`.env.example` lists `GEMINI_API_KEY` and `APP_URL`. `package.json` depends on `@google/genai`, `express`, and `dotenv`. `metadata.json` declares `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`. No file under `src/` imports those packages or reads those variables, and the tree has no server entrypoint. The running UI is the client visualizer.

vite.config.ts turns off HMR and file watching when `DISABLE_HMR=true`.

## Visualizer workflow

`index.html` mounts `src/main.tsx`, which renders `src/App.tsx`.

1. The first frame parses `SOVEREIGN_RESONANCE // COMPERSION_INVARIANT_BOND // DUAL_AUTONOMY_CYCLE` with scenario id `SCENARIO_01`.
2. **Space** toggles playback. Playback is ignored while an input or textarea is focused. Speed cycles `0.5 → 1 → 2`. At speed `1`, progress advances by `0.12` per second, so a full pass lasts about 8.3 seconds.
3. The bottom dock selects a benchmark or, under **+ Custom Semantic Parser**, submits a string. The placeholder example is `NON_COERCIVE_TEMPORAL_EQUILIBRIUM // FREEDOM_BOND`.
4. Click a glyph to open `NodeInspector`. **EQUATIONS (x ⟶ z ⟶ z')** opens `EquationReference`. The rotate control toggles exploded view between `0` and `0.65`.
5. Export downloads an ASCII STL of the live Three.js group, or an SVG blueprint of the parsed model.

Audio is synthesized in the browser by `src/core/audio.ts`. The dock mute button calls `matrixAudio.setMuted`.

## Stages and telemetry

`STAGES` in `src/core/parser.ts`:

| Id | Progress anchor | Meaning |
| --- | --- | --- |
| `STAGE_A` | `0.00` | Baseline `x` |
| `STAGE_B` | `0.33` | Influence `V₁` applied, `x → z` |
| `STAGE_C` | `0.66` | Perturbation `Δz = z - x` |
| `STAGE_D` | `1.00` | Influence removed, `z → z'` |

While playback is running, the stage label is `STAGE_A` below `0.33`, `STAGE_B` from `0.33` up to `0.66`, and `STAGE_C` from `0.66` until progress reaches `1`, which stops playback and sets `STAGE_D`. Seeking uses a different edge: values at or above `0.99` select `STAGE_D`.

The HUD classification is `BASELINE` while progress is at or below `0.33`. After that it shows the model classification.

`computeStageTelemetry` scales the preset block:

- Progress `≤ 0.05`: neutral block (`0.50`, `0.50`, `1`, `1`, `1`).
- Progress `≤ 0.33`: linear ramp from that neutral block toward the preset.
- Progress `≤ 0.66`: the preset block unchanged.
- After that: `FORCED` collapses toward zero, `ADAPTED` eases slightly, and `SELF_SUSTAINING` ticks upward and clamps at `1`.

The five observables on `CompersionTelemetry` are `b_gain_verified`, `a_response_positive`, `non_deprivation`, `non_capture`, and `distinctness_maintained`. The type comment describes a target of `b_gain_verified >= 0.85`. The solver does not enforce that target. Preset numbers below are the literals the UI actually plays. They are scenario constants, not measurements.

`EquationReference` documents `SELF_SUSTAINING` and `FORCED`. `ADAPTED` is a real classification in `PRESET_SCENARIOS` and in `computeStageTelemetry`. `BASELINE` is the early-playback label in the HUD and in `TelemetryPanel`, and the canvas uses it as the color fallback; the parser never returns it.

## Benchmarks and custom text

`parseGallifreyanSyntax(rawText, scenarioId?)` uppercases and trims the string. An empty string becomes `AEILORIA_CORE_TEMPORAL_SIGIL`. Tokens split on whitespace, `/`, `_`, and `-`.

Geometry is deterministic from that string:

- Ring count is `3 + (wordCount % 4)`, clamped to 3–6.
- Token count is `wordCount + 2`, clamped to 4–10.
- Angles use the golden angle `2.39996323` plus a hash of the whole string.
- `vowelMarkers` is the count of `A E I O U` in the token, or `i % 3` when that count is zero.
- `outerRadius` is `11.5`.

Telemetry and classification come from `scenarioId`. Any id other than `SCENARIO_02`, `SCENARIO_03`, or `SCENARIO_04` uses the self-sustaining block:

| Field | Value |
| --- | --- |
| `b_gain_verified` | `0.94` |
| `a_response_positive` | `0.91` |
| `non_deprivation` | `0.98` |
| `non_capture` | `0.96` |
| `distinctness_maintained` | `0.93` |
| classification | `SELF_SUSTAINING` |

| Id | Tag | Classification | What the card selects |
| --- | --- | --- | --- |
| `SCENARIO_01` | `AEILORIA.FREEDOM.01` | `SELF_SUSTAINING` | Sovereign freedom bond |
| `SCENARIO_02` | `AEILORIA.COERCION.02` | `FORCED` | Coercive capture |
| `SCENARIO_03` | `AEILORIA.DEPRIVATION.03` | `FORCED` | Asymmetric deprivation |
| `SCENARIO_04` | `AEILORIA.ADAPTED.04` | `ADAPTED` | Harmonic adaptation |

Two parsing paths differ:

- First load passes both the sovereign syntax and `SCENARIO_01`. That string splits into 8 words, so the opening medallion has 3 rings and 10 tokens, with the self-sustaining telemetry.
- Choosing any benchmark calls `parseGallifreyanSyntax('', id)`. Glyphs are rebuilt from `AEILORIA_CORE_TEMPORAL_SIGIL` (4 words, 3 rings, 6 tokens). The card’s `rawSyntax` field is displayed nowhere and is not passed in. Telemetry follows the scenario id.
- Custom submit calls `parseGallifreyanSyntax(text)` with no scenario id, so the words change the medallion and the telemetry stays on the self-sustaining block.

Example. The placeholder `NON_COERCIVE_TEMPORAL_EQUILIBRIUM // FREEDOM_BOND` splits into 6 words (`NON`, `COERCIVE`, `TEMPORAL`, `EQUILIBRIUM`, `FREEDOM`, `BOND`): 5 rings, 8 tokens, classification `SELF_SUSTAINING`.

## Exports

`exportToSTL(object, filename)` walks the Three.js group, writes ASCII STL, and downloads it. The dock name is `Gallifreyan_` plus the first 24 sanitized characters of `rawSyntax`, plus `_Medallion.stl`. The call is skipped when the canvas group is still null.

`exportToSVG(model, filename)` draws an 800×800 blueprint from the model (rings, hanging loop, chords, token circles, vowel dots, labels). It does not snapshot the WebGL scene. The dock name ends in `_Blueprint.svg`.

## Layout

| Path | Role |
| --- | --- |
| `src/types/engine.ts` | `PlaybackStage`, `CompersionTelemetry`, `StateVector`, `SyntaxToken`, `GallifreyanMatrixModel`, `ViewportSettings` |
| `src/core/parser.ts` | `STAGES`, `PRESET_SCENARIOS`, `parseGallifreyanSyntax`, `computeStageTelemetry` |
| `src/core/exporter.ts` | `exportToSTL`, `exportToSVG` |
| `src/core/audio.ts` | `matrixAudio` |
| `src/components/BondCanvas3D.tsx` | Three.js medallion |
| `src/components/ControlDock.tsx` | Playback, telemetry, scenario dock |
| `src/components/EquationReference.tsx` | Equations modal |
| `src/components/NodeInspector.tsx` | Glyph inspector |
| `src/components/ScenarioSelector.tsx` | Benchmark cards and custom parser |
| `src/components/TelemetryPanel.tsx` | Observable readouts |
| `src/components/PlaybackBar.tsx` | Stage scrubber |
| `src/components/PhaseSpacePlot.tsx` | `x` vs `z` plot |
| `src/components/CompersionFluxChart.tsx` | Flux chart |

`ViewportSettings.materialFinish` is `POLISHED_BRASS`, `ASTRAL_TITANIUM`, `VOID_OBSIDIAN`, or `KEYLONTIC_IRIDESCENT`.

## Sticker notebook

`Copy_of_ember_states_stickers_base_emotions_seprating.ipynb` is a 10-cell Python 3 notebook. Cell 0 is a Colab badge pointing at this file on `main`. It expects a Colab runtime. The sheet image is not in git. Later cells open this absolute path:

```text
/Anime Fox Elf Gamer Sticker Sheet.png
```

Cell 5 prints a “file not found” message when that path is missing. The notebook has no upload cell.

| Cells | Behavior |
| --- | --- |
| 2 | `!pip install requests`. Later cells do not import `requests`. |
| 3 | Mounts Drive, creates `My Drive/emberstates/Emberstates_Base_sticker_sets/in_review`, opens the PNG with Pillow, and crops a 3×3 grid with integer division (`width // 3`, `height // 3`). Remainder pixels on the right and bottom are left out of every cell. |
| 5 | Displays that same PNG path. |
| 6 | OpenCV contour extract. Threshold `220`, one 5×5 erosion, external contours. Keeps boxes whose width and height are both greater than 150 and less than 90% of the image. Sorts by `(y // 300, x)`. Pads each box by 15 pixels. Writes `emberstates_extracted_sticker_1.png` and upward in the Colab working directory. |
| 8 | Diagnostic plot. Threshold `200`, no erosion, and green boxes for contours larger than 50×50. Those settings are looser than cell 6, so the plot can mark regions cell 6 will drop. |
| 9 | `ember_emotions_in_review(*emotions)` returns `ember_state_{id}` for each argument. The sample call is `ember_emotions_in_review(2, 3, 4, 5, 6, 7)`, which prints `ember_state_2` through `ember_state_7`. The function returns that list. It does not write files or call the visualizer. |

Cell 3 saves with a plain string, not an f-string:

```python
file_path = drive_folder / "emberstates_sticker_{counter}.png"
```

Every crop writes that same filename, so the folder ends up with the last cell only. A formatted name has to include the counter, for example `f"emberstates_sticker_{counter}.png"`.

Cell 2 installs `requests` only. Cells 3–8 import Pillow, OpenCV, NumPy, and Matplotlib. Install those in the runtime before running the slice or contour cells.
