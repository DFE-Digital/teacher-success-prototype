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



//submit feedback form

document.addEventListener('DOMContentLoaded', function () {
    const yesButton = document.getElementById('yesfeedback');
    const noButton = document.getElementById('nofeedback');
    const givefeedback = document.getElementById('givefeedback');
    const submitfeedback = document.getElementById('submitfeedback');
    const cancelfeedback = document.getElementById('cancelfeedback');

    if (yesButton) {
        yesButton.addEventListener('click', function () {
          document.getElementById('thanksMessage').style.display = 'block';
          document.getElementById('questionForm').style.display = 'none';
        });
    }

    if (noButton) {
        noButton.addEventListener('click', function () {
          document.getElementById('thanksMessage').style.display = 'block';
          document.getElementById('questionForm').style.display = 'none';
        });
    }

    if (givefeedback) {
        givefeedback.addEventListener('click', function () {
          document.getElementById('feedback-panel').style.display = 'block';
          document.getElementById('dfe-feedback-banner--content-questions').style.display = 'none';

          const panel = document.getElementById('feedback-panel');
          const isExpanded = this.getAttribute('aria-expanded') === 'true';

          this.setAttribute('aria-expanded', String(!isExpanded));
          panel.style.display = isExpanded ? 'none' : 'block';
          panel.setAttribute('aria-hidden', String(isExpanded));

          if (!isExpanded) {
            document.getElementById('feedback_form_input').focus();
          }

        });
    }

    if (submitfeedback) {
        submitfeedback.addEventListener('click', function () {
          document.getElementById('dfe-feedback-banner--content-questions').style.display = 'flex';
          document.getElementById('questionForm').style.display = 'none';
          document.getElementById('problemButton').style.display = 'none';
          document.getElementById('thanksMessage').style.display = 'block';
          document.getElementById('feedback-panel').style.display = 'none';
        });
    }
    if (cancelfeedback) {
        cancelfeedback.addEventListener('click', function () {
          document.getElementById('dfe-feedback-banner--content-questions').style.display = 'flex';
          document.getElementById('feedback-panel').style.display = 'none';
        });
    }
});
