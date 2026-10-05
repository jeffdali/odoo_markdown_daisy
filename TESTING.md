# Manual QA Checklist (`TESTING.md`)

Use this checklist to verify the installation, functionality, and security of `odoo_markdown_daisy` across Odoo 18 and Odoo 19 instances.

---

## 🧪 Verification Scenarios

- [ ] **Clean Installation**:
  - Module installs cleanly on a fresh Odoo 18 CE or Odoo 19 CE database (`./run.sh -d odoo_test -i odoo_markdown_daisy --stop-after-init`) without Python tracebacks or XML validation errors.

- [ ] **Demo Model & Views**:
  - Menu item `Settings > Technical > Daisy Markdown > Daisy Markdown Test` is accessible (with Developer Mode enabled).
  - Clicking "New" opens the form view with the Markdown editor initialized on the `content` field.

- [ ] **Widget Loads Without Console Errors**:
  - Open browser DevTools (F12) → Console tab.
  - Load a record in form view.
  - Verify zero JavaScript errors or warnings related to `EasyMDE`, `marked`, or missing OWL props.

- [ ] **Edit Mode Behavior**:
  - Type markdown content into the editor (headings `# Heading`, lists `- item`, `**bold**`, `*italic*`, code blocks ````code````, tables `| a | b |`).
  - Use editor toolbar buttons (bold, italic, table, link) to format text.
  - Save the record.
  - Confirm the changes are stored in the database without data loss.

- [ ] **Read-Only Mode Rendering**:
  - Switch the form to read-only mode or view an existing record.
  - Headings (`<h1>` - `<h6>`), bold, italics, blockquotes, code blocks, tables, and links render with correct HTML styling.
  - HTML tags are safely rendered using OWL's `t-out` and `markup()`.

- [ ] **Clean Teardown / Lifecycle**:
  - Switch from edit mode to read-only mode, or navigate away to another menu.
  - Confirm the `EasyMDE` instance and CodeMirror DOM nodes are removed cleanly without dangling event listeners or memory leaks.

- [ ] **Preview Widget in List View**:
  - Create a record with >400 characters of Markdown text.
  - Open the list view (`Settings > Technical > Daisy Markdown > Daisy Markdown Test`).
  - Confirm the preview truncates at 200 characters and ends with an ellipsis (`…`).

- [ ] **No External Network Requests (Air-gap Compliance)**:
  - Open DevTools → Network tab.
  - Filter by domain or search for external domains (`cdn.jsdelivr.net`, `cdnjs.cloudflare.com`, etc.).
  - Refresh the page and interact with the editor.
  - Confirm all assets (`easymde.min.js`, `easymde.min.css`, `marked.min.js`) are served directly from `/web/assets/...` or `/odoo_markdown_daisy/...` with zero external calls.

- [ ] **Dark Mode Styling**:
  - Toggle dark mode (system preference or Odoo user preference).
  - Verify that editor toolbar, input area, and rendered preview adjust contrast and colors to remain readable and aesthetically pleasing.
