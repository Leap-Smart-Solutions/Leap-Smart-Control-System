import cart from "./cart.js";
let app = document.getElementById('app');
let temporaryContent = document.getElementById('temporaryContent');

// load template file
const loadTemplate = () => {
  fetch('../../webpages/shopping/template.html')
  .then(response => response.text())
  .then(html => {
    app.innerHTML = html;
    let contentTab = document.getElementById('contentTab');
    contentTab.innerHTML = temporaryContent.innerHTML;
    temporaryContent.innerHTML = null;
  })
}
loadTemplate();
