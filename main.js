document.addEventListener('DOMContentLoaded', (event) => {
  // const myAlert = document.querySelector('.toast');
  // const bsAlert = new bootstrap.Toast(myAlert);
  // bsAlert.show();
  const toastElList = [].slice.call(document.querySelectorAll('.toast'));
  const toastList = toastElList.map(function (toastEl) {
    return new bootstrap.Toast(toastEl);
  });
  toastList.forEach((toast) => toast.show());

  const userTheme = localStorage.getItem('theme');
  if (userTheme === 'dark') {
    switchDarkTheme();
  } else {
    switchLightTheme();
  }
  
  $("#toggleBtn").click(function () {
    $("#guestbook").toggle(); // 방명록 가시성 토글
    $(this).text(function (index, text) {
      return text === "방명록 켜기" ? "방명록 끄기" : "방명록 켜기"; // 버튼 텍스트 토글
    });
  });
});

// 다크모드, 라이트모드 변경
const switchBtn = document.querySelector('#switchBtn');
const html = document.querySelector('html');
const mode = 'dark';

switchBtn.addEventListener('click', () => {
  if (html.classList.contains(mode)) {
    // html.classList.remove(mode);
    // localStorage.removeItem('theme', 'dark');
    switchLightTheme();

  } else {
    // html.classList.add(mode);
    // localStorage.setItem('theme', 'dark');
    switchDarkTheme();
  }
});

function switchDarkTheme() {
  localStorage.setItem('theme', 'dark');
  html.classList.add(mode);
}

function switchLightTheme() {
  localStorage.removeItem('theme', 'dark');
  html.classList.remove(mode);
}

