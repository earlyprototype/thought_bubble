# D3 chart styling

Choose the chart from the question. Use a bar chart to compare quantities, a line chart to follow change over time, and a Sankey diagram to show quantities moving between groups. Reserve pie and donut charts for parts of one whole with at most six categories.

## Axes and annotations

Include units in axis labels. Keep categories and time periods in a meaningful order. Write a caption that explains what changed or which comparison matters. For a key observation, supply `chartOptions.annotations` with a short `label` and the corresponding `x` and `y` from the data.

## Marks and motion

- For a line or area, use `curve: "step"` for a value that changes at discrete points, such as a price schedule. Use `sharp` for straight segments between observations.
- Use `colorStrategy` to express category, magnitude or deviation. Keep the meaning consistent across charts.
- Use emphasis such as `glow` on a dark background to draw attention to a particular value. Keep labels readable over fills and gradients.
- Leave the takeaway visible when animation is disabled. Use labels, and opt into pattern fills when the chart needs an additional way to distinguish groups.
