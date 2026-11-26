# Colour choices

Use the theme's background and surface colours for the page and its cards. Use foreground for primary text, muted for secondary details and accent to draw attention to the main finding. Reserve success, warning and error colours for those meanings throughout the page.

| Data relationship | D3 `colorStrategy` | Example |
| --- | --- | --- |
| Distinct groups with no ranking | `categorical` | A consistent colour for each team |
| Ordered magnitude | `sequential` | Increasing intensity for larger volumes |
| Values on either side of a reference | `diverging` | Two hues for deviation above and below a target |
| A single series | `monochrome` | Shades of one hue across related bars |

Give a highlighted series a text label. Check the chart in both light and dark themes, including the contrast of muted axis labels. If readers need to distinguish groups without colour, use direct labels or pattern fills.
