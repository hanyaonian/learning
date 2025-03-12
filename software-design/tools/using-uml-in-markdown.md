# System design tools

在项目的 md 文档中中留下 uml 设计图.

- plantuml
- mermaid

## PlantUml

- https://plantuml.com/
- https://plantuml.com/guide

### Setup enviorment

- VSCODE: install `markdown-preview-enhanced`, `PlantUML` plugins

## Mermaid

- https://mermaid.js.org/intro/
- https://docs.github.com/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams

VSCODE: install `bierner.markdown-mermaid` plugins

### Example

Here is a simple flow chart:

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```
