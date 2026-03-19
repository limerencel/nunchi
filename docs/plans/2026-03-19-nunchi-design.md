# nunchi (눈치) - Frontend Design Specification v1.0

## 1. Core Concept: "The Art of Observation"
The name **nunchi** refers to the subtle art of gauging others' thoughts and feelings. The design reflects this by being quiet, sophisticated, and entirely focused on the content. It avoids loud colors and bulky containers, opting instead for a "Hyper-Clean" aesthetic that feels more like a modern editorial or a high-end discovery platform.

---

## 2. Design System: Colors & Hierarchy
The design follows a **Pure Monochrome Grayscale** approach. Hierarchy is created through tonal shifts, font weights, and whitespace rather than color.

### Palette (OKLCH with Hex Equivalents):
| Element | Day Mode (Light) | Night Mode (Dark) |
| :--- | :--- | :--- |
| **Background** | `oklch(99% 0 0)` (#ffffff) | `oklch(12% 0 0)` (#0d0d0d) |
| **Surface** | `oklch(96% 0 0)` (#f5f5f5) | `oklch(18% 0 0)` (#1a1a1a) |
| **Primary Text** | `oklch(15% 0 0)` (#1a1a1a) | `oklch(92% 0 0)` (#f2f2f2) |
| **Secondary Text** | `oklch(45% 0 0)` (#737373) | `oklch(65% 0 0)` (#a3a3a3) |
| **Accents/Buttons** | `oklch(15% 0 0)` (#1a1a1a) | `oklch(92% 0 0)` (#f2f2f2) |
| **Dividers** | `oklch(92% 0 0)` (#e5e5e5) | `oklch(25% 0 0)` (#404040) |

### Spacing Scale:
Use a consistent spacing system based on a 4px grid:
- `4px` (xs), `8px` (s), `12px` (m), `16px` (l), `24px` (xl), `32px` (2xl), `48px` (3xl), `64px` (4xl)

---

## 3. Typography: "Modern meets Heritage"
A unique pairing that bridges modern tech with classical editorial styles.

- **The Sans (Latin/English)**: **'Instrument Sans'**
  - **Usage**: All UI elements, navigation, and primary headlines.
  - **Hierarchy**:
    - **H1**: `32px` / `2rem`, bold (700), tracking `-0.02em`
    - **H2**: `20px` / `1.25rem`, bold (700), tracking `-0.01em`
    - **UI/Nav**: `16px` / `1rem`, medium (500)
    - **Small Caps/Meta**: `14px` / `0.875rem`, semi-bold (600), tracking `0.02em`
- **The Serif (CJK/Asian Characters)**: **'Noto Serif'** (Source Han Serif)
  - **Usage**: The body content of posts and long-form thoughts.
  - **Hierarchy**:
    - **Body Content**: `18px` / `1.125rem`, regular (400), line-height `1.6` to `1.8`

---

## 4. Structural Layout (3-Column Asymmetry)
Moved away from a centered "box" to a professional, asymmetrical grid.

1. **Left Sidebar (Navigation)**: 
   - **Width**: `240px` (Desktop) / `80px` (Compact) / `60px` (Mobile Bottom Nav)
   - **Logo**: Minimalist "nunchi" in heavy Sans.
   - **Links**: Icon (28px) + Label (16px), 16px gap, 12px vertical padding.
2. **Center Column (The Feed)**: 
   - **Width**: Flexible (`minmax(0, 1fr)`), max-width `600px` for optimal reading.
   - **Posts**: No borders, no cards. Separated by `1px` horizontal line (`--divider`).
   - **Padding**: `24px` on all sides of a post item.
3. **Right Sidebar (Discovery)**: 
   - **Width**: `300px` (Desktop) / Hidden (Mobile)
   - **Trending**: Surface-colored blocks with `16px` border-radius and `20px` padding.

---

## 5. Component Breakdown: The "Hyper-Clean" Feed Item
A post should be structured as follows:
- **Header**: Username (bold Sans) + Timestamp (secondary text) + Category (pill style).
- **Body**: Title (bold Sans, large) + Content (regular Serif, line-height 1.6).
- **Footer (Action Bar)**: Minimalist icons for Reply, Like, View Count, Share.
  - **Icons**: 18px size, 1.5px stroke weight.
  - **Hover**: Icons should change to their primary text color, but without bulky backgrounds.

---

## 6. Interaction & Motion Rules
1. **Never use generic animations**: Avoid "bouncing" or "sliding" from far away.
2. **Staggered Entry**: Feed items should use a subtle spring animation (`stiffness: 300, damping: 24`). Offset each item by `0.1s`.
3. **Active States**: Any button or interactive surface should scale to `0.98` on `:active`.
4. **Hover States**: Feed items transition to `--surface` background color over `0.2s ease`.
5. **Theme Transition**: Use `transition: background-color 0.3s ease, color 0.3s ease;` on the `body` element.

---

## 7. Implementation Principles
- **Container-less Design**: Do not wrap elements in cards unless they are secondary information in the Discovery sidebar.
- **Hairline Dividers**: Always use `1px` for lines, never `2px` or more.
- **Grayscale Priority**: If you feel the need for color, use a weight of gray or an inversion of the primary palette instead.
- **Responsive Adaptation**: On mobile, the left sidebar becomes a bottom bar, and the right sidebar is hidden. The feed takes up `100%` width with `0px` side margins.
