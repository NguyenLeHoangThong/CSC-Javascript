import 'dotenv/config';
import { readFileSync, statSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { GEMINI_MODEL, getGeminiClient, isGeminiConfigured } from '../src/lib/gemini';

/**
 * Bài 33 — AI for JavaScript: an AI code reviewer you run from the terminal.
 *
 *   npm run ai:review -- src/services/orderService.ts
 *
 * The point of the lesson is that "ask the AI to review my code" only produces useful
 * output when the prompt is specific: a role, a priority order, and a required output
 * format. A vague "review this" returns generic style advice.
 */

const REVIEW_PROMPT = `Bạn là senior code reviewer cho một dự án Node.js + TypeScript + Express + Prisma.

Hãy review đoạn code dưới đây theo ĐÚNG THỨ TỰ ƯU TIÊN sau:

1. SECURITY — lộ secret, thiếu validate input, thiếu check quyền, SQL/NoSQL injection,
   trả về field nhạy cảm (password, refreshToken), thông báo lỗi lộ thông tin nội bộ.
2. ERROR HANDLING — promise không catch, nuốt lỗi im lặng, thiếu next(err),
   lỗi trả về sai HTTP status.
3. PERFORMANCE — N+1 query, thiếu index, load toàn bộ bảng rồi filter bằng JS,
   thiếu pagination, thiếu cache cho dữ liệu ít đổi.
4. CLEAN CODE — dùng any, hàm quá dài, đặt tên khó hiểu, lặp code, magic number.

QUY TẮC TRẢ LỜI:
- Mỗi vấn đề: [MỨC ĐỘ: CAO/TRUNG BÌNH/THẤP] + số dòng + mô tả 1 câu + cách sửa cụ thể.
- Sắp xếp từ nghiêm trọng nhất xuống.
- Nếu một hạng mục không có vấn đề gì, ghi đúng một dòng: "<Hạng mục>: OK".
- KHÔNG viết lại toàn bộ file, chỉ nêu đoạn cần sửa.
- Trả lời bằng tiếng Việt.`;

const ALLOWED_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];
const MAX_FILE_BYTES = 100 * 1024; // a bigger file blows past the context window and costs more

function fail(message: string): never {
  console.error(`❌ ${message}`);
  process.exit(1);
}

async function main() {
  // process.argv = [node, script, ...args]
  const target = process.argv[2];
  if (!target) {
    fail('Thiếu đường dẫn file.\n   Cách dùng: npm run ai:review -- src/services/orderService.ts');
  }

  if (!isGeminiConfigured()) {
    fail('Chưa có GEMINI_API_KEY. Copy .env.example thành .env rồi điền key.');
  }

  const filePath = resolve(process.cwd(), target);

  let fileStat;
  try {
    fileStat = statSync(filePath);
  } catch {
    fail(`Không tìm thấy file: ${filePath}`);
  }

  if (!fileStat.isFile()) fail(`${target} không phải là file.`);
  if (!ALLOWED_EXTENSIONS.includes(extname(filePath))) {
    fail(`Chỉ review được file ${ALLOWED_EXTENSIONS.join(', ')}`);
  }
  if (fileStat.size > MAX_FILE_BYTES) {
    fail(`File quá lớn (${Math.round(fileStat.size / 1024)}KB > 100KB). Hãy review từng phần.`);
  }

  const code = readFileSync(filePath, 'utf-8');

  console.log(`🔍 Đang review ${target} bằng ${GEMINI_MODEL}...\n`);

  try {
    const response = await getGeminiClient().models.generateContent({
      model: GEMINI_MODEL,
      contents: `${REVIEW_PROMPT}\n\n--- FILE: ${target} ---\n\`\`\`typescript\n${code}\n\`\`\``,
      config: {
        // Low temperature: a review should be reproducible, not creative.
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
    });

    console.log(response.text ?? '(Model không trả về nội dung)');
    console.log(`\n${'─'.repeat(60)}\n💡 Đây là gợi ý của AI — vẫn phải tự đọc và tự quyết định.`);
  } catch (err) {
    fail(`Gọi Gemini thất bại: ${err instanceof Error ? err.message : String(err)}`);
  }
}

void main();
