import os from "os";

function getNameArg(): string {
  const arg = process.argv.find((a) => a.startsWith("--name="));
  return arg?.split("=")[1] ?? "người lạ";
}

function formatRAM(bytes: number): string {
  return (bytes / 1024 / 1024 / 1024).toFixed(2);
}

function main(): void {
  console.log("========== THÔNG TIN HỆ THỐNG ==========");
  console.log(`Node.js version : ${process.version}`);
  console.log(`Hệ điều hành    : ${process.platform}`);
  console.log(`Thư mục hiện tại: ${process.cwd()}`);
  console.log(`Tổng RAM        : ${formatRAM(os.totalmem())} GB`);
  console.log(`Số nhân CPU     : ${os.cpus().length}`);
  console.log("=========================================");
  console.log(`Xin chào, ${getNameArg()}!`);
}

main();
