export default {
  workcellCreated ({ workcell, cell }) {
    const child = cell.children ? cell.children[0] : null;
    if (child && child.tagName === 'A') {
      workcell.value = { text: child.innerText, hyperlink: child.href }
    }
  }
}
