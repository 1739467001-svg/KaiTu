import {writeFileSync,existsSync} from 'node:fs';
import {randomBytes} from 'node:crypto';
if(existsSync('.env')){console.log('.env 已存在，未覆盖。');}else{writeFileSync('.env',`KAITU_API_TOKEN=${randomBytes(32).toString('hex')}\nKAITU_DOMAIN=localhost\nMAX_UPLOAD_MB=512\n`,{mode:0o600,flag:'wx'});console.log('已生成私有 .env。请本地打开配置域名并查看工作台访问密钥。');}
