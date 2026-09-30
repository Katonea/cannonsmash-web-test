// 가짜 광고 훅 -- 토스 SDK가 붙기 전에 광고 경로를 눌러 보는 용도.
// Ads.jslib이 찾는 window.CannonSmashAds를 그대로 흉내 낸다.
//
// 진짜 광고가 아니다. 이 파일을 실제 배포 index.html에 남기면 광고를 안 틀고
// 보상만 주는 길이 열린다.
(function () {
  function overlay(kind, done) {
    var box = document.createElement("div");
    box.style.cssText =
      "position:fixed;inset:0;z-index:99999;background:#101820;color:#fff;" +
      "display:flex;flex-direction:column;align-items:center;justify-content:center;" +
      "font:20px/1.6 -apple-system,'Segoe UI',sans-serif;gap:18px;";

    var title = document.createElement("div");
    title.style.cssText = "font-size:28px;font-weight:700;";
    title.textContent = kind === "rewarded" ? "보상형 광고 (가짜)" : "전면 광고 (가짜)";

    var clock = document.createElement("div");
    clock.style.cssText = "font-size:56px;font-variant-numeric:tabular-nums;";

    var row = document.createElement("div");
    row.style.cssText = "display:flex;gap:12px;margin-top:12px;";

    var answered = false;
    var timer = null;

    function finish(reward) {
      if (answered) {
        return;
      }
      answered = true;
      clearInterval(timer);
      box.remove();
      console.log("[fake-ads]", kind, "-> done(" + reward + ")");
      done(reward);
    }

    function button(text, reward) {
      var b = document.createElement("button");
      b.textContent = text;
      b.style.cssText =
        "padding:14px 26px;font-size:18px;border:0;border-radius:10px;cursor:pointer;";
      b.onclick = function () {
        finish(reward);
      };
      return b;
    }

    // 건너뛰기는 보상 없음. 보상형이 실패로 돌아가는 길도 눌러 봐야 한다.
    row.appendChild(button("건너뛰기 (보상 없음)", false));
    row.appendChild(button("끝까지 봄 (보상 받음)", true));

    box.appendChild(title);
    box.appendChild(clock);
    box.appendChild(row);
    document.body.appendChild(box);

    // 3초 뒤 저절로 끝난다 -- 아무것도 안 눌렀을 때의 진짜 광고 흐름이다.
    var left = 3;
    clock.textContent = left;
    timer = setInterval(function () {
      left -= 1;
      clock.textContent = left;
      if (left <= 0) {
        finish(true);
      }
    }, 1000);
  }

  window.CannonSmashAds = { show: overlay };
  console.log("[fake-ads] window.CannonSmashAds 준비됨");
})();
