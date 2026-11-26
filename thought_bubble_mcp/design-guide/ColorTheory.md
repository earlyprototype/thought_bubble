# Colour choices

Use the theme's background and surface colours for the page and its cards. Use foreground for primary text, muted for secondary details and accent to draw attention to the main finding. Reserve success, warning and error colours for those meanings throughout the page.

Bar, pie and donut charts assign palette colours by position in the data array. For a `sequential` or `diverging` palette, order the rows before rendering so the colours follow the comparison readers should see.

| Intended order | D3 `colorStrategy` | Example |
| --- | --- | --- |
| Distinct groups with no ranking | `categorical` | A consistent colour for each team |
| Low to high | `sequential` | Sort teams by volume from smallest to largest |
| From one extreme to the other | `diverging` | List survey responses from strongly disagree to strongly agree |
| A single series | `monochrome` | Shades of one hue across related bars |

Give a highlighted series a text label. Check the chart in both light and dark themes, including the contrast of muted axis labels. If readers need to distinguish groups without colour, use direct labels or pattern fills.
