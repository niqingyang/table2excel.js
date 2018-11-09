export default {
  workcellCreated ({ workcell, cell }) {
    const child = cell.children ? cell.children[0] : null;
    if (child && ['INPUT', 'SELECT', 'TEXTAREA'].includes(child.tagName)) {
      workcell.value = child.value
    }
  }
}
