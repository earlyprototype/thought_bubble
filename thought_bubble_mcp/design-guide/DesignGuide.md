# Designing a thought_bubble visualisation

Start with the question the reader needs to answer. For an API integration, that might be “Which service confirms the payment?” A sequence diagram can show the caller, the response and the point where the order changes state.

Use progressive disclosure. Put the answer in the headline or opening paragraph, show the evidence in the visual, and move implementation details into supporting sections. Keep the source's names, units and qualifications intact.

## Choosing a treatment

- Use Mermaid for steps, messages, states and relationships. Use D3 for measured quantities and comparisons.
- Choose a layout for the reading task. A dashboard lets readers check several measures at a glance. A tutorial lets them follow steps in order.
- Give each visual a caption that explains what the reader can learn from it. Use the same label and colour each time an entity appears.

Before sharing the page, follow the reading order on a narrow screen. Check that the selected systems appear, labels fit, and the main finding is visible with either a light or a dark theme.
