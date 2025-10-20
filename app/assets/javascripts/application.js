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


//cookie code for primary/secondary

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i=0;i < ca.length;i++) {
    let c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}


//UTMS code

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

    // ✅ Add class to body
    document.body.classList.add(`utm-${utms.utm_test}`);
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

  if (utms.utm_test) {
    setCookie("utm_test", utms.utm_test, 7);
    document.body.classList.add(`utm-${utms.utm_test}`);
  } else {
    const savedUTM = getCookie("utm_test");
    if (savedUTM) {
      document.body.classList.add(`utm-${savedUTM}`);
    }
  }


});

if ($(".schoolSelecter")[0]){

      var selectEl = document.querySelector('.schoolSelecter')
      accessibleAutocomplete.enhanceSelectElement({
        autoselect: true,
        confirmOnBlur: true,
        defaultValue: "",
        minLength: 3,
        selectElement: selectEl
      })

      var queryStringParameters = window.location.search
      var previouslySubmitted = queryStringParameters.length > 0
      if (previouslySubmitted) {
        var submittedEl = document.querySelector('.submitted')
        submittedEl.classList.remove('submitted--hidden')
        var params = new URLSearchParams(document.location.search.split('?')[1])
        document.querySelector('.submitted__hide-school').innerHTML = params.get('hide-school')
      }

  }

  


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


//mobile browser detect

function detectMobileBrowser() {
  const ua = navigator.userAgent;
  const vendor = navigator.vendor;

  // Check if user is on a mobile device
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
  if (!isMobile) return null; // not mobile

  // Detect mobile browser
  if (/edg/i.test(ua)) {
    return "Microsoft Edge (Mobile)";
  } else if (/crios/i.test(ua)) {
    return "Google Chrome (iOS)";
  } else if (/chrome/i.test(ua) && /google inc/i.test(vendor)) {
    return "Google Chrome (Android)";
  } else if (/fxios/i.test(ua)) {
    return "Mozilla Firefox (iOS)";
  } else if (/safari/i.test(ua) && /apple/i.test(vendor)) {
    return "Safari (Mobile)";
  } else if (/opr\//i.test(ua)) {
    return "Opera (Mobile)";
  }

  return "Unknown Mobile Browser";
}

const mobileBrowser = detectMobileBrowser();

const browserEl = document.getElementById("browser");

if (mobileBrowser) {
  browserEl.textContent = `You’re using: ${mobileBrowser}`;
} else {
  browserEl.textContent = "You’re not on a mobile device.";
}
