export class BaseIframe {
  public static openIframe(file: any, src: string) {
    if (file.url) {
      window.open(src, "_blank");
    } else {
      const pdfURL = URL.createObjectURL(file.originFileObj);
      window.open(pdfURL, "_blank");
    }
  }
}
