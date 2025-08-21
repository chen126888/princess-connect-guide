import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// R2 Storage 設定
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export interface UploadResult {
  success: boolean;
  fileName: string;
  publicUrl: string;
  error?: string;
}

/**
 * 上傳檔案到 Cloudflare R2
 * @param file - 檔案 buffer
 * @param fileName - 檔案名稱
 * @param contentType - MIME 類型
 * @param folder - 資料夾路徑 (例如: 'characters', 'icons')
 */
export async function uploadToR2(
  file: Buffer,
  fileName: string,
  contentType: string,
  folder: string = 'characters'
): Promise<UploadResult> {
  try {
    const bucketName = process.env.R2_BUCKET_NAME;
    const publicUrl = process.env.R2_PUBLIC_URL;

    if (!bucketName || !publicUrl) {
      throw new Error('R2 配置不完整: 缺少 BUCKET_NAME 或 PUBLIC_URL');
    }

    // 建構完整的物件鍵 (路徑)
    const objectKey = folder ? `${folder}/${fileName}` : fileName;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: file,
      ContentType: contentType,
      // 設定為公開讀取
      ACL: 'public-read',
    });

    await r2Client.send(command);

    // 建構公開 URL
    const fullPublicUrl = `${publicUrl}/${objectKey}`;

    console.log(`✅ 檔案上傳成功: ${objectKey} -> ${fullPublicUrl}`);

    return {
      success: true,
      fileName: objectKey,
      publicUrl: fullPublicUrl,
    };
  } catch (error: any) {
    console.error('❌ R2 上傳失敗:', error);
    return {
      success: false,
      fileName,
      publicUrl: '',
      error: error.message || '未知錯誤',
    };
  }
}

/**
 * 驗證 R2 配置是否完整
 */
export function validateR2Config(): { valid: boolean; missing: string[] } {
  const requiredVars = [
    'R2_ACCOUNT_ID',
    'R2_ACCESS_KEY_ID', 
    'R2_SECRET_ACCESS_KEY',
    'R2_BUCKET_NAME',
    'R2_PUBLIC_URL'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);

  return {
    valid: missing.length === 0,
    missing
  };
}