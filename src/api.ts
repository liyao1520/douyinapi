import puppeteer from "puppeteer";

export function handleWebcast(
  roomId: string,
  cb: (name: string, content: string, html: string) => void
) {
  puppeteer
    .launch({
      devtools: false,
      slowMo: 400,
      defaultViewport: { width: 1280, height: 800 },
    })
    .then(async (browser) => {
      const page = await browser.newPage();
      await page.goto(`https://live.douyin.com/${roomId}`);
      // 放一个函数到window上,并且这个函数会在node中执行
      await page.exposeFunction(
        "addMessage",
        (name: string, content: string, html: string) => {
          if (content && name && html) {
            cb(name, content, html);
          }
        }
      );

      await page.evaluate(() => {
        function getElementTextWithImg(parent: Node | null) {
          if (!parent || !parent.childNodes) {
            return "";
          }
          let content = "";
          for (const node of parent.childNodes) {
            if (node.nodeType === 1) {
              for (const child of node.childNodes) {
                if (child.nodeType === 3) {
                  //文本
                  content += (child as Text).data;
                } else if (child.nodeType === 1) {
                  // 元素
                  const el = child as HTMLElement;
                  if (el.tagName === "IMG") {
                    content += (el as HTMLImageElement).alt || "";
                  }
                }
              }
            }
          }
          return content;
        }
        const items = document.querySelector(
          ".webcast-chatroom___items > div"
        ) as HTMLDivElement;
        const appendChild = items.appendChild;
        items.appendChild = function (n: Node) {
          const node = n as Element;
          const html = node.innerHTML;
          const div = node.childNodes[0] as HTMLDivElement;

          const name = div.childNodes[1]?.textContent || "";
          const content = getElementTextWithImg(div.childNodes[2]);
          (window as any)["addMessage"](name, content, html);

          return appendChild.call(this, node) as any;
        };
      });
      console.log(`初始化完成!`);
    });
}
