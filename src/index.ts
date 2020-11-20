import { EImgExt, EVueExt } from "./types";

const colors = require("colors/safe");
const sharp = require("sharp");
import {
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
  PathLike
} from "fs";
import { join, extname, basename } from "path";

const log = console.log;
const imgExt = [EImgExt.jpeg, EImgExt.jpeg, EImgExt.png];
const vueExt = [EVueExt.vue];
const defaultExt = ".webp";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function filterFiles<S extends any[], T extends any[]>(
  files: S,
  exts: T
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any[] {
  return files.filter((file) => exts.includes(file));
}

async function transferImgs(filePath: PathLike) {
  const files = readFiles(filePath);
  const imgsFiles = filterFiles(files, imgExt);
  for (const file of imgsFiles) {
    await transferImg(file).catch(console.error);
  }
}

function transferExtForImg(input, ext = defaultExt): string {
  const prePath = join(input, "..");
  const extName = extname(input);
  const name = basename(input);
  const webp = name.substring(0, name.indexOf(extName)) + ext;
  return join(prePath, webp);
}

function transferExtForVue(input, ext = defaultExt): string {
  const prePath = input.substring(0, input.lastIndexOf("/") + 1);
  const extName = extname(input);
  const name = basename(input);
  const webp = name.substring(0, name.indexOf(extName)) + ext;
  return prePath + webp;
}

async function transferImg(input, ext = defaultExt) {
  const output = transferExtForImg(input, ext);
  await sharp(input).toFile(output);
  log(colors.green(`success: ${input} to ${output}`));
}

function readFiles(dir: PathLike): PathLike[] {
  const list: string[] = [];
  const readFile = (filePath) => {
    readdirSync(filePath).forEach((item) => {
      const fullPath = join(filePath, item);
      const stats = statSync(fullPath);
      stats.isDirectory() ? readFile(fullPath) : list.push(fullPath);
    });
    return list;
  };
  return readFile(dir);
}

function transferVueTemplates(filePath: PathLike) {
  const files: PathLike[] = readFiles(filePath);
  const imgsFiles = filterFiles(files, vueExt);
  for (const file of imgsFiles) {
    transferVueTemplate(file);
  }
}

function transferVueTemplate(file: PathLike): void {
  const data = readFileSync(file, "utf-8");
  const regImg = /<img((.|\n)*?)\/>/gi;
  const regPicture = /<picture((.|\n)*?)>/gi;
  const needOverwrite = regImg.test(data) && !regPicture.test(data);
  if (!needOverwrite) return;
  let src;
  const result = data.replace(regImg, ($1, $2): string => {
    const reg = /\b\s*src\b\s*=\s*['"]?([^'"]*)['"]?/gi;
    $2.replace(reg, ($$1, $$2) => {
      src = $$2;
      return $$1;
    });
    if (src) {
      return imgTemplate({
        imgStr: $1,
        src,
        webpSrc: transferExtForVue(src)
      });
    } else {
      return $1;
    }
  });
  writeFileSync(file, result, "utf8");
  log(colors.green(`success: ${file}`));
}

function imgTemplate({
  webpSrc,
  src,
  imgStr
}: {
  webpSrc: string;
  src: string;
  imgStr: string;
}): string {
  return `<picture>
            <source srcset="${webpSrc}" type="image/webp">
            <source srcset="${src}" type="image/jpeg">
            ${imgStr}
          </picture>`;
}

export default async function (src: PathLike): Promise<void> {
  await transferImgs(src);
  transferVueTemplates(src);
}
