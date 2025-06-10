//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//

window.GOVUKPrototypeKit.documentReady(() => {
  // Add JavaScript here

function getUTMParameters() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_name: params.get('utm_name'),
    utm_test: params.get('utm_test'), // <-- fixed key name
  };
}

document.addEventListener("DOMContentLoaded", () => {

  const utms = getUTMParameters();

  if (utms.utm_name) {
    document.getElementById("name").textContent = `${utms.utm_name}`;
    document.getElementById("testname").textContent = `${utms.utm_test}`;
  }

  if (utms.utm_test) {
    document.getElementById("testname").value = `${utms.utm_test}`;
    document.getElementById('submit').submit();
  }
 
});


})
