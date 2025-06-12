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
    const nameEl = document.getElementById("name");
    const name2El = document.getElementById("name2");

    if (nameEl) {
      nameEl.textContent = utms.utm_name;
    }

    if (name2El) {
      name2El.textContent = utms.utm_name;
    }
  }

  if (utms.utm_test) {
    const testNameEl = document.getElementById("testname");

    if (testNameEl) {
      testNameEl.textContent = utms.utm_test;
    }
  }

  //email link 

  const emailSubmit = document.getElementById("emailsubmit");

  if (emailSubmit) {
    if (utms.utm_name) {
      const link = document.getElementById("emailsubmit");
      const originalHref = link.getAttribute("href");
      const separator = originalHref.includes('?') ? '&' : '?';
      const newHref = `${originalHref}${separator}utm_name=${encodeURIComponent(utms.utm_name)}`;
      link.setAttribute("href", newHref);
    }
  }

  //form submit

  const formSubmit = document.getElementById("submit");

  if (formSubmit) {
    document.getElementById("therename").value = utms.utm_name
    document.getElementById("testname").value = utms.utm_test
    document.getElementById('submit').submit();
  }
  
 
});


});
