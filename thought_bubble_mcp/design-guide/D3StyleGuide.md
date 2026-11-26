# D3 chart styling

Choose the chart from the question. Use a bar chart to compare quantities, a line chart to follow change over time, and a Sankey diagram to show quantities moving between groups. Reserve pie and donut charts for parts of one whole with at most six categories.

## Axes and captions

Include units in axis labels. Keep categories and time periods in a meaningful order. State the key observation in the section's `description`, or use `chartOptions.title` for a short chart caption.

## Marks and motion

- For a line or area, use `curve: "step"` for a value that changes at discrete points, such as a price schedule. Use `sharp` for straight segments between observations.
- For bars, pies and donuts, keep category order consistent across charts so each category keeps its place in the palette.
- Use emphasis such as `glow` on a dark background to draw attention to a particular value. Keep labels readable over fills and gradients.
- Leave the takeaway visible when animation is disabled. Use labels, and opt into pattern fills when the chart needs an additional way to distinguish groups.
