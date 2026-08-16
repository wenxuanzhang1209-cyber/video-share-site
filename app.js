(() => {
  const canvas = document.getElementById("qr-code");
  const fallback = document.querySelector(".qr-fallback");
  const pageUrl = document.getElementById("page-url");
  const copyButton = document.getElementById("copy-button");
  const copyFeedback = document.getElementById("copy-feedback");
  const video = document.getElementById("video-player");
  const videoError = document.getElementById("video-error");
  const videoStatus = document.getElementById("video-status");

  const getShareUrl = () => {
    const url = new URL(window.location.href);
    url.hash = "";
    url.search = "";
    url.pathname = url.pathname.replace(/index\.html$/, "");
    if (!url.pathname.endsWith("/")) url.pathname += "/";
    return url.toString();
  };

  const shareUrl = getShareUrl();
  pageUrl.textContent = shareUrl.replace(/^https?:\/\//, "");
  pageUrl.title = shareUrl;

  if (window.QRCode && canvas) {
    window.QRCode.toCanvas(
      canvas,
      shareUrl,
      {
        errorCorrectionLevel: "M",
        margin: 1,
        width: 240,
        color: {
          dark: "#152016",
          light: "#ffffff",
        },
      },
      (error) => {
        if (!error && fallback) fallback.hidden = true;
      },
    );
  } else if (canvas) {
    canvas.hidden = true;
  }

  const showCopyFeedback = (message) => {
    copyFeedback.textContent = message;
    window.setTimeout(() => {
      copyFeedback.textContent = "";
    }, 2200);
  };

  const copyWithFallback = () => {
    const textArea = document.createElement("textarea");
    textArea.value = shareUrl;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    const copied = document.execCommand("copy");
    textArea.remove();
    return copied;
  };

  copyButton.addEventListener("click", async () => {
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
        copied = true;
      } else {
        copied = copyWithFallback();
      }
    } catch {
      copied = copyWithFallback();
    }

    copyButton.textContent = copied ? "已复制" : "复制失败";
    showCopyFeedback(copied ? "链接已复制到剪贴板" : "请手动长按地址复制");
    window.setTimeout(() => {
      copyButton.textContent = "复制";
    }, 2200);
  });

  video.addEventListener("loadedmetadata", () => {
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    if (duration > 0) {
      videoStatus.textContent = `${Math.round(duration / 60)} MIN · READY`; 
    }
  });

  video.addEventListener("error", () => {
    videoError.hidden = false;
    videoStatus.textContent = "LOAD FAILED";
  });
})();
